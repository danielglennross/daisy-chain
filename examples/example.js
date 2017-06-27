'use strict';

const daisyChain = require('../index');

class Base {
  constructor() {
    this.baseServiceId = '4';
  }
}

class Service extends Base {
  constructor() {
    super();
    this.serviceId = '3';
  }

  print() {
    return `${this.baseServiceId}-${this.serviceId}`;
  }
}

class ServiceProxy1 extends Base {
  constructor() {
    super();
    this.serviceId = '2';
  }

  print(next, ...args) {
    return next(...args) + `-${this.serviceId}`;
  }
}

class ServiceProxy2 extends Base {
  constructor() {
    super();
    this.serviceId = '1';
  }

  print(next, ...args) {
    return next(...args) + `-${this.serviceId}`;
  }
}

const service = new Service();

const proxy = daisyChain([
  new ServiceProxy1(),
  new ServiceProxy2(),
], service, '__proto__');

const output = proxy.print() === '4-3-2-1';
