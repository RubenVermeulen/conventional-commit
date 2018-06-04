import { Injectable } from '@angular/core';
import { ApplicationState } from '../statemanagement/application.state';
import { Store } from '@ngrx/store';
import { LocalRepository } from './types/local-repository.type';
import {
  RepositoriesAddAction,
  RepositoriesRemoveAction
} from '../statemanagement/actions/repositories.actions';
import { Observable } from 'rxjs/Observable';
import { GitService } from './services/git.service';
import { StagedFile } from './types/staged-file.type';
import { UnstagedFile } from './types/unstaged-file.type';

@Injectable()
export class AppSandbox {
  repositories$ = this.store.select(state => state.repositories);

  constructor(private store: Store<ApplicationState>,
              private gitService: GitService) {
  }

  addRepository(repository: LocalRepository): void {
    this.store.dispatch(new RepositoriesAddAction(repository));
  }

  removeRepository(repositoryId: string): void {
    this.store.dispatch(new RepositoriesRemoveAction(repositoryId));
  }

  status(pathToRepository: string): Observable<boolean> {
    return this.gitService.status(pathToRepository);
  }

  stageAll(pathToRepository: string): Observable<boolean> {
    return this.gitService.stageAll(pathToRepository);
  }

  commit(pathToRepository: string, message: string, hooks: boolean = true): Observable<boolean> {
    return this.gitService.commit(pathToRepository, message, hooks);
  }

  numberOfCommits(pathToRepository: string): Observable<number> {
    return this.gitService.numberOfCommits(pathToRepository);
  }

  currentBranch(pathToRepository: string): Observable<string> {
    return this.gitService.currentBranch(pathToRepository);
  }

  stagedFiles(pathToRepository: string): Observable<StagedFile[]> {
    return this.gitService.stagedFiles(pathToRepository);
  }

  untrackedFiles(pathToRepository: string): Observable<string[]> {
    return this.gitService.untrackedFiles(pathToRepository);
  }

  unstagedFiles(pathToRepository: string): Observable<UnstagedFile[]> {
    return this.gitService.unstagedFiles(pathToRepository);
  }
}
