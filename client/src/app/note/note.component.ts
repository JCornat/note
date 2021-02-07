import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { Note } from './note';
import { Question } from '../question/question';
import { NoteService } from './note.service';
import * as Global from '../global/global';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  public questions: Question[];
  public formData: { [key: string]: any };
  public displayList: Note[];
  public notes: Note[];
  public searchNotes: Note[];
  public limit: number;
  public offset: number;
  public note: Note;

  public noteUpdated: boolean;
  private saveSubject = new Subject<Note>();
  public saveSubscriber: Subscription;

  constructor(
    public noteService: NoteService,
    public router: Router,
  ) {
    //
  }

  public ngOnInit(): void {
    this.limit = 20;
    this.offset = 0;
    this.pullAll();
    this.buildQuestions();
  }

  public async pullAll(): Promise<void> {
    const notes = await this.noteService.pullAll({limit: this.limit, offset: this.offset, search: this.formData?.search});
    this.processNotes(notes.data);
    this.processDisplayList();
  }

  public processNotes(notes: Note[]): void {
    for (const note of notes) {
      note.date = moment();
      note.dateString = note.date.format('ddd DD MMM, HH:mm');
      note.color = note.color || 'blue';
    }

    if (this.formData?.search) {
      this.searchNotes = notes;
    } else {
      this.notes = notes;
    }
  }

  public buildQuestions(): void {
    this.questions = [
      {key: 'search', type: 'text', placeholder: 'Search', marginBottom: 0},
    ];
  }

  public detail(note: Note): void {
    if (this.note && this.noteUpdated) { // Fire update before change note
      this.update(this.note);
    }

    if (this.saveSubscriber && !this.saveSubscriber.closed) {
      this.saveSubscriber.unsubscribe();
    }

    this.noteUpdated = false;
    this.subscribeSave();
    this.note = note;
  }

  public async onUpdate(data: { title: string, content: string, color: string }, note: Note): Promise<void> {
    note.title = data.title;
    note.content = data.content;
    note.color = data.color;

    this.noteUpdated = true;
    this.saveSubject.next(note);
  }

  public async update(note: Note): Promise<void> {
    await this.noteService.update(note);
  }

  public async onRemove(note: Note): Promise<void> {
    await this.noteService.delete(note._id);
    await this.pullAll();
    this.note = null;
  }

  public navigateAdd(): void {
    this.router.navigate(['/add']);
  }

  public navigateUpdate(id: string): void {
    this.router.navigate(['/update', id]);
  }

  public onValid(data): void {
    this.formData = data;
    if (Global.isEmpty(this.formData?.search)) {
      this.processDisplayList();
      return;
    }

    this.pullAll();
  }

  public processDisplayList(): void {
    this.displayList = (this.formData?.search) ? this.searchNotes : this.notes;
  }

  public subscribeSave(): void {
    this.saveSubscriber = this.saveSubject
      .pipe(debounceTime(2000))
      .subscribe((note) => {
        this.update(note);
      });
  }
}
