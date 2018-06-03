import { Injectable } from '@angular/core';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import * as NodeGit from 'nodegit';


@Injectable()
export class NodeGitService {
  constructor() {
  }

  openRepository(pathToRepo: string): Observable<NodeGit.Repository> {
    return fromPromise(
      NodeGit.Repository.open(pathToRepo)
    );
  }
}
