"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var oauth_service_1 = require('./src/oauth-service');
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
__export(require('./src/oauth-service'));
var OAuthModule = (function () {
    function OAuthModule() {
    }
    OAuthModule.forRoot = function () {
        return {
            ngModule: OAuthModule,
            providers: [oauth_service_1.OAuthService]
        };
    };
    OAuthModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [],
                    exports: []
                },] },
    ];
    /** @nocollapse */
    OAuthModule.ctorParameters = function () { return []; };
    return OAuthModule;
}());
exports.OAuthModule = OAuthModule;
//# sourceMappingURL=index.js.map