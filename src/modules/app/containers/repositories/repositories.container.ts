import {
  Component,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LocalRepository } from '../../types/local-repository.type';
import { AppSandbox } from '../../app.sandbox';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RepositoryAddContainer } from '../repository-add/repository-add.container';
import { BehaviorSubject } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'app-ctn-repositories',
  styleUrls: ['./repositories.container.scss'],
  template: `
    <div>
      <div class="header">
        <input type="text" placeholder="Search repositories" (keyup)="this.searchTerm$.next($event.target.value)">
      </div>

      <div class="main">
        <div *ngIf="filteredRepositories$ | async as repositories">
          <div *ngIf="repositories.length > 0; else noRepositories">
            <app-repositories-list [repositories]="repositories"></app-repositories-list>
          </div>
          <ng-template #noRepositories>
            <p class="info">Add a repository to begin.</p>
          </ng-template>
        </div>
      </div>

      <div class="footer">
        <button class="btn btn-primary" (click)="onAdd()"><i class="fa fa-wd fa-plus"></i> Add repository</button>
      </div>
    </div>
  `
})
export class RepositoriesContainer implements OnInit {
  repositories$: Observable<LocalRepository[]>;
  searchTerm$ = new BehaviorSubject('');
  filteredRepositories$: Observable<LocalRepository[]>;

  constructor(private sb: AppSandbox,
              private ngbModal: NgbModal) {
  }

  ngOnInit() {
    this.repositories$ = this.sb.repositories$;
    this.filteredRepositories$ = combineLatest(
      this.searchTerm$,
      this.repositories$,
      (searchTerm, repos) => repos.filter(repo =>
        (repo.name + repo.path).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  onAdd(): void {
    this.ngbModal.open(RepositoryAddContainer, {centered: true});
  }
}
