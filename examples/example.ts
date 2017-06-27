'use strict';

import { daisyChain } from '../index';

type PrintFunc = (args: any) => string;

interface IDaisyChainPrint {
  print(next: PrintFunc, ...args: any[]): string;
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

  public print() {
    return `${this.baseServiceId}-${this.serviceId}`;
  }
}

class ServiceProxy1 extends Base implements IDaisyChainPrint  {
  private serviceId: string;

  constructor() {
    super();
    this.serviceId = '1';
  }

  public print(next: PrintFunc, ...args) {
     return (<any>next)(...args) + `-${this.serviceId}`;
  }
}

class ServiceProxy2 extends Base implements IDaisyChainPrint  {
  private serviceId: string;

  constructor() {
    super();
    this.serviceId = '2';
  }

  public print(next: PrintFunc, ...args) {
     return (<any>next)(...args) + `-${this.serviceId}`;
  }
}

const service = new Service();

const proxy = daisyChain([
  new ServiceProxy1(),
  new ServiceProxy2(),
], service, '__proto__');

const output = proxy.print() === '4-3-2-1';
