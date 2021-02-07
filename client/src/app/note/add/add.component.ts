import { Component, OnInit } from '@angular/core';
import { NoteService } from '../note.service';
import { Router } from '@angular/router';
import { Question } from '../../question/question';

@Component({
  selector: 'note-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class NoteAddComponent implements OnInit {
  public questions: Question[];

  public values: { [key: string]: any };
  public formData: { [key: string]: any };

  constructor(
    public noteService: NoteService,
    public router: Router,
  ) {
    //
  }

  public ngOnInit(): void {
    this.init();
  }

  public init(): void {
    this.questions = [
      {key: '_id', type: 'text', label: 'id', hide: true},
      {key: 'title', type: 'text', label: 'Titre'},
      {key: 'content', type: 'textarea', label: 'Contenu'},
    ];
  }

  public onValid(data): void {
    this.formData = data;
  }

  public async onSubmit(): Promise<void> {
    await this.noteService.add(this.formData);
    this.router.navigate(['/']);
  }
}
