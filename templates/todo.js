var html = require('choo/html')

module.exports = function (todo) {
  var value = todo.value

  // create html template
  return html`
  <p>${value}</p>\
  `
}