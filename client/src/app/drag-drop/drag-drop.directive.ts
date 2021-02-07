import { Directive, EventEmitter, Output, HostListener } from '@angular/core';

import * as Global from '../global/global';

@Directive({
  selector: '[c7zDragDrop]'
})
export class C7zDragDropDirective {
  @Output() onFileDropped = new EventEmitter<File>();
  @Output() onDraggedOver = new EventEmitter<boolean>();

  @HostListener('dragover', ['$event']) onDragOver(event): void {
    event.preventDefault();
    event.stopPropagation();

    this.onDraggedOver.emit(true);
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event): void {
    event.preventDefault();
    event.stopPropagation();

    this.onDraggedOver.emit(false);
  }

  @HostListener('drop', ['$event']) public onDrop(event): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (Global.isEmpty(files)) {
      return;
    }

    this.onFileDropped.emit(files[0]);
  }

  constructor() {
    //
  }
}
