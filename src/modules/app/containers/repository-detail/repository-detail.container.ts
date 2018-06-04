import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import { CzLernaChangelogService } from '../../services/cz-lerna-changelog.service';
import { Observable } from 'rxjs/Observable';
import { LocalRepository } from '../../types/local-repository.type';
import { AppSandbox } from '../../app.sandbox';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  filter,
  map,
  mergeMap,
  switchMap,
  takeUntil
} from 'rxjs/operators';
import { Destroy } from 'ngx-reactivetoolkit';
import { timer } from 'rxjs/observable/timer';
import { Subject } from 'rxjs/Subject';
import { StagedFile } from '../../types/staged-file.type';
import { UnstagedFile } from '../../types/unstaged-file.type';

@Component({
  selector: 'app-ctn-home',
  styleUrls: ['./repository-detail.container.scss'],
  template: `
    <div *ngIf="localRepository$ | async as localRepository">
      <div class="header">
        <div class="title">{{localRepository.name}}</div>
        <div class="actions">
          <button class="btn btn-outline-danger"
                  (click)="onRemove(localRepository.repositoryId)"><i class="fa fa-wd fa-trash-o"></i></button>
        </div>
      </div>
      <div class="main">
        <perfect-scrollbar>
          <div class="details">
            <div class="row">
              <div class="col">
                <div class="key">Git hooks</div>
                <div class="value">{{localRepository.hooks ? 'Yes' : 'No'}}</div>
              </div>
              <div class="col">
                <div class="key">Monorepo project</div>
                <div class="value">{{localRepository.monorepo ? 'Yes' : 'No'}}</div>
              </div>
              <div class="col">
                <div class="key">Commits</div>
                <div class="value">{{numberOfCommits$ | async}}</div>
              </div>
              <div class="col">
                <div class="key">Current brach</div>
                <div class="value">{{currentBranch$ | async}}</div>
              </div>
            </div>

            <!--<div class="row">-->
              <!--<div class="col">-->
                <!--<div class="key">Untracked files</div>-->
                <!--<div class="value" *ngIf="untrackedFiles$ | async as files">{{files.length}}</div>-->
              <!--</div>-->
              <!--<div class="col">-->
                <!--<div class="key">Unstaged files</div>-->
                <!--<div class="value" *ngIf="unstagedFiles$ | async as files">{{files.length}}</div>-->
              <!--</div>-->
              <!--<div class="col">-->
                <!--<div class="key">Stages files</div>-->
                <!--<div class="value" *ngIf="stagedFiles$ | async as files">{{files.length}}</div>-->
              <!--</div>-->
            <!--</div>-->
          </div>

          <div class="padding">
            <h4>Commit</h4>
            <form [formGroup]="form">
              <div class="form-group">
                <label for="type">Type *</label>
                <select id="type" class="form-control form-control-sm" formControlName="type">
                  <option [ngValue]="null">--- Select your type ---</option>
                  <option *ngFor="let type of types" [ngValue]="type.value"><strong>{{type.name}}</strong></option>
                </select>
              </div>
              <div class="form-group">
                <label for="scope">Scope *</label>
                <input type="text" id="scope" class="form-control form-control-sm" formControlName="scope">
              </div>
              <div class="form-group">
                <label for="subject">Subject *</label>
                <input type="text" id="subject" class="form-control form-control-sm" formControlName="subject">
                <small class="form-text text-muted">Your commit message</small>
              </div>
              <div class="form-group">
                <label for="body">Body</label>
                <textarea id="body" class="form-control form-control-sm" formControlName="body"></textarea>
                <small class="form-text text-muted">All new lines will be removed.</small>
              </div>
              <div class="form-group">
                <label for="breakingChanges">Breaking changes</label>
                <textarea id="breakingChanges" class="form-control form-control-sm" formControlName="breakingChanges"></textarea>
                <small class="form-text text-muted">All new lines will be removed.</small>
              </div>
              <div class="form-group">
                <label for="issuesClosed">Issues closed</label>
                <input type="text" id="type" class="form-control form-control-sm" formControlName="issuesClosed">
              </div>
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <span *ngIf="success$ | async as success" class="text-success">{{success}}</span>
                    <span *ngIf="error$ | async" class="text-danger">It was not possible to commit any file. Please make sure a file is staged.</span>
                  </div>
                  <div class="col text-right">
                    <button type="button"
                            class="btn btn-primary"
                            [disabled]="!form.valid"
                            (click)="onSubmitStageAllAndCommit()">Stage all & commit
                    </button>
                    <button type="button"
                            class="btn btn-primary"
                            [disabled]="!form.valid"
                            (click)="onSubmitCommit()">Commit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </perfect-scrollbar>
      </div>
    </div>
  `
})
export class RepositoryDetailContainer implements OnInit, OnDestroy {
  @Destroy() destroy$;

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
  numberOfCommits$: Observable<number>;
  currentBranch$: Observable<string>;
  success$ = new Subject<string>();
  error$ = new Subject<boolean>();
  timerFiles$ = timer(0, 2000);

  constructor(private sb: AppSandbox,
              private fb: FormBuilder,
              private czLernaChangelogService: CzLernaChangelogService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.repositoryId$ = this.calculateRepositoryId$();
    this.localRepository$ = this.calculateLocalRepository$();
    this.numberOfCommits$ = this.calculateNumberOfCommits$();
    this.currentBranch$ = this.calculateCurrentBranch$();
  }

  ngOnDestroy(): void {
  }

  onSubmitCommit(): void {
    this.error$.next(false);
    this.localRepository$.pipe(
      mergeMap(repo => this.sb.commit(repo.path, this.buildCommitMessage(), false))
    ).subscribe(
      () => {
        this.success$.next('You\'re staged files are commited.');
        this.form.reset();
        setTimeout(() => this.success$.next(null), 5000);
      },
      (err) => {
        this.error$.next(true);
      }
    );
  }

  onSubmitStageAllAndCommit(): void {
    this.error$.next(false);
    this.localRepository$.pipe(
      mergeMap(repo => this.sb.stageAll(repo.path).pipe(
        mergeMap(() => this.sb.commit(repo.path, this.buildCommitMessage(), false))
      ))
    ).subscribe(
      () => {
        this.success$.next('You\'re files are staged and commited.');
        this.form.reset();
        setTimeout(() => this.success$.next(null), 5000);
      }
    );
  }

  onRemove(repositoryId): void {
    this.sb.removeRepository(repositoryId);
    this.router.navigate(['/']);
  }

  private buildCommitMessage(): string {
    return this.form.valid
      ? this.czLernaChangelogService.build(
        this.form.value.type,
        this.form.value.scope,
        this.form.value.subject.toLowerCase(),
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
      switchMap(repositoryId =>
        this.sb.repositories$.pipe(
          map(repositories => repositories.find(repo => repo.repositoryId === repositoryId))
        )
      )
    );
  }

  private calculateNumberOfCommits$(): Observable<number> {
    return this.localRepository$.pipe(
      switchMap(repo => timer(0, 10000).pipe(
        switchMap(() => this.sb.numberOfCommits(repo.path)),
        takeUntil(this.destroy$)
      ))
    );
  }

  private calculateCurrentBranch$(): Observable<string> {
    return this.localRepository$.pipe(
      switchMap(repo => timer(0, 3500).pipe(
        switchMap(() => this.sb.currentBranch(repo.path)),
        takeUntil(this.destroy$)
      ))
    );
  }
}
