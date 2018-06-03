import { Injectable } from '@angular/core';
import { ApplicationState } from '../statemanagement/application.state';
import { Store } from '@ngrx/store';
import { LocalRepository } from './types/local-repository.type';
import { RepositoriesAddAction } from '../statemanagement/actions/repositories.actions';

@Injectable()
export class AppSandbox {
  repositories$ = this.store.select(state => state.repositories);

  constructor(private store: Store<ApplicationState>) {
  }

  addRepository(repository: LocalRepository): void {
    this.store.dispatch(new RepositoriesAddAction(repository));
  }
}
