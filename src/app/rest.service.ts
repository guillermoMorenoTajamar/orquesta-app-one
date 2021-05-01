import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInstrumento } from 'src/models/instrumento';
import { IMusico } from 'src/models/musico';

const URL = "https://orquesta-server.azurewebsites.net";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  getMusicos(): Observable<IMusico[]> {
    return this.http.get<IMusico[]>(URL+"/api/Musico");
  }

  getMusico(id: number): Observable<IMusico> {
    return this.http.get<IMusico>(URL+"/api/Musico/" + id);
  }

  updateMusico(musico: IMusico) {
    console.log("REST Call");
    this.http.put<IMusico>(URL+"/api/Musico/" + musico.id, musico).subscribe({
      next: data => { },
      error: error => { console.error('There was an error!', error); }
    });
  }

  getInstrumentos(): Observable<IInstrumento[]> {
    return this.http.get<IInstrumento[]>(URL+"/api/Instrumento");
  }

  getInstrumento(id: number): Observable<IInstrumento> {
    return this.http.get<IInstrumento>(URL+"/api/Instrumento/" + id);
  }

  updateInstrumento(instrumento: IInstrumento) {
    console.log("REST Call");
    this.http.put<IInstrumento>(URL+"/api/Instrumento/" + instrumento.id, instrumento).subscribe({
      next: data => { },
      error: error => { console.error('There was an error!', error); }
    });
  }
}
