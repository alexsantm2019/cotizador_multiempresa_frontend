// angular import
import { Component, OnInit, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

// project import
// import { SharedModule } from 'src/app/theme/shared/shared.module';
// import { Notyf } from 'notyf';

// Servicio:
import { AuthService } from '../../../core/services/auth/auth.service';
import { CatalogosService } from '../../../core/services/catalogos/catalogos.service';
import { CategoriaProductoService } from '../../../core/services/categoria-producto/categoria-producto.service';
import { PaquetesService } from '../../../core/services/paquetes/paquetes.service';
import { ProductosService } from '../../../core/services/productos/productos.service';
import { ProductosInterface } from '../../../core/models/productos.model';
import { CategoriaProductoInterface } from '../../../core/models/categoria-producto.models';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nuevo-paquete',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    MatIcon,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
  ],
  templateUrl: './nuevo-paquete.component.html',
  styleUrls: ['./nuevo-paquete.component.scss'],
})
export class NuevoPaqueteComponent implements OnInit {
  private paqueteService = inject(PaquetesService);
  private productosService = inject(ProductosService);
  private catalogosService = inject(CatalogosService);
  private categoriaProductoService = inject(CategoriaProductoService);
  private activatedRoute = inject(ActivatedRoute);

  paqueteForm!: FormGroup;
  productos: ProductosInterface[] = [];
  // private notyf = new Notyf();
  // private toastr: ToastrService;
  private toastr = inject(ToastrService);
  categoriasProductos: CategoriaProductoInterface[] = [];
  paqueteId: number | null = null;

  // EMPRESA:
  private authService = inject(AuthService);
  empresaId: number | null = null;

  constructor(
    private route: ActivatedRoute, // Inyectar el ActivatedRoute
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.paqueteForm = this.fb.group({
      nombre_paquete: ['', Validators.required],
      descripcion: ['', Validators.required],
      detalles: this.fb.array([] as FormGroup[]),
      categoria_producto_id: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.empresaId = this.authService.getEmpresaId();
    this.getProductos();
    this.getCategoriaProducto();

    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('paqueteId');
      console.log('Extrayendo datos de paquete ', id);
      this.paqueteId = id ? parseInt(id, 10) : null; // Convierte el ID a número
      if (this.paqueteId) {
        this.loadPaqueteData(this.paqueteId);
      }
    });
  }

  get detalles(): FormArray<FormGroup> {
    return this.paqueteForm.get('detalles') as FormArray<FormGroup>;
  }

  loadPaqueteData(id: number): void {
    this.paqueteService.getPaqueteById(id).subscribe((paqueteArray) => {
      // Verificar si paqueteArray tiene datos

      if (paqueteArray && paqueteArray.length > 0) {
        const paquete = paqueteArray[0]; // Asumiendo que el array contiene un solo paquete

        // Verificar que paquete no sea undefined
        if (paquete) {
          this.paqueteForm.patchValue({
            nombre_paquete: paquete.nombre_paquete,
            descripcion: paquete.descripcion,
            categoria_producto_id: paquete.categoria_producto_id,
          });

          // Poblar detalles
          paquete.detalles?.forEach((detalle: any) => {
            this.detalles.push(
              this.fb.group({
                producto: [detalle.producto.id, Validators.required],
                cantidad: [detalle.cantidad, Validators.required],
                duracion_horas: [detalle.duracion_horas, Validators.required],
                costo_producto: [detalle.costo_producto, Validators.required],
              }),
            );
          });
        } else {
          console.log('El paquete es undefined');
        }
      } else {
        console.log('Paquete no encontrado o array vacío');
      }
    });
  }

  // getProductos(): void {
  //   this.productosService.getProductos().subscribe({
  //     next: (data) => {
  //       this.productos = data
  //         .map((producto: any) => ({
  //           ...producto,
  //           tipo_costo: producto.tipo_costo, // 1 o 2
  //           costo: producto.costo, // Costo del producto
  //         }))
  //         .sort((a, b) => a.producto.localeCompare(b.producto));
  //     },
  //     error: (error) => {
  //       console.error('Error en la búsqueda de productos:', error);
  //     },
  //   });
  // }

