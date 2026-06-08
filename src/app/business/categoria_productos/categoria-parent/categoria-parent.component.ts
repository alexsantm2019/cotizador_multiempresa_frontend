// angular import
import {
  AfterViewInit,
  OnInit,
  ViewChild,
  inject,
  TemplateRef,
  Input,
} from '@angular/core';
import { Component } from '@angular/core';
// import {
//   NgbModal,
//   NgbModalRef,
//   NgbModalModule,
// } from '@ng-bootstrap/ng-bootstrap';

// project import
import { CategoriaFormComponent } from '../categoria-form/categoria-form.component';
import { ListaCategoriasComponent } from '../lista-categorias/lista-categorias.component';
import { CategoriaProductoInterface } from '../../../core/models/categoria-producto.models';
import { MatCardModule } from '@angular/material/card';
// import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [MatCardModule, ListaCategoriasComponent, CategoriaFormComponent],
  templateUrl: './categoria-parent.component.html',
  styleUrls: ['./categoria-parent.component.scss'],
})
export class CategoriaParentComponent implements OnInit {
  @ViewChild('listaCategorias') listaCategorias:
    | ListaCategoriasComponent
    | undefined;
  categoriaSeleccionada: any = null;
  isEditMode = false;
  constructor() {}

  ngOnInit(): void {}

  editarCategoria(categoria: any): void {
    this.isEditMode = true;
    this.categoriaSeleccionada = categoria;
  }

  actualizarLista(): void {
    this.isEditMode = false;
    if (this.listaCategorias) {
      this.listaCategorias.getCategoriaProductos(); // Llama al método en lista-cotizaciones
    }
  }
}
