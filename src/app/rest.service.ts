import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInstrumento } from 'src/models/instrumento';
import { IMusico } from 'src/models/musico';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  getMusicos(): Observable<IMusico[]> {
    return this.http.get<IMusico[]>("http://localhost:5000/api/Musico");
  }

  getMusico(id: number): Observable<IMusico> {
    return this.http.get<IMusico>("http://localhost:5000/api/Musico/" + id);
  }

  updateMusico(musico: IMusico) {
    console.log("REST Call");
    this.http.put<IMusico>("http://localhost:5000/api/Musico/" + musico.id, musico).subscribe({
      next: data => { },
      error: error => { console.error('There was an error!', error); }
    });
  }

  getInstrumentos(): Observable<IInstrumento[]> {
    return this.http.get<IInstrumento[]>("http://localhost:5000/api/Instrumento");
  }

  getInstrumento(id: number): Observable<IInstrumento> {
    return this.http.get<IInstrumento>("http://localhost:5000/api/Instrumento/" + id);
  }

  updateInstrumento(instrumento: IInstrumento) {
    console.log("REST Call");
    this.http.put<IInstrumento>("http://localhost:5000/api/Instrumento/" + instrumento.id, instrumento).subscribe({
      next: data => { },
      error: error => { console.error('There was an error!', error); }
    });
  }
}
