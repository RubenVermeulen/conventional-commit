import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ctn-repository-not-selected',
  styleUrls: ['./repository-not-selected.container.scss'],
  template: `
    <div>Start by selecting a repository.</div>
  `
})
export class RepositoryNotSelectedContainer implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
