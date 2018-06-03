import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-ctn-root',
  styleUrls: ['./app.container.scss'],
  template: `
    <div class="repos">
      <app-ctn-repositories></app-ctn-repositories>
    </div>
    <div class="repo-details">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppContainer implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}
