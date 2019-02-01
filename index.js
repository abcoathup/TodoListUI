// import choo
var choo = require('choo')
var html = require('choo/html')
// import web3
var Web3 = require('web3')
// initialize choo
var app = choo()
// Import contract ABI
var contractABI = require("./TodoList.json").abiDefinition

// import template
var main = require('./templates/main.js')

app.use(function (state, emitter) {
    state.todoCount = 0;
    state.todoList = [];

    emitter.on('DOMContentLoaded', async () => {
        // Check for web3 instance. Create if necessary.
        // Access MetaMask
        if (window.ethereum) {
            try {
                await window.ethereum.enable()
            } catch (error) {
                console.log(error)
            }
        }

        // Set up web3 provider
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8555"))

        // Set up contract interface
        state.contractInstance = new web3.eth.Contract(contractABI, "0x04D45b51fe4f00b4478F8b0719Fa779f14c8A194")
        await setTodoState(state);
        emitter.emit('render')

        // Unlock account
        const accounts = await web3.eth.getAccounts()
        web3.eth.personal.unlockAccount(accounts[0], async function (error, result) {
            if (error) {
                console.error(error)
            }
            else {
                web3.eth.defaultAccount = accounts[0]
            }
        });
    })

    emitter.on('addTodo', async (data) => {
        state.contractInstance.methods.addTodo(data.get("newTodo")).send({ from: web3.eth.defaultAccount })
        .on('error', console.error)
        .on('receipt', async receipt => {
            console.log("Success!", receipt)
            state.todoCount = await getTodoCount(state)
            var todo = await getTodo(state, state.todoCount);
            var obj = { todoId: state.todoCount, value: todo.value, done: todo.done }
            state.todoList.push(obj)
            emitter.emit('render')
        })
    })

    emitter.on('doneTodo', async (todoId) => {
        var todo = await getTodo(state, todoId);
        var newDone = !todo.done;
        state.contractInstance.methods.setTodoDone(todoId, newDone).send({ from: web3.eth.defaultAccount })
        .on('error', console.error)
        .on('receipt', async receipt => {
            console.log("Success!", receipt)
            state.todoList[todoId -1].done = newDone;
            emitter.emit('render')
        })
    })
})

// create a route
app.route('/', main)
app.route('/done/:done', main)

// start app
app.mount('div')


function getTodoCount(state) {
    return new Promise(function (resolve, reject) {
        state.contractInstance.methods.todoCount().call().then(function (response) {
            resolve(response);
        });
    });
}

function getTodo(state, todoId) {
    return new Promise(function (resolve, reject) {
        state.contractInstance.methods.todoList(todoId).call().then(function (response) {
            resolve(response);
        });
    });
}

async function setTodoState(state) {
    state.todoCount = await getTodoCount(state);
    state.todoList = [];

    for (var todoId = 1; todoId <= state.todoCount; todoId++) {
        var todo = await getTodo(state, todoId);
        var obj = { todoId: todoId, value: todo.value, done: todo.done }
        state.todoList.push(obj)
    }
}
