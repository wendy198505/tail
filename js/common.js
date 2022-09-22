//封装通用函数，选择，创建Dom
function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function $$$(tagName) {
  return document.createElement(tagName);
}
