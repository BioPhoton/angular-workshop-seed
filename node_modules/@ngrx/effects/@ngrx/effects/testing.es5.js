import { Actions } from '@ngrx/effects';
import { defer } from 'rxjs/observable/defer';
function provideMockActions(factoryOrSource) {
    return {
        provide: Actions,
        useFactory: function () {
            if (typeof factoryOrSource === 'function') {
                return defer(factoryOrSource);
            }
            return factoryOrSource;
        },
    };
}
export { provideMockActions };
//# sourceMappingURL=testing.es5.js.map
