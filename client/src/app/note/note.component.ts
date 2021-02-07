import { Component, OnInit } from '@angular/core';
import { Note } from './note';
import { Question } from '../question/question';
import { NoteService } from './note.service';
import * as Global from '../global/global';
import { Router } from '@angular/router';

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
    this.navigateUpdate(note._id);
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
}
