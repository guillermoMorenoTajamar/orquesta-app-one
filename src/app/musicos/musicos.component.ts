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

  changeReparacion(id: number) {
    const instrumento = this.instrumentos.filter(i => i.id == id)[0];
    instrumento.reparacion = !instrumento.reparacion;
    instrumento.libre = !instrumento.reparacion;
    this.rest.updateInstrumento(instrumento);


    // Enviar instrumento a reparar.
    if (instrumento.reparacion) {
      this.desasignarInstrumento(instrumento);
    }
    // Recibir instrumento de reparar.
    else {
      // Algun musico sin instrumento?
      const musico = this.musicos.filter(m => m.instrumentoId == null && m.tipo == instrumento.tipo)[0];
      if (musico) {
        this.asignarInstrumento(musico);
      }
    }

  }

  desasignarInstrumento(instrumento: IInstrumento) {
    const musico = this.musicos.filter(m => m.instrumentoId == instrumento.id)[0];
    if (musico) {
      musico.instrumentoId = null;
      this.asignarInstrumento(musico);
    }
  }

  asignarInstrumento(musico: IMusico) {
    const instrumento = this.instrumentos.filter(i => i.libre && !i.reparacion && i.tipo == musico.tipo)[0];
    if (instrumento) {
      instrumento.libre = false;
      musico.instrumentoId = instrumento.id;
      this.rest.updateInstrumento(instrumento);
    }
    this.rest.updateMusico(musico);
  }

  getInstrumentoNombre(musico: IMusico) {
    return musico.instrumentoId == null
      ? "Sin instrumento"
      : this.instrumentos.filter(i => i.id == musico.instrumentoId)[0].nombre;
  }

  geInstrumentoImage(tipo_instrumento: string) {
    let path = `/assets/img/${tipo_instrumento}.png`.toLowerCase();
    return path;
  }

  getFactura(): Array<MusicoInstrumento> {
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
    let total = mi.reduce(function (acc, obj) { return acc + obj.instrumento.precio + obj.musico.sueldo }, 0);
    return total;
  }
}

interface MusicoInstrumento {
  musico: IMusico;
  instrumento: IInstrumento;
}
