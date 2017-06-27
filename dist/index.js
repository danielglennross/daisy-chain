'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function daisyChain(proxies, target, prop) {
    var handler = {
        serviceProxies: proxies,
        get: function (proxyTarget, propKey) {
            var serviceProxies = this.serviceProxies.reverse();
            var effectiveProxies = serviceProxies.filter(function (s) { return Boolean(s[propKey]); });
            if (!effectiveProxies.length) {
                return proxyTarget[propKey];
            }
            return function wrapper() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var chain = effectiveProxies.reduce(function (baseFunc, currentProxy) {
                    return (_a = currentProxy[propKey]).bind.apply(_a, [currentProxy,
                        baseFunc].concat(args));
                    var _a;
                }, proxyTarget[propKey].bind(target));
                return chain();
            };
        },
    };
    var targetObj = prop ? target[prop] : target;
    return new Proxy(targetObj, handler);
}
exports.daisyChain = daisyChain;
//# sourceMappingURL=index.js.map