import { Pipe } from '@angular/core';
var SelectPipe = /** @class */ (function () {
    function SelectPipe() {
    }
    SelectPipe.prototype.transform = function (obj, name) {
        if (name === void 0) { name = ''; }
        if (name !== '') {
            return obj && obj.data && obj.data[name];
        }
    };
    SelectPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'select',
                },] },
    ];
    /** @nocollapse */
    SelectPipe.ctorParameters = function () { return []; };
    return SelectPipe;
}());
export { SelectPipe };
//# sourceMappingURL=SelectPipe.js.map