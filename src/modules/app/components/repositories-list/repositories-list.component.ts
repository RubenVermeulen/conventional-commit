import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { LocalRepository } from '../../types/local-repository.type';

@Component({
  selector: 'app-repositories-list',
  styleUrls: ['./repositories-list.component.scss'],
  template: `
    <app-repositories-list-item *ngFor="let repo of repositories"
                                [repository]="repo"
                                routerLink="/{{repo.repositoryId}}" routerLinkActive="active"></app-repositories-list-item>
  `
})
export class RepositoriesListComponent implements OnInit {
  @Input() repositories: LocalRepository[];

  constructor() {
  }

  ngOnInit() {
  }
}
