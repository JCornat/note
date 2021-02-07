import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Note } from '../note';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'note-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class NotePreviewComponent implements OnInit {
  @Input() set data(data: Note) {
    this._data = {
      ...data,
    };
  }

  @Output() public onUpdate = new EventEmitter<Note>();
  @Output() public onRemove = new EventEmitter<boolean>();

  public _data: Note;
  public edit: boolean;
  public formGroup: FormGroup;
  public colors: string[];

  constructor() {
    //
  }

  public ngOnInit(): void {
    this.formGroup = new FormGroup({
      title: new FormControl(this._data.title),
      content: new FormControl(this._data.content),
      color: new FormControl(this._data.color),
    });

    this.colors = [
      'blue',
      'orange',
      'red',
      'green',
      'black',
      'white',
    ];

    this.formGroup.valueChanges
      .subscribe(() => {
        console.log('this.formGroup.value', this.formGroup.value);
        this.onUpdate.emit(this.formGroup.value);
      });
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
