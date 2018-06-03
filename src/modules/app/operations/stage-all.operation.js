"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fromPromise_1 = require("rxjs/internal/observable/fromPromise");
var operators_1 = require("rxjs/operators");
function stageAll(repo) {
    var index = null;
    return fromPromise_1.fromPromise(repo.refreshIndex()
        .then(function (idx) { return index = idx; })
        .then(function () { return index.addAll('.', 0); })
        .then(function () { return index.write(); })).pipe(operators_1.mapTo(true));
}
exports.stageAll = stageAll;
//# sourceMappingURL=stage-all.operation.js.map