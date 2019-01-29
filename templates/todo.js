var html = require('choo/html')

module.exports = function (todo) {
  var todoId = todo.todoId;
  var value = todo.value;
  var done = todo.done;

  // create html template
  return html`
  <div>${todoId} ${value} ${done}</div>\
  `
}