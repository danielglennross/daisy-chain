'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var Base = (function () {
    function Base() {
        this.baseServiceId = '4';
    }
    return Base;
}());
var Service = (function (_super) {
    __extends(Service, _super);
    function Service() {
        var _this = _super.call(this) || this;
        _this.serviceId = '3';
        return _this;
    }
    Service.prototype.print = function () {
        return this.baseServiceId + "-" + this.serviceId;
    };
    return Service;
}(Base));
var ServiceProxy1 = (function (_super) {
    __extends(ServiceProxy1, _super);
    function ServiceProxy1() {
        var _this = _super.call(this) || this;
        _this.serviceId = '1';
        return _this;
    }
    ServiceProxy1.prototype.print = function (next) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return next.apply(void 0, args) + ("-" + this.serviceId);
    };
    return ServiceProxy1;
}(Base));
var ServiceProxy2 = (function (_super) {
    __extends(ServiceProxy2, _super);
    function ServiceProxy2() {
        var _this = _super.call(this) || this;
        _this.serviceId = '2';
        return _this;
    }
    ServiceProxy2.prototype.print = function (next) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return next.apply(void 0, args) + ("-" + this.serviceId);
    };
    return ServiceProxy2;
}(Base));
var service = new Service();
var proxy = index_1.default([
    new ServiceProxy1(),
    new ServiceProxy2(),
], service, '__proto__');
var output = proxy.print() === '4-3-2-1';
//# sourceMappingURL=example.js.map