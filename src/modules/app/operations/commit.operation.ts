import * as NodeGit from 'nodegit';
import { execSync } from 'child_process';
import {
  Observable
} from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';

export function commit(repo: NodeGit.Repository, message: string): Observable<any> {
  let oid = null;

  // execSync('npm run precommit', {stdio: [0, 1, 2]});

  return fromPromise(
    repo
      .refreshIndex()
      .then(index => index.writeTree())
      .then(oidResult => {
        oid = oidResult;
        console.log(NodeGit.Reference);
        return NodeGit.Reference.nameToId(repo, 'HEAD');
      })
      .then(head => {
        return repo.getCommit(head);
      })
      .then(parent => {
        return repo.createCommit(
          'HEAD',
          NodeGit.Signature.default(repo),
          NodeGit.Signature.default(repo),
          message,
          oid,
          [parent]
        );
      })
  );
}
