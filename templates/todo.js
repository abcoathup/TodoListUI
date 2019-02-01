var html = require('choo/html')

module.exports = function (doneTodo, todo) {
  var todoId = todo.todoId;
  var value = todo.value;
  var done = todo.done;

  var message = ((done == true) ? 'Edit' : 'Done');

  // create html template
  return html`
    <div><button id="${todoId}" onclick="${doneTodo}">${message}</button> ${value}</div>
  `
}