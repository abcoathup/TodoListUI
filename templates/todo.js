var html = require('choo/html')

module.exports = function (todo) {
  var todoId = todo.todoId;
  var value = todo.value;
  var done = todo.done;

  var message = ((done == true) ? 'Edit' : 'Done');

  // create html template
    return html`
    <div>
    <button onclick="myFunction()">${message}</button> ${value}
    </div>
  `
}