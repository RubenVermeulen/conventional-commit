import {Index, Repository} from 'nodegit';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {mapTo} from 'rxjs/operators';

export function stageAll(repo: Repository): Observable<any> {
  let index: Index = null;

  return fromPromise(
    repo.refreshIndex()
      .then(idx => index = idx)
      .then(() => index.addAll('.', 0))
      .then(() => index.write())
  ).pipe(mapTo(true));
}
