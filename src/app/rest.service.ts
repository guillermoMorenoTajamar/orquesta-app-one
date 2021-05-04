import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInstrumento } from 'src/models/instrumento';
import { IMusico } from 'src/models/musico';

const URL_PROD = "https://orquesta-server.azurewebsites.net";
const URL_TEST = "https://localhost:5001"
const URL = URL_PROD;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  getMusicos(): Observable<IMusico[]> {
    return this.http.get<IMusico[]>(URL + "/api/Musico", httpOptions);
  }

  getMusico(id: number): Observable<IMusico> {
    return this.http.get<IMusico>(URL + "/api/Musico/" + id, httpOptions);
  }

  updateMusico(musico: IMusico) {
    console.log("REST Call");
    this.http.put<IMusico>(URL + "/api/Musico/" + musico.id, musico, httpOptions).subscribe({
      next: data => { },
      error: error => { console.error('There was an error!', error); }
    });
  }

  deleteMusico(musico: IMusico) {
    console.log("REST Call");
    this.http.delete<IMusico>(URL + "/api/Musico/" + musico.id).subscribe({
      next: data => { },
      error: error => { console.error('There was an error!', error); }
    });
  }

  createMusico(musico: IMusico) {
    console.log("REST Call");
    this.http.post<IMusico>(URL + "/api/Musico", musico, httpOptions).subscribe({
      next: data => { },
      error: error => { console.error('There was an error!', error); }
    });
  }

  getInstrumentos(): Observable<IInstrumento[]> {
    return this.http.get<IInstrumento[]>(URL + "/api/Instrumento", httpOptions);
  }

  getInstrumento(id: number): Observable<IInstrumento> {
    return this.http.get<IInstrumento>(URL + "/api/Instrumento/" + id, httpOptions);
  }

  updateInstrumento(instrumento: IInstrumento) {
    console.log("REST Call");
    this.http.put<IInstrumento>(URL + "/api/Instrumento/" + instrumento.id, instrumento, httpOptions).subscribe({
      next: data => { },
      error: error => { console.error('There was an error!', error); }
    });
  }
}
