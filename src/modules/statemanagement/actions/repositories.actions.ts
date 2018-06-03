import { ActionTypes } from '../action-types';
import { LocalRepository } from '../../app/types/local-repository.type';

export class RepositoriesSetAction {
  type = ActionTypes.REPOSITORIES_SET;
  payload: {
    repositories: LocalRepository[];
  };

  constructor(repositories: LocalRepository[]) {
    this.payload = {repositories};
  }
}

export class RepositoriesClearAction {
  type = ActionTypes.REPOSITORIES_CLEAR;
  payload: {};

  constructor() {
  }
}

export class RepositoriesAddAction {
  type = ActionTypes.REPOSITORIES_ADD;
  payload: {
    repository: LocalRepository;
  };

  constructor(repository: LocalRepository) {
    this.payload = {repository};
  }
}

export class RepositoriesRemoveAction {
  type = ActionTypes.REPOSITORIES_REMOVE;
  payload: {
    repositoryId: string;
  };

  constructor(repositoryId: string) {
    this.payload = {repositoryId};
  }
}

export type RepositoriesActions =
  | RepositoriesSetAction
  | RepositoriesClearAction
  | RepositoriesAddAction
  | RepositoriesRemoveAction;
