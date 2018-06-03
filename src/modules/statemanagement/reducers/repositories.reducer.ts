import { ActionTypes } from '../action-types';
import { RepositoriesActions } from '../actions/repositories.actions';
import { LocalRepository } from '../../app/types/local-repository.type';

export function repositoriesReducer(
  state: LocalRepository[] = [],
  action: RepositoriesActions
): LocalRepository[] {
  switch (action.type) {
    case ActionTypes.REPOSITORIES_SET:
      return [...action.payload.repositories];
    case ActionTypes.REPOSITORIES_CLEAR:
      return [];
    case ActionTypes.REPOSITORIES_ADD:
      return [...state, action.payload.repository];
    case ActionTypes.REPOSITORIES_REMOVE:
      return state.filter(v => v.repositoryId !== action.payload.repositoryId);
    default:
      return state;
  }
}
