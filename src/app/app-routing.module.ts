import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MusicoEditorComponent } from './musico-editor/musico-editor.component';
import { MusicosComponent } from './musicos/musicos.component';

const routes: Routes = [
  { path: '', component: MusicosComponent },
  { path: 'editar/:id', component: MusicoEditorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
