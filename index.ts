'use strict';

export function daisyChain(proxies: Array<Object>, obj: Object, prop?: string): Object {
  const handler = {

    serviceProxies: proxies,

    get(target: Object, propKey: string) {

      // proxied services are ordered by intended execution (we need to chain them in reverse order)
      const serviceProxies: Array<Object> = this.serviceProxies.reverse();

      // find proxies for the intended method
      const effectiveProxies = serviceProxies.filter(s => Boolean(s[propKey]));

      // if none, return the original method
      if (!proxies.length) {
        return target[propKey];
      }

      // else, return a function that is a chain of proxies
      // each proxy method has reference to the next target method (or original method, on last)
      // proxies take the signature: (target, ...args) { ... }
      return function wrapper(...args) {
        const chain = effectiveProxies.reduce((baseFunc, currentService) =>
          currentService[propKey].bind(
            currentService,
            baseFunc,
            ...args,
          ),
          target[propKey].bind(obj),
        );
        return chain();
      };
    },
  };

  return new Proxy(prop ? obj[prop] : obj, handler);
}
