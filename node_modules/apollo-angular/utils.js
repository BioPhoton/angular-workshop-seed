import { observeOn } from 'rxjs/operator/observeOn';
import { queue } from 'rxjs/scheduler/queue';
import { Observable } from 'rxjs/Observable';
export function fromPromise(promiseFn) {
    return new Observable(function (subscriber) {
        promiseFn().then(function (result) {
            if (!subscriber.closed) {
                subscriber.next(result);
                subscriber.complete();
            }
        }, function (error) {
            if (!subscriber.closed) {
                subscriber.error(error);
            }
        });
        return function () { return subscriber.unsubscribe(); };
    });
}
var ZoneScheduler = /** @class */ (function () {
    function ZoneScheduler(zone) {
        this.zone = zone;
    }
    ZoneScheduler.prototype.schedule = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.zone.run(function () {
            return queue.schedule.apply(queue, args);
        });
    };
    return ZoneScheduler;
}());
export { ZoneScheduler };
export function wrapWithZone(obs) {
    return observeOn.call(obs, new ZoneScheduler(Zone.current));
}
//# sourceMappingURL=utils.js.map