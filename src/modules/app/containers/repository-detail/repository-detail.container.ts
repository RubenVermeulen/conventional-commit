import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import { CzLernaChangelogService } from '../../services/cz-lerna-changelog.service';
import { commit } from '../../operations/commit.operation';
import { Observable } from 'rxjs/Observable';
import { LocalRepository } from '../../types/local-repository.type';
import { AppSandbox } from '../../app.sandbox';
import { ActivatedRoute } from '@angular/router';
import {
  filter,
  map,
  mergeMap,
  take
} from 'rxjs/operators';
import { Repository } from 'nodegit';
import { NodeGitService } from '../../services/node-git.service';

@Component({
  selector: 'app-ctn-home',
  styleUrls: ['./repository-detail.container.scss'],
  template: `

    <div *ngIf="localRepository$ | async as localRepository">
      <div class="header">
        <div class="title">{{localRepository.name}}</div>
        <div class="actions">
          <i class="fa fa-wd fa-pencil"></i>
          <i class="fa fa-wd fa-trash-o"></i>
        </div>
      </div>
      <div class="main">
          <perfect-scrollbar>
            <div class="padding">
              <form [formGroup]="form" (submit)="onSubmit()">
                <div class="form-group">
                  <label for="type">Type</label>
                  <select id="type" class="form-control" formControlName="type">
                    <option [ngValue]="null">--- Select your type ---</option>
                    <option *ngFor="let type of types" [ngValue]="type.value"><strong>{{type.name}}</strong></option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="scope">Scope</label>
                  <input type="text" id="scope" class="form-control" formControlName="scope">
                </div>
                <div class="form-group">
                  <label for="subject">Subject</label>
                  <input type="text" id="subject" class="form-control" formControlName="subject">
                  <small class="form-text text-muted">Your commit message</small>
                </div>
                <div class="form-group">
                  <label for="body">Body</label>
                  <textarea id="body" class="form-control" formControlName="body"></textarea>
                  <small class="form-text text-muted">All new lines will be removed.</small>
                </div>
                <div class="form-group">
                  <label for="breakingChanges">Breaking changes</label>
                  <textarea id="breakingChanges" class="form-control" formControlName="breakingChanges"></textarea>
                  <small class="form-text text-muted">All new lines will be removed.</small>
                </div>
                <div class="form-group">
                  <label for="issuesClosed">Issues closed</label>
                  <input type="text" id="type" class="form-control" formControlName="issuesClosed">
                </div>
                <div class="form-group">
                  <button type="submit" class="btn btn-primary" [disabled]="!form.valid">Commit</button>
                </div>
              </form>
            </div>
          </perfect-scrollbar>
      </div>
    </div>
  `
})
export class RepositoryDetailContainer implements OnInit {
  form = this.fb.group({
    type: [null, Validators.required],
    scope: ['', Validators.required],
    subject: ['', Validators.required],
    body: [''],
    breakingChanges: [''],
    issuesClosed: ['']
  });

  types: { value: string; name: string; }[] = [
    {
      value: 'feat',
      name: 'FEAT: A new feature (note: this will indicate a release)'
    },
    {
      value: 'fix',
      name: 'FIX: A bug fix (note: this will indicate a release)'
    },
    {
      value: 'docs',
      name: 'DOCS: Documentation only changes'
    },
    {
      value: 'style',
      name: 'STYLE: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)'
    },
    {
      value: 'refactor',
      name: 'REFACTOR: A code change that neither fixes a bug nor adds a feature'
    },
    {
      value: 'perf',
      name: 'PERF: A code change that improves performance'
    },
    {
      value: 'test',
      name: 'TEST: Adding missing tests'
    },
    {
      value: 'chore',
      name: 'CHORE: Changes to the build process or auxiliary tools and libraries such as documentation generation'
    },
    {
      value: 'REVERT',
      name: 'revert:   Revert to a commit'
    },
    {
      value: 'WIP',
      name: 'WIP:      Work in progress'
    }
  ];


  repositoryId$: Observable<string>;
  localRepository$: Observable<LocalRepository>;
  repository$: Observable<Repository>;

  constructor(private sb: AppSandbox,
              private fb: FormBuilder,
              private czLernaChangelogService: CzLernaChangelogService,
              private nodeGitService: NodeGitService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.repositoryId$ = this.calculateRepositoryId$();
    this.localRepository$ = this.calculateLocalRepository$();
    this.repository$ = this.calculateRepository$();
  }

  onSubmit(): void {
    this.repository$.pipe(
      mergeMap(repo => commit(repo, this.buildCommitMessage())),
      take(1)
    ).subscribe();
  }

  buildCommitMessage(): string {
    return this.form.valid
      ? this.czLernaChangelogService.build(
        this.form.value.type,
        this.form.value.scope,
        this.form.value.subject,
        this.handleTextareaValue(this.form.value.body),
        this.handleTextareaValue(this.form.value.breakingChanges),
        this.form.value.issuesClosed
      )
      : '';
  }

  private handleTextareaValue(value: string) {
    return value.replace(new RegExp('\r?\n', 'g'), ' ');
  }

  private calculateRepositoryId$(): Observable<string> {
    return this.activatedRoute.params.pipe(
      map(v => v.repositoryId),
      filter(v => !!v)
    );
  }

  private calculateLocalRepository$(): Observable<LocalRepository> {
    return this.repositoryId$.pipe(
      mergeMap(repositoryId =>
        this.sb.repositories$.pipe(
          map(repositories => repositories.find(repo => repo.repositoryId === repositoryId))
        )
      )
    );
  }

  private calculateRepository$(): Observable<Repository> {
    return this.localRepository$.pipe(
      mergeMap(repo => this.nodeGitService.openRepository(repo.path))
    );
  }
}
