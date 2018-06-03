import {
  RouterModule,
  Routes
} from '@angular/router';
import { RepositoryDetailContainer } from './containers/repository-detail/repository-detail.container';
import { RepositoryNotSelectedContainer } from './containers/repository-not-selected/repository-not-selected.container';

const routes: Routes = [
  {
    path: '',
    component: RepositoryNotSelectedContainer
  },
  {
    path: ':repositoryId',
    component: RepositoryDetailContainer
  }
];

export const appRoutes = RouterModule.forRoot(routes);
