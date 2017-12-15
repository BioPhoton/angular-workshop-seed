import { NgModule } from '@angular/core';
import { Apollo } from './Apollo';
import { SelectPipe } from './SelectPipe';
export var PROVIDERS = [Apollo];
export var DECLARATIONS = [SelectPipe];
var ApolloModule = /** @class */ (function () {
    function ApolloModule() {
    }
    ApolloModule.decorators = [
        { type: NgModule, args: [{
                    providers: PROVIDERS,
                    declarations: DECLARATIONS,
                    exports: DECLARATIONS,
                },] },
    ];
    /** @nocollapse */
    ApolloModule.ctorParameters = function () { return []; };
    return ApolloModule;
}());
export { ApolloModule };
//# sourceMappingURL=ApolloModule.js.map