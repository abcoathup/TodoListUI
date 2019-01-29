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
var todo = require('./templates/todo.js')

app.use(function (state, emitter) {
    state.toDoCount = 0;
    state.todoList = [{value: 'fooey'}];

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
        // Get todo count from contract
        state.todoCount = await getTodoCount(state);
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
})

const main = (state, emit) => {
    return html `
      <div>
        <p>
          Todo: ${state.todoCount}
        </p>

        <br><br>
        ${state.todoList.map(todo)}
        <br><br>

        <form onsubmit="${addTodo}" method="POST">
            <label for="message">New todo:</label>
            <input type="text" id="newTodo" name="newTodo">
            <input type="submit" value="Add">
        </form>
      </div>`

    // Add Todo
    function addTodo(e) {
        e.preventDefault()
        var data = new FormData(e.currentTarget)
        state.contractInstance.methods.addTodo(data.get("newTodo")).send({ from: web3.eth.defaultAccount })
        .on('error', console.error)
        .on('receipt', async receipt => {
            console.log("Success!", receipt)
            state.todoCount = await getTodoCount(state)
            var value = await getLastTodo(state);
            var obj = { value: value }
            state.todoList.push(obj)
            emit('render')
        })
    }
}

// create a route
app.route('/', main)

// start app
app.mount('div')


function getTodoCount(state) {
    return new Promise(function (resolve, reject) {
        state.contractInstance.methods.todoCount().call().then(function (response) {
            resolve(response);
        });
    });
}

function getLastTodo(state) {
    return new Promise(function (resolve, reject) {
        state.contractInstance.methods.getTodoValue(state.todoCount).call().then(function (response) {
            resolve(response);
        });
    });
}
