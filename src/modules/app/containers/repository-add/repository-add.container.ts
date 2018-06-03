import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { AppSandbox } from '../../app.sandbox';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { NodeGitService } from '../../services/node-git.service';

const {dialog} = window.require('electron').remote;

@Component({
  selector: 'app-ctn-repository-add',
  styleUrls: ['./repository-add.container.scss'],
  template: `
    <form [formGroup]="form" (submit)="onSubmit()">
      <div class="modal-body">
        <h4>Add repository</h4>
        <div *ngIf="error$ | async as error">
          <p class="alert alert-danger">{{error}}</p>
        </div>
        <div class="form-group">
          <label for="path">Repository</label><br>
          <button type="button" (click)="onPathChange()">Select repository</button>
          <small *ngIf="form.value.path" class="form-text text-muted">{{form.value.path}}</small>
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" class="form-control" formControlName="name">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-dark" (click)="ngbActiveModal.close()">Close</button>
        <button type="submit" class="btn btn-primary" [disabled]="!form.valid">Add</button>
      </div>
    </form>
  `
})
export class RepositoryAddContainer implements OnInit {
  form = this.fb.group({
    name: ['', Validators.required],
    path: ['', Validators.required]
  });

  error$ = new Subject();

  constructor(private sb: AppSandbox,
              private fb: FormBuilder,
              public ngbActiveModal: NgbActiveModal,
              private nodeGitService: NodeGitService,
              private changeDetectoRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  onPathChange(): void {
    dialog.showOpenDialog(
      {properties: ['openDirectory']},
      (res) => {
        if (res) {
          const pathToRepo = res[0];
          const repoName = pathToRepo.split('/').pop();

          this.form.patchValue({
            name: repoName,
            path: pathToRepo
          });

          this.nodeGitService.openRepository(pathToRepo)
            .pipe(take(1))
            .subscribe(
              () => {
                this.error$.next(null);
                this.changeDetectoRef.detectChanges();
              },
              () => {
                this.error$.next('The folder you have selected is not a git repository.');
                this.changeDetectoRef.detectChanges();
              }
            );
        }
      });
  }

  onSubmit(): void {
    this.error$.next(null);
    this.nodeGitService.openRepository(this.form.value.path)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.sb.addRepository({
            repositoryId: new Date().getMilliseconds().toString(),
            name: this.form.value.name,
            path: this.form.value.path
          });
          this.ngbActiveModal.close();
        });
  }
}
