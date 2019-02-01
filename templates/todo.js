var html = require('choo/html')

module.exports = function (doneTodo, todo) {
  var todoId = todo.todoId;
  var value = todo.value;
  var done = todo.done;

  // create html template
  return html`
    <div><input type="checkbox" id="${todoId}" onclick="${doneTodo}" checked="${done}"> ${value}</div>

  `
}