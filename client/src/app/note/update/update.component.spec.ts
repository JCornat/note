import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteUpdateComponent } from './update.component';

describe('UpdateComponent', () => {
  let component: NoteUpdateComponent;
  let fixture: ComponentFixture<NoteUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
