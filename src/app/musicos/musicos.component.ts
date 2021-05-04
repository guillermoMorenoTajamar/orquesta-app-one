import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  displayedColumnsMusico: string[] = ['id', 'nombre', 'sueldo', 'tipo', 'instrumentoId', 'editar', 'borrar'];
  displayedColumnsInstrumento: string[] = ['id', 'marca', 'nombre', 'precio', 'tipo', 'reparacion', 'libre'];
  displayedColumnsFactura: string[] = ['nombre', 'instrumento', 'precio'];

  constructor(private rest: RestService, private route: ActivatedRoute,) {
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

  getInstrumentoAsignado(instrumento_id: number) {
    return this.instrumentos.find(i => i.id == instrumento_id)?.nombre ?? "Sin instrumento"
  }

  getInstrumentoNombre(musico: IMusico) {
    return musico.instrumentoId == null
      ? `/assets/img/sin_ins.png`
      : `/assets/img/con_ins.png`;
  }

  geInstrumentoImage(tipo_instrumento: string) {
    let path = `/assets/img/${tipo_instrumento}.png`.toLowerCase();
    return path;
  }

  getFactura(): Array<FacturaRow> {
    let factura: FacturaRow[] = Array<FacturaRow>();

    this.musicos
      .filter(m => m.instrumentoId != null)
      .forEach(m => {
        let ins = this.instrumentos.filter(i => i.id == m.instrumentoId)[0];
        if (ins) {
          factura.push({
            nombre: m.nombre,
            instrumento: ins.tipo + " " + ins.marca,
            precio: m.sueldo + ins.precio
          })
        }
      })

    let total = factura.reduce(function (acc, obj) { return acc + obj.precio }, 0);

    factura.push({
      nombre: "",
      instrumento: "Total",
      precio: total
    });

    return factura;
  }

  getTotal() {
    let mi = this.getFactura();
    let total = mi.reduce(function (acc, obj) { return acc + obj.precio }, 0);
    return total;
  }
  borrarMusico(id: number) {
    const musico = this.musicos.filter(m => m.id == id)[0];
    this.rest.deleteMusico(musico);
  }
}

interface FacturaRow {
  nombre: string;
  instrumento: string;
  precio: number;
}
