'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function daisyChain(proxies, obj, prop) {
    var handler = {
        serviceProxies: proxies,
        get: function (target, propKey) {
            var serviceProxies = this.serviceProxies.reverse();
            var effectiveProxies = serviceProxies.filter(function (s) { return Boolean(s[propKey]); });
            if (!proxies.length) {
                return target[propKey];
            }
            return function wrapper() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var chain = effectiveProxies.reduce(function (baseFunc, currentService) {
                    return (_a = currentService[propKey]).bind.apply(_a, [currentService,
                        baseFunc].concat(args));
                    var _a;
                }, target[propKey].bind(obj));
                return chain();
            };
        },
    };
    return new Proxy(prop ? obj[prop] : obj, handler);
}
exports.daisyChain = daisyChain;
//# sourceMappingURL=index.js.map