import { Component, OnInit } from '@angular/core';
import { IInstrumento } from 'src/models/instrumento';
import { IMusico } from 'src/models/musico';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-musicos',
  templateUrl: './musicos.component.html',
  styleUrls: ['./musicos.component.scss']
})
export class MusicosComponent implements OnInit {

  musicos: IMusico[] = Array<IMusico>();
  instrumentos: IInstrumento[] = Array<IInstrumento>();

  constructor(private rest: RestService) {
    rest.getInstrumentos().subscribe(data => {
      this.instrumentos = data;
    })

    rest.getMusicos().subscribe(data => {
      this.musicos = data;
    })
  }

  ngOnInit(): void {
  }

  // Podria ser mas facil pero asi se hacen menos llamadas al servidor
  changeReparacion(id: number) {
    const instrumento = this.instrumentos.filter(i => i.id == id)[0];
    instrumento.reparacion = !instrumento.reparacion;
    this.asignar();
  }

  asignar() {
    this.musicos.forEach(m => m.instrumentoId = null);
    this.instrumentos.forEach(i => i.libre = true);

    this.musicos.forEach(m => {
      let instrumento = this.instrumentos.filter(i => i.libre && !i.reparacion && i.tipo == m.tipo)[0];
      if (instrumento) {
        m.instrumentoId = instrumento.id;
        instrumento.libre = false;
      }
      this.rest.updateMusico(m);
    })

    this.instrumentos.forEach(i => this.rest.updateInstrumento(i));
  }

  getInstrumentoNombre(musico: IMusico) {
    return musico.instrumentoId == null
      ? "Sin instrumento"
      : this.instrumentos.filter(i => i.id == musico.instrumentoId)[0].nombre;
  }

  getFactura() : Array<MusicoInstrumento> {
    let factura: MusicoInstrumento[] = Array<MusicoInstrumento>();

    this.musicos
    .filter(m => m.instrumentoId != null)
    .forEach(m => {
      let ins = this.instrumentos.filter(i => i.id == m.instrumentoId)[0];
      factura.push({
        musico: m,
        instrumento: ins
      })
    })

    return factura;
  }

  getTotal() {
    let mi = this.getFactura();
    let total = mi.reduce(function(acc, obj) { return acc + obj.instrumento.precio + obj.musico.sueldo}, 0);
    return total;
  }
}

interface MusicoInstrumento {
  musico:IMusico;
  instrumento:IInstrumento;
}
