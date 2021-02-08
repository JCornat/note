import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { Note } from './note';
import { Question } from '../question/question';
import { NoteService } from './note.service';
import * as Global from '../global/global';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  public questions: Question[];
  public displayList: Note[];
  public notes: Note[];
  public searchNotes: Note[];
  public searchTerm: string;
  public limit: number;
  public offset: number;
  public notesTotal: number;
  public searchNotesTotal: number;
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
    const data = await this.noteService.pullAll({limit: this.limit, offset: this.offset, search: this.searchTerm});
    this.processNotes(data);
    this.processDisplayList();
  }

  public processNotes(data: { total: number, data: Note[] }): void {
    for (const note of data.data) {
      note.dateString = moment(note.date).format('ddd DD MMM, HH:mm');
    }

    if (this.searchTerm) {
      this.searchNotesTotal = data.total;
      if (this.offset) {
        this.searchNotes.push(...data.data);
      } else {
        this.searchNotes = data.data;
      }
    } else {
      this.notesTotal = data.total;
      if (this.offset) {
        this.notes.push(...data.data);
      } else {
        this.notes = data.data;
      }
    }
  }

  public buildQuestions(): void {
    this.questions = [
      {key: 'search', type: 'text', placeholder: 'Search', marginBottom: 0},
    ];
  }

  public detail(note: Note): void {
    if (this.note && this.noteUpdated) { // Fire update before change note
      this.save(this.note);
      this.noteUpdated = false;
    }

    if (this.saveSubscriber && !this.saveSubscriber.closed) {
      this.saveSubscriber.unsubscribe();
    }

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

  public async save(note: Note): Promise<void> {
    if (note._id) {
      await this.noteService.update(note);
    } else {
      note._id = await this.noteService.add(note);
    }
  }

  public async update(note: Note): Promise<void> {
    await this.noteService.update(note);
  }

  public async add(note: Note): Promise<void> {
    await this.noteService.add(note);
  }

  public async onRemove(note: Note): Promise<void> {
    await this.noteService.delete(note._id);
    await this.pullAll();
    this.note = null;
  }

  public createNote(): void {
    const currentDate = moment();
    const note = {
      _id: undefined,
      title: '',
      content: '',
      color: 'blue',
      date: currentDate,
      dateString: currentDate.format('ddd DD MMM, HH:mm'),
    };

    this.searchTerm = null;
    this.processDisplayList();
    this.notes.unshift(note);
    this.detail(note);
  }

  public navigateUpdate(id: string): void {
    this.router.navigate(['/update', id]);
  }

  public onValid(data): void {
    this.limit = 20;
    this.offset = 0;
    this.searchTerm = data?.search;
    if (Global.isEmpty(this.searchTerm)) {
      this.processDisplayList();
      return;
    }

    this.pullAll();
  }

  public processDisplayList(): void {
    this.displayList = (this.searchTerm) ? this.searchNotes : this.notes;
  }

  public subscribeSave(): void {
    this.saveSubscriber = this.saveSubject
      .pipe(debounceTime(2000))
      .subscribe((note) => {
        this.save(note);
        this.noteUpdated = false;
      });
  }

  public nextPage(): void {
    this.offset = this.displayList?.length;
    this.pullAll();
  }

  public onVisible(): void {
    this.checkNextPage();
  }

  public checkNextPage(): void {
    if (this.searchTerm && this.displayList?.length < this.searchNotesTotal) {
      this.nextPage();
    } else if (!this.searchTerm && this.displayList?.length < this.notesTotal) {
      this.nextPage();
    }
  }
}