  getProductos(): void {
    let id = this.empresaId!;
    this.productosService.getProductosByEmpresaId(id).subscribe({
      next: (data) => {
        this.productos = data
          .map((producto: any) => ({
            ...producto,
            tipo_costo: producto.tipo_costo, // 1 o 2
            costo: producto.costo, // Costo del producto
          }))
          .sort((a, b) => a.producto.localeCompare(b.producto));
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }

  onProductoChange(index: number): void {
    const detalleForm = this.detalles.at(index);
    const productoId = detalleForm.get('producto')?.value;

    // Convierte productoId a número si es necesario
    const productoSeleccionado = this.productos.find(
      (p) => p.id === parseInt(productoId, 10),
    );

    if (productoSeleccionado) {
      // Establece el costo base del producto
      detalleForm.get('costo_producto')?.setValue(productoSeleccionado.costo);

      // Ajusta los campos según el tipo de costo
      // if (productoSeleccionado.tipo_costo === 1) {
      //   detalleForm.get('cantidad')?.enable();
      //   detalleForm.get('duracion_horas')?.disable();
      // } else if (productoSeleccionado.tipo_costo === 2) {
      //   detalleForm.get('cantidad')?.disable();
      //   detalleForm.get('duracion_horas')?.enable();
      // }

      // Actualizamos el costo al cambiar el producto
      this.updateCosto(index);
    } else {
      console.log('Producto no encontrado, restableciendo campos');
      detalleForm.get('cantidad')?.enable();
      // detalleForm.get('duracion_horas')?.enable();
      detalleForm.get('costo_producto')?.reset();
    }
  }

  addDetalle(): void {
    const detalleForm = this.fb.group({
      producto: ['', Validators.required], // Producto seleccionado
      cantidad: [
        { value: 0, disabled: false },
        [Validators.required, Validators.min(1)],
      ],
      duracion_horas: [
        { value: 0, disabled: true },
        [Validators.required, Validators.min(0)],
      ],
      costo_producto: [0, Validators.required], // Costo predeterminado
    });
    this.detalles.push(detalleForm);
  }

  deleteDetalle(index: number): void {
    this.detalles.removeAt(index);
  }
  updateCosto(index: number): void {
    const detalleForm = this.detalles.at(index) as FormGroup;
    const productoId = detalleForm.get('producto')?.value;
    const producto = this.productos.find(
      (p) => p.id === parseInt(productoId, 10),
    );

    if (producto) {
      const cantidad = detalleForm.get('cantidad')?.value;
      let costoFinal = 0;
      costoFinal = producto.costo * cantidad;

      // Establecemos el valor calculado en costo_producto
      detalleForm.get('costo_producto')?.setValue(costoFinal);
    }
  }

  getCategoriaProducto(): void {
    this.categoriaProductoService.getCategoriaProducto().subscribe({
      next: (data) => {
        this.categoriasProductos = data;
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }

  createPaquete(): void {
    // Sumar los costos de los productos
    let precioTotal = 0;
    this.detalles.controls.forEach((detalle: FormGroup) => {
      precioTotal += detalle.get('costo_producto')?.value || 0; // Si no hay valor, se suma 0
    });

    // Asignar el precio total al objeto paqueteData
    const paqueteData = this.paqueteForm.value;
    paqueteData.precio_total = precioTotal; // Agregar el precio total calculado
    paqueteData.empresa_id = this.authService.getEmpresaId(); // Agregar el precio total calculado

    // Enviar los datos al servicio
    this.paqueteService.createPaquete(paqueteData).subscribe(
      (response) => {
        this.paqueteForm.reset();
        while (this.detalles.length) {
          this.detalles.removeAt(0);
        }
        this.showSuccess('Paquete guardado exitosamente');
      },
      (error) => {
        this.showError('Error al guardar el paquete');
        console.error(error);
      },
    );
  }

  updatePaquete(): void {
    // Sumar los costos de los productos
    let precioTotal = 0;
    this.detalles.controls.forEach((detalle: FormGroup) => {
      const costo = parseFloat(detalle.get('costo_producto')?.value || '0'); // Asegura que el valor sea un número
      precioTotal += costo;
    });

    // Asignar el precio total al objeto paqueteData
    const paqueteData = this.paqueteForm.value;
    paqueteData.precio_total = precioTotal.toFixed(2); // Agregar el precio total calculado

    this.paqueteService.updatePaquete(this.paqueteId!, paqueteData).subscribe(
      (response) => {
        this.showSuccess('Paquete actualizado exitosamente');
        this.router.navigate(['/paquetes']); // Redirige a la lista de paquetes
      },
      (error) => {
        this.showError('Error al actualizar el paquete');
        console.error(error);
      },
    );
  }
  showSuccess(msg: any) {
    this.toastr.success(msg);
  }
  showError(msg: any) {
    this.toastr.error(msg);
  }
}
