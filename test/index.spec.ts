'use strict';

import { expect } from 'chai';
import { daisyChain } from '../index';

type MessageFunc = (args: any) => string;

interface IDaisyChainPrint {
  print(next: MessageFunc, ...args: any[]): string;
  printWithContext(next: MessageFunc, ...args: any[]): string;
}

interface IDaisyChainSkip {
  skip(next: MessageFunc, ...args: any[]): string;
}

interface IDaisyChainBypass {
  bypass(next: MessageFunc, ...args: any[]): string;
}

abstract class Base {
  protected baseServiceId: string;

  constructor() {
    this.baseServiceId = '4';
  }
}

class Service extends Base {
  private serviceId: string;

  constructor() {
    super();
    this.serviceId = '3';
  }

  public bypass(message: string) {
    return message;
  }

  public print() {
    return '3';
  }

  public skip() {
    return '3';
  }

  public printWithContext() {
    return `${this.baseServiceId}-${this.serviceId}`;
  }
}

class ServiceProxy1 extends Base implements
  IDaisyChainPrint,
  IDaisyChainSkip,
  IDaisyChainBypass {
  private serviceId: string;

  constructor() {
    super();
    this.serviceId = '1';
  }

  public bypass(next: MessageFunc, ...args) {
    return (<any>next)(...args);
  }

  public print(next: MessageFunc, ...args) {
    return (<any>next)(...args) + '-1';
  }

  public skip(next: MessageFunc, ...args) {
    return (<any>next)(...args) + '-1';
  }

  public printWithContext(next: MessageFunc, ...args) {
     return (<any>next)(...args) + `-${this.serviceId}`;
  }
}

class ServiceProxy2 extends Base implements
  IDaisyChainPrint,
  IDaisyChainBypass {
  private serviceId: string;

  constructor() {
    super();
    this.serviceId = '2';
  }

  public bypass(next: MessageFunc, ...args) {
    return (<any>next)(...args);
  }

  public print(next: MessageFunc, ...args) {
    return (<any>next)(...args) + '-2';
  }

  public printWithContext(next: MessageFunc, ...args) {
     return (<any>next)(...args) + `-${this.serviceId}`;
  }
}

describe('index', () => {
  it('should call the proxy members on the target', () => {
    const service = new Service();

    const proxy = daisyChain([
      new ServiceProxy1(),
      new ServiceProxy2(),
    ], service);

    const output = proxy.bypass('hello world');
    expect(output).to.equal('hello world');
  });

  it('should call the proxy members on the target property', () => {
    const service = new Service();

    const proxy = daisyChain([
      new ServiceProxy1(),
      new ServiceProxy2(),
    ], service, '__proto__');

    const output = proxy.bypass('hello world');
    expect(output).to.equal('hello world');
  });

  it('should call the proxies in the intended order', () => {
    const service = new Service();

    const proxy = daisyChain([
      new ServiceProxy1(),
      new ServiceProxy2(),
    ], service, '__proto__');

    const output = proxy.print();
    expect(output).to.equal('3-2-1');
  });

  it('should ignore proxies in the chain that dont provide the target member', () => {
    const service = new Service();

    const proxy = daisyChain([
      new ServiceProxy1(),
      new ServiceProxy2(),
    ], service, '__proto__');

    const output = proxy.skip();
    expect(output).to.equal('3-1');
  });

  it('should ensure `this` context is correctly bound when proxies are called', () => {
    const service = new Service();

    const proxy = daisyChain([
      new ServiceProxy1(),
      new ServiceProxy2(),
    ], service, '__proto__');

    const output = proxy.printWithContext();
    expect(output).to.equal('4-3-2-1');
  });
});
