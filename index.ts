'use strict';

export function daisyChain<P, T>(
  proxies: P[],
  target: T,
  prop?: string,
): T {
  const handler = {
    serviceProxies: proxies,

    get(proxyTarget: T, propKey: string) {

      // proxied services are ordered by intended execution
      // (we need to chain them in reverse order)
      const serviceProxies: Array<P> = this.serviceProxies.reverse();

      // find proxies for the intended method
      const effectiveProxies = serviceProxies.filter(s => Boolean(s[propKey]));

      // if none, return the original method
      if (!effectiveProxies.length) {
        return proxyTarget[propKey];
      }

      // else, return a function that is a chain of proxies
      // each proxy method has reference to the next target method
      // (or original method, on last)
      return function wrapper(...args: any[]) {
        const chain = effectiveProxies.reduce((baseFunc, currentProxy) =>
          currentProxy[propKey].bind(
            currentProxy,
            baseFunc,
            ...args,
          ),
          proxyTarget[propKey].bind(target),
        );
        return chain();
      };
    },
  };

  const targetObj = prop ? target[prop] : target;
  return new Proxy(targetObj, handler);
}
