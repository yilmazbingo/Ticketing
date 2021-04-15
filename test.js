const _items = Symbol("stackItems"); //{1}
class Stack {
  constructor() {
    this[_items] = []; //{2}
  }
  //Stack methods
}
