import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Note } from '../note';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as Global from '../../global/global';
import { Subscription } from 'rxjs';
import { SERVER_URL } from '../../config/config';
import { RequestService } from '../../request/request.service';

@Component({
  selector: 'note-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class NotePreviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() set data(data: Note) {
    this._data = {
      ...data,
    };

    if (this.titleElement?.nativeElement) {
      this.titleElement.nativeElement.innerText = this._data.title;
    }

    if (this.contentElement?.nativeElement) {
      this.contentElement.nativeElement.innerHTML = this._data.content;
    }

    setTimeout(() => {
      this.updateFormData();
    });
  }

  @Output() public onUpdate = new EventEmitter<{ title: string, content: string, color: string }>();
  @Output() public onRemove = new EventEmitter<boolean>();

  @ViewChild('titleElement') titleElement: ElementRef<HTMLElement>;
  @ViewChild('contentElement') contentElement: ElementRef<HTMLElement>;

  public _data: Note;
  public isSending: boolean;
  public uploadError: boolean;
  public edit: boolean;
  public isDragover: boolean;
  public isEmptyTitle: boolean;
  public isEmptyContent: boolean;
  public formGroup: FormGroup;
  public colors: string[];
  public formGroupSubscriber: Subscription;

  constructor(
    public requestService: RequestService,
  ) {
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

  public ngAfterViewInit(): void {
    this.titleElement.nativeElement.innerText = this._data.title;
    this.contentElement.nativeElement.innerHTML = this._data.content;
  }

  public ngOnDestroy(): void {
    this.formGroupSubscriber.unsubscribe();
  }

  public buildFormGroup(): void {
    this.isEmptyTitle = (Global.isEmpty(this._data.title));
    this.isEmptyContent = (Global.isEmpty(this._data.content));

    const imageControl = [];
    if (Global.isPopulated(this._data.images)) {
      for (const image of this._data.images) {
        imageControl.push(new FormControl(image));
      }
    }

    this.formGroup = new FormGroup({
      title: new FormControl(this._data.title),
      content: new FormControl(this._data.content),
      color: new FormControl(this._data.color),
      images: new FormArray(imageControl),
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

  public preventDefault(event): void {
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

  public async onFileDropped(file: File): Promise<void> {
    this.isDragover = false;
    const url = await this.uploadFile(file);
    if (Global.isEmpty(this._data.images)) {
      this._data.images = [];
    }

    this._data.images.push(url);
    (this.formGroup.controls.images as FormArray).push(new FormControl(url));
  }

  public dragOver(event: boolean): void {
    this.isDragover = event;
  }

  public async uploadFile(file: File): Promise<string> {
    this.isSending = true;
    this.uploadError = false;

    let url: string;

    try {
      const data = await this.requestService.post({url: SERVER_URL + '/api/file', body: {file}, header: {responseType: 'text'}}).toPromise();
      url = data.body;
    } catch (error) {
      this.uploadError = true;
      throw new Error(error);
    } finally {
      this.isSending = false;
    }

    return url;
  }

  public removeImage(index: number): void {
    const res = [];
    for (let i = 0; i < this._data.images.length; i++) {
      if (i === index) {
        continue;
      }

      res.push(this._data.images[i]);
    }

    this._data.images = res;
    (this.formGroup.controls.images as FormArray).removeAt(index);
  }
}
