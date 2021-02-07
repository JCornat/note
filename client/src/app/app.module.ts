import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicFormGroupComponent } from './dynamic-form/group/group.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormSectionComponent } from './dynamic-form/section/section.component';
import { DynamicFormQuestionComponent } from './dynamic-form/question/question.component';
import { FieldCheckboxComponent } from './field/checkbox/checkbox.component';
import { FieldDateComponent } from './field/date/date.component';
import { FieldFileComponent } from './field/file/file.component';
import { FieldMultipleFieldComponent } from './field/multiple-field/multiple-field.component';
import { FieldNumberComponent } from './field/number/number.component';
import { FieldPasswordComponent } from './field/password/password.component';
import { FieldRadioComponent } from './field/radio/radio.component';
import { FieldRangeComponent } from './field/range/range.component';
import { FieldSelectComponent } from './field/select/select.component';
import { FieldTextareaComponent } from './field/textarea/textarea.component';
import { FieldTextComponent } from './field/text/text.component';
import { FieldTimeComponent } from './field/time/time.component';
import { FieldVideoYoutubeComponent } from './field/video-youtube/video-youtube.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { C7zFocusDirective } from './focus/focus.directive';
import { HttpClientModule } from '@angular/common/http';
import { C7zButtonComponent } from './button/button.component';
import { LoginComponent } from './login/login.component';
import { NoteComponent } from './note/note.component';
import { NoteAddComponent } from './note/add/add.component';
import { NoteUpdateComponent } from './note/update/update.component';
import { NoteItemComponent } from './note/item/item.component';
import { NotePreviewComponent } from './note/preview/preview.component';

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormGroupComponent,
    DynamicFormComponent,
    DynamicFormSectionComponent,
    DynamicFormQuestionComponent,
    FieldCheckboxComponent,
    FieldDateComponent,
    FieldFileComponent,
    FieldMultipleFieldComponent,
    FieldNumberComponent,
    FieldPasswordComponent,
    FieldRadioComponent,
    FieldRangeComponent,
    FieldSelectComponent,
    FieldTextareaComponent,
    FieldTextComponent,
    FieldTimeComponent,
    C7zFocusDirective,
    FieldVideoYoutubeComponent,
    C7zButtonComponent,
    LoginComponent,
    NoteComponent,
    NoteAddComponent,
    NoteUpdateComponent,
    NoteItemComponent,
    NotePreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
