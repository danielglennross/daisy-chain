# daisychain
Create a pipeline of proxy objects that will wrap over a target object.

## Install
`npm install --save daisy-chain`

## API

# daisyChain(proxies, target, prop?)

* `proxies` (Object[]): an array of proxy objects.
* `target` (Object): a target object.
* `prop` (String): an optional property on the target the proxies will wrap over. (If not provided, the proxies will wrap over `target`).

A proxy can provide a wrapper over any property/ function on the target object (or property on the target object).

The order of the proxies in the proxy array determines their execution order.

Each proxy object can wrap a target property/ function with the signature:

```javascript
foobar(next, ...args)
```

* `next` is the next `foobar` proxy call in the pipeline (or the original `foobar` call) on the target object/ specified target object property.
* `args` are the provided arguments to `foobar`.

## Example (javascript)
```javascript
const daisyChain = require('daisy-chain');

class Greeting {
  constructor() {
    this.message = 'hello';
  }

  greet() {
    return this.message;
  }
}

class GreetingWorld {
  constructor() {
    this.message = ' world';
  }

  greet(next, ...args) {
    return next(...args) + this.message;
  }
}

class GreetingLogger {
  greet(next, ...args) {
    const result = next(...args);
    console.log(result);
    return result;
  }
}

const target = new Greeting();
const proxyPipeline = [new GreetingLogger(), new GreetingWorld()];
const wrappedTarget = daisyChain(proxyPipeline, target);

wrappedTarget.greet(); // hello world
```

see [examples](https://github.com/danielglennross/daisy-chain/tree/master/examples)