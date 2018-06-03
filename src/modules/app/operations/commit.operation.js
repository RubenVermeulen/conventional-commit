"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodegit_1 = require("nodegit");
var child_process_1 = require("child_process");
var fromPromise_1 = require("rxjs/internal/observable/fromPromise");
function commit(repo, message) {
    var oid = null;
    child_process_1.execSync('npm run precommit', { stdio: [0, 1, 2] });
    return fromPromise_1.fromPromise(repo
        .refreshIndex()
        .then(function (index) { return index.writeTree(); })
        .then(function (oidResult) {
        oid = oidResult;
        return nodegit_1.Reference.nameToId(repo, 'HEAD');
    })
        .then(function (head) {
        return repo.getCommit(head);
    })
        .then(function (parent) {
        return repo.createCommit('HEAD', nodegit_1.Signature.default(repo), nodegit_1.Signature.default(repo), message, oid, [parent]);
    }));
}
exports.commit = commit;
//# sourceMappingURL=commit.operation.js.map