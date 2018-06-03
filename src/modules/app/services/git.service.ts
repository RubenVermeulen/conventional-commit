import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import {
  GitProcess,
  IGitExecutionOptions,
  IGitResult
} from 'dugite';
import {
  map,
  mapTo
} from 'rxjs/operators';


@Injectable()
export class GitService {
  constructor() {
  }

  status(pathToRepository: string): Observable<boolean> {
    const command = ['status'];

    return this.execute(pathToRepository, command).pipe(mapTo(true));
  }

  stageAll(pathToRepository: string): Observable<boolean> {
    const command = ['add', '.'];

    return this.execute(pathToRepository, command).pipe(mapTo(true));
  }

  commit(pathToRepository: string, message: string, hooks: boolean = true): Observable<boolean> {
    const command = ['commit', '-F', '-'];
    const options = {stdin: message};

    if (!hooks) {
      command.push('--no-verify');
    }

    return this.execute(pathToRepository, command, options).pipe(mapTo(true));
  }

  numberOfCommits(pathToRepository: string): Observable<number> {
    const command = ['rev-list', '--all', '--count'];

    return this.execute(pathToRepository, command).pipe(
      map(res => Number(res.stdout))
    );
  }

  currentBranch(pathToRepository: string): Observable<string> {
    const command = ['rev-parse', '--abbrev-ref', 'HEAD'];

    return this.execute(pathToRepository, command).pipe(
      map(res => res.stdout)
    );
  }

  private execute(pathToRepository: string, command: string[], options?: IGitExecutionOptions): Observable<IGitResult> {
    return fromPromise(GitProcess.exec(command, pathToRepository, options)).pipe(
      map(res => {
        if (res.exitCode === 0) {
          return res;
        }

        throw new Error(res.stderr);
      })
    );
  }
}
