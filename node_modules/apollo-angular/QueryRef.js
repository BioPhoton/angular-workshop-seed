import { from } from 'rxjs/observable/from';
import { wrapWithZone } from './utils';
var QueryRef = /** @class */ (function () {
    function QueryRef(obsQuery) {
        this.obsQuery = obsQuery;
        this.valueChanges = wrapWithZone(from(this.obsQuery));
    }
    // ObservableQuery's methods
    QueryRef.prototype.result = function () {
        return this.obsQuery.result();
    };
    QueryRef.prototype.currentResult = function () {
        return this.obsQuery.currentResult();
    };
    QueryRef.prototype.getLastResult = function () {
        return this.obsQuery.getLastResult();
    };
    QueryRef.prototype.getLastError = function () {
        return this.obsQuery.getLastError();
    };
    QueryRef.prototype.resetLastResults = function () {
        return this.obsQuery.resetLastResults();
    };
    QueryRef.prototype.refetch = function (variables) {
        return this.obsQuery.refetch(variables);
    };
    QueryRef.prototype.fetchMore = function (fetchMoreOptions) {
        return this.obsQuery.fetchMore(fetchMoreOptions);
    };
    QueryRef.prototype.subscribeToMore = function (options) {
        return this.obsQuery.subscribeToMore(options);
    };
    QueryRef.prototype.updateQuery = function (mapFn) {
        return this.obsQuery.updateQuery(mapFn);
    };
    QueryRef.prototype.stopPolling = function () {
        return this.obsQuery.stopPolling();
    };
    QueryRef.prototype.startPolling = function (pollInterval) {
        return this.obsQuery.startPolling(pollInterval);
    };
    QueryRef.prototype.setOptions = function (opts) {
        return this.obsQuery.setOptions(opts);
    };
    QueryRef.prototype.setVariables = function (variables, tryFetch, fetchResults) {
        if (tryFetch === void 0) { tryFetch = false; }
        if (fetchResults === void 0) { fetchResults = true; }
        return this.obsQuery.setVariables(variables, tryFetch, fetchResults);
    };
    return QueryRef;
}());
export { QueryRef };
//# sourceMappingURL=QueryRef.js.map