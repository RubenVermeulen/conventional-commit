import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home/home.component';
import { appRoutes } from './app.routes';
import { AppContainer } from './containers/app/app.container';
import { ElectronService } from './services/electron.service';
import { RepositoryDetailContainer } from './containers/repository-detail/repository-detail.container';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CzLernaChangelogService } from './services/cz-lerna-changelog.service';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { rootReducer } from '../statemanagement/root.reducer';
import { AppSandbox } from './app.sandbox';
import { RepositoriesContainer } from './containers/repositories/repositories.container';
import { RepositoryAddContainer } from './containers/repository-add/repository-add.container';
import { metaReducers } from '../statemanagement/meta.reducers';
import { RepositoriesListComponent } from './components/repositories-list/repositories-list.component';
import { RepositoriesListItemComponent } from './components/repositories-list/repositories-list-item.component';
import { RepositoryNotSelectedContainer } from './containers/repository-not-selected/repository-not-selected.container';
import { NodeGitService } from './services/node-git.service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


@NgModule({
  declarations: [
    AppContainer,
    RepositoryDetailContainer,
    RepositoriesContainer,
    RepositoryAddContainer,
    RepositoryNotSelectedContainer,
    HomeComponent,
    RepositoriesListComponent,
    RepositoriesListItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutes,
    NgbModule.forRoot(),
    StoreModule.forRoot(rootReducer, { metaReducers }),
    StoreDevtoolsModule.instrument(),
    PerfectScrollbarModule
  ],
  providers: [ElectronService, CzLernaChangelogService, AppSandbox, NodeGitService],
  entryComponents: [RepositoryAddContainer],
  bootstrap: [AppContainer]
})
export class AppModule {
}
