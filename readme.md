# Pull stream some

A pull-stream version of `Array.prototype.some` returning a promise.

```js
some(test)
```

```js
const {pull, values, map} = require('pull-stream')
const some = require('psp-some')

pull(
  values(['blue', 'green', 'red']),
  some((x) => x === 'green')
).then(console.log)
// true

pull(
  values(['blue', 'green', 'red']),
  some((x) => x === 'yellow')
).then(console.log)
// false
```
