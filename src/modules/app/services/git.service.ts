import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import {
  GitProcess,
  IGitExecutionOptions,
  IGitResult
} from 'dugite';
import { map } from 'rxjs/operators';


@Injectable()
export class GitService {
  constructor() {
  }

  stageAll(pathToRepository: string): Observable<boolean> {
    const command = ['add', '.'];

    return this.execute(pathToRepository, command).pipe(
      map(res => res.exitCode === 0)
    );
  }

  commit(pathToRepository: string, message: string, hooks: boolean = true): Observable<boolean> {
    const command = ['commit', '-F', '-'];
    const options = {stdin: message};

    if (!hooks) {
      command.push('--no-verify');
    }

    return this.execute(pathToRepository, command, options).pipe(
      map(res => res.exitCode === 0)
    );
  }

  private execute(pathToRepository: string, command: string[], options?: IGitExecutionOptions): Observable<IGitResult> {
    return fromPromise(GitProcess.exec(command, pathToRepository, options));
  }
}
