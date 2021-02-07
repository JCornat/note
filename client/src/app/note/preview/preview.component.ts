import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Note } from '../note';
import { FormControl, FormGroup } from '@angular/forms';
import * as Global from '../../global/global';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'note-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class NotePreviewComponent implements OnInit, OnDestroy {
  @Input() set data(data: Note) {
    this._data = {
      ...data,
    };

    this.updateFormData();
  }

  @Output() public onUpdate = new EventEmitter<{ title: string, content: string, color: string }>();
  @Output() public onRemove = new EventEmitter<boolean>();

  public _data: Note;
  public edit: boolean;
  public formGroup: FormGroup;
  public colors: string[];
  public formGroupSubscriber: Subscription;

  constructor() {
    //
  }

  public ngOnInit(): void {
    this.colors = [
      'blue',
      'orange',
      'red',
      'green',
      'black',
      'white',
    ];

    this.buildFormGroup();
  }

  public ngOnDestroy(): void {
    this.formGroupSubscriber.unsubscribe();
  }

  public buildFormGroup(): void {
    this.formGroup = new FormGroup({
      title: new FormControl(this._data.title),
      content: new FormControl(this._data.content),
      color: new FormControl(this._data.color),
    });

    this.formGroupSubscriber = this.formGroup.valueChanges
      .subscribe(() => {
        this.onUpdate.emit(this.formGroup.value);
      });
  }

  public updateFormData(): void {
    if (Global.isEmpty(this.formGroup)) {
      return;
    }

    this.formGroup.patchValue(this._data, {emitEvent: false});
  }

  public onTitleChange(event): void {
    console.log('event', event.innerText);
    this.formGroup.get('title').setValue(event.innerText);
  }

  public onContentChange(event): void {
    console.log(event.innerHTML);
    this.formGroup.get('content').setValue(event.innerHTML);
  }

  public updateColor(color: string): void {
    this._data.color = color;
    this.formGroup.get('color').setValue(color);
  }

  public remove(): void {
    this.onRemove.emit(true);
  }
}
