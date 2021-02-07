import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NoteComponent } from './note/note.component';
import { NoteAddComponent } from './note/add/add.component';
import { NoteUpdateComponent } from './note/update/update.component';

const routes: Routes = [
  {
    path: '',
    component: NoteComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'add',
    component: NoteAddComponent,
  },
  {
    path: 'update/:id',
    component: NoteUpdateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
