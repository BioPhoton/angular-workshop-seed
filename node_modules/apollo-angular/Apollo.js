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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Injectable } from '@angular/core';
import { ApolloClient, } from 'apollo-client';
import { from } from 'rxjs/observable/from';
import { QueryRef } from './QueryRef';
import { fromPromise, wrapWithZone } from './utils';
var ApolloBase = /** @class */ (function () {
    function ApolloBase(_client) {
        this._client = _client;
    }
    ApolloBase.prototype.watchQuery = function (options) {
        return new QueryRef(this.client.watchQuery(__assign({}, options)));
    };
    ApolloBase.prototype.query = function (options) {
        var _this = this;
        return fromPromise(function () {
            return _this.client.query(__assign({}, options));
        });
    };
    ApolloBase.prototype.mutate = function (options) {
        var _this = this;
        return fromPromise(function () {
            return _this.client.mutate(__assign({}, options));
        });
    };
    ApolloBase.prototype.subscribe = function (options) {
        return wrapWithZone(from(this.client.subscribe(__assign({}, options))));
    };
    ApolloBase.prototype.getClient = function () {
        return this._client;
    };
    ApolloBase.prototype.setClient = function (client) {
        if (this._client) {
            throw new Error('Client has been already defined');
        }
        this._client = client;
    };
    Object.defineProperty(ApolloBase.prototype, "client", {
        get: function () {
            this.beforeEach();
            return this._client;
        },
        enumerable: true,
        configurable: true
    });
    ApolloBase.prototype.beforeEach = function () {
        this.checkInstance();
    };
    ApolloBase.prototype.checkInstance = function () {
        if (!this._client) {
            throw new Error('Client has not been defined yet');
        }
    };
    return ApolloBase;
}());
export { ApolloBase };
var Apollo = /** @class */ (function (_super) {
    __extends(Apollo, _super);
    function Apollo() {
        var _this = _super.call(this) || this;
        _this.map = new Map();
        return _this;
    }
    Apollo.prototype.create = function (options, name) {
        if (name && name !== 'default') {
            this.createNamed(name, options);
        }
        else {
            this.createDefault(options);
        }
    };
    Apollo.prototype.default = function () {
        return this;
    };
    Apollo.prototype.use = function (name) {
        if (name === 'default') {
            return this.default();
        }
        return this.map.get(name);
    };
    Apollo.prototype.createDefault = function (options) {
        if (this.getClient()) {
            throw new Error('Apollo has been already created.');
        }
        return this.setClient(new ApolloClient(options));
    };
    Apollo.prototype.createNamed = function (name, options) {
        if (this.map.has(name)) {
            throw new Error("Client " + name + " has been already created");
        }
        this.map.set(name, new ApolloBase(new ApolloClient(options)));
    };
    Apollo.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Apollo.ctorParameters = function () { return []; };
    return Apollo;
}(ApolloBase));
export { Apollo };
//# sourceMappingURL=Apollo.js.map