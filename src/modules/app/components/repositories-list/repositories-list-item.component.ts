import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { LocalRepository } from '../../types/local-repository.type';

@Component({
  selector: 'app-repositories-list-item',
  styleUrls: ['./repositories-list-item.component.scss'],
  template: `
    <div class="name">{{repository.name}}</div>
    <div class="path">{{repository.path}}</div>
  `
})
export class RepositoriesListItemComponent implements OnInit {
  @Input() repository: LocalRepository;

  constructor() {
  }

  ngOnInit() {
  }
}
