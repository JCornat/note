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

    this.title = ' '; // Force contentEditable reset
    this.content = ' '; // Force contentEditable reset

    setTimeout(() => {
      this.title = this._data.title;
      this.content = this._data.content;
      this.color = this._data.color;
      this.updateFormData();
    });
  }

  @Output() public onUpdate = new EventEmitter<{ title: string, content: string, color: string }>();
  @Output() public onRemove = new EventEmitter<boolean>();

  public _data: Note;
  public edit: boolean;
  public title: string;
  public content: string;
  public color: string;
  public isEmptyTitle: boolean;
  public isEmptyContent: boolean;
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
    this.isEmptyTitle = (Global.isEmpty(this._data.title));
    this.isEmptyContent = (Global.isEmpty(this._data.content));

    this.formGroup = new FormGroup({
      title: new FormControl(this._data.title),
      content: new FormControl(this._data.content),
      color: new FormControl(this._data.color),
    });

    this.formGroupSubscriber = this.formGroup.valueChanges
      .subscribe(() => {
        this.isEmptyTitle = Global.isEmpty(this.formGroup.get('title').value);
        this.isEmptyContent = Global.isEmpty(this.formGroup.get('content').value);
        console.log(Global.isEmpty(this.formGroup.get('content').value), this.formGroup.get('content').value);

        this.onUpdate.emit(this.formGroup.value);
      });
  }

  public updateFormData(): void {
    if (Global.isEmpty(this.formGroup)) {
      console.log('return !');
      return;
    }

    this.formGroup.patchValue(this._data, {emitEvent: false});
    this.isEmptyTitle = Global.isEmpty(this.formGroup.get('title').value);
    this.isEmptyContent = Global.isEmpty(this.formGroup.get('content').value);
  }

  public onTitleChange(event): void {
    const content = (event.innerText) ? event.innerText : null;
    this.formGroup.get('title').setValue(content);
  }

  public executeFunction(event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  public onContentChange(event): void {
    const content = (event.innerHTML && event.innerHTML !== '<br>') ? event.innerHTML : null;
    this.formGroup.get('content').setValue(content);
  }

  public updateColor(color: string): void {
    this._data.color = color;
    this.formGroup.get('color').setValue(color);
  }

  public remove(): void {
    this.onRemove.emit(true);
  }
}
