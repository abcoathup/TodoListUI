// import choo's template helper
var html = require('choo/html')

// import template
var todoTemplate = require('./todo.js')

// export module
module.exports = function (state, emit) {
    return html `
    <div>
      
      <form onsubmit="${add}" method="POST">
          <label for="message">New todo:</label>
          <input type="text" id="newTodo" name="newTodo">
          <input type="submit" value="Add">
      </form>
      <hr />
      <div class="controls">
        <div class="filters">
            <span><a href="/">all</a></span>
            <span><a href="/done/true">done</a></span>
            <span><a href="/done/false">outstanding</a></span>
      </div>
      </div>
        <br />
      ${state.todoList.map(todoMap)}
      <br><br>

    </div>`

    function todoMap (todo, i) {
        var done = state.params.done
        if (done && done !== todo.done.toString()) {
          return // nothing
        } else {
            return todoTemplate(doneTodo, todo)
        }
    }

    function doneTodo (e) {
        var todoId = e.target.id
        emit('doneTodo', todoId)
    }

    function add(e) {
        e.preventDefault()
        var data = new FormData(e.currentTarget);
        emit('addTodo', data);
    }
}