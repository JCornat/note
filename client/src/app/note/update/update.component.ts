import { Component, OnInit } from '@angular/core';
import { NoteAddComponent } from '../add/add.component';
import { NoteService } from '../note.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'note-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class NoteUpdateComponent extends NoteAddComponent implements OnInit {
  public id: string;

  constructor(
    public noteService: NoteService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    super(noteService, router);
  }

  public async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');
    this.values = await this.noteService.pullOne(this.id);

    this.init();
  }

  public async remove(): Promise<void> {
    await this.noteService.delete(this.id);
    this.router.navigate(['/']);
  }

  public async update(data): Promise<void> {
    await this.noteService.update(data);
  }

  public async onSubmit(): Promise<void> {
    await this.update(this.formData);
    this.router.navigate(['/']);
  }
}
