import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../note';

@Component({
  selector: 'note-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class NoteItemComponent implements OnInit {
  @Input() public data: Note;

  constructor() {
    //
  }

  public ngOnInit(): void {
    //
  }
}
