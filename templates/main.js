// import choo's template helper
var html = require('choo/html')

// import template
var todo = require('./todo.js')

// export module
module.exports = function (state, emit) {
    return html `
    <div>
      <p>
        Todo: ${state.todoCount}
      </p>

      <form onsubmit="${add}" method="POST">
          <label for="message">New todo:</label>
          <input type="text" id="newTodo" name="newTodo">
          <input type="submit" value="Add">
      </form>

      <br><br>
      ${state.todoList.map(todo)}
      <br><br>

    </div>`

    function add(e) {
        e.preventDefault()
        var data = new FormData(e.currentTarget);
        emit('addTodo', data);
    }
}