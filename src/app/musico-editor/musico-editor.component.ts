import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IMusico } from 'src/models/musico';
import { RestService } from '../rest.service';

class Musico implements IMusico {
  id = 0;
  nombre = "";
  fechaIngreso = Date.now().toString();
  tipo = "";
  instrumentoId = null;
  sueldo = 0;
}

@Component({
  selector: 'app-musico-editor',
  templateUrl: './musico-editor.component.html',
  styleUrls: ['./musico-editor.component.scss']
})
export class MusicoEditorComponent implements OnInit {

  musico_form: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private rest: RestService, 
    private router: Router
  ) { 
    this.musico_form = fb.group(new Musico());
    this.route.queryParams.subscribe(params => {
      console.log(params['id']);
      //this.name = params['name'];
    });

    route.url.subscribe(() => {
      let musico_id = route.snapshot.params.id;
      if (musico_id > 0) {
        rest.getMusico(musico_id).subscribe(data => {
          this.musico_form.patchValue(data);
          console.table(data);
        })
      }
    });

  }

  ngOnInit(): void {
  }

  submitForm() {
    if(this.musico_form.valid) {
      console.log("OK")
      console.table(this.musico_form.value.id);
      if (this.musico_form.value.id > 0) {
        this.rest.updateMusico(this.musico_form.value);
      } else {
        this.rest.createMusico(this.musico_form.value);
      }
      this.router.navigateByUrl('/');
    }
  }
}
