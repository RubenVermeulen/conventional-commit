import { Injectable } from '@angular/core';
import { ApplicationState } from '../statemanagement/application.state';
import { Store } from '@ngrx/store';
import { LocalRepository } from './types/local-repository.type';
import { RepositoriesAddAction } from '../statemanagement/actions/repositories.actions';
import { Observable } from 'rxjs/Observable';
import { GitService } from './services/git.service';

@Injectable()
export class AppSandbox {
  repositories$ = this.store.select(state => state.repositories);

  constructor(private store: Store<ApplicationState>,
              private gitService: GitService) {
  }

  addRepository(repository: LocalRepository): void {
    this.store.dispatch(new RepositoriesAddAction(repository));
  }

  commit(pathToRepository: string, message: string, hooks: boolean = true): Observable<boolean> {
    return this.gitService.commit(pathToRepository, message, hooks);
  }
}
