import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  inject,
  ChangeDetectorRef,
  Optional,
  Inject,
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ClientesService } from '../../../core/services/clientes/clientes.service';
import { PaquetesService } from '../../../core/services/paquetes/paquetes.service';
import { ProductosService } from '../../../core/services/productos/productos.service';
import { CotizacionesService } from '../../../core/services/cotizador/cotizador.service';
import { CatalogosService } from '../../../core/services/catalogos/catalogos.service';
import { CATALOGOS } from '../../../core/utils/catalogo';

import { ProductosInterface } from '../../../core/models/productos.model';
import { ClientesInterface } from '../../../core/models/clientes.model';
import { PaqueteInterface } from '../../../core/models/paquetes.models';
import { DetalleInterface } from '../../../core/models/detalles.models';
import { finalize } from 'rxjs';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cotizacion-form',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    // MATERIAL
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  providers: [ToastrService],
  templateUrl: './cotizacion-form.component.html',
  styleUrls: ['./cotizacion-form.component.scss'],
})
export class CotizadorFormComponent implements OnInit, OnChanges {
  @Input() isEditMode = false;
  @Input() cotizacionExistente: any = null;
  @Output() cotizacionGuardada = new EventEmitter<void>();
  @Output() modalCerrado = new EventEmitter<void>();
  @ViewChild('content')
  modalTemplate!: TemplateRef<any>;
  // private toastr: ToastrService;
  private modalService = inject(NgbModal);
  private dialog = inject(MatDialog);
  private clientesService = inject(ClientesService);
  private paquetesService = inject(PaquetesService);
  private productosService = inject(ProductosService);
  private cotizacionesService = inject(CotizacionesService);
  private catalogosService = inject(CatalogosService);
  private toastr = inject(ToastrService);

  // private notyf = new Notyf();

  modalRef?: NgbModalRef;
  cotizacionForm!: FormGroup;
  clientes: ClientesInterface[] = [];
  paquetes: PaqueteInterface[] = [];
  productos: ProductosInterface[] = [];
  itemsCotizacion: any[] = [];
  hoy = new Date().toISOString().split('T')[0];
  estadosCotizacion: any[] = [];
  tiposEvento: any[] = [];
  ivaOptions = [
    { value: 0, label: '0%' },
    { value: 15, label: '15%' },
  ];
  isSaving: boolean;
  content: TemplateRef<any>;
  isDialogInstance = false;

  // EMPRESA:
  private authService = inject(AuthService);
  empresaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,

    @Optional()
    public dialogRef: MatDialogRef<CotizadorFormComponent>,

    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: any,
  ) {
    this.inicializarFormulario();

    this.isDialogInstance = !!dialogRef;
  }

  ngOnInit(): void {
    this.empresaId = this.authService.getEmpresaId();
    this.cargarCatalogos();
    if (this.data) {
      this.isEditMode = this.data.isEditMode ?? false;
      this.cotizacionExistente = this.data.cotizacionExistente ?? null;

      if (this.cotizacionExistente) {
        setTimeout(() => {
          this.cargarCotizacion(this.cotizacionExistente);
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cotizacionExistente']?.currentValue) {
      this.resetFormulario();

      this.cargarCotizacion(changes['cotizacionExistente'].currentValue);

      if (this.isEditMode && this.modalTemplate) {
        this.openModal();
      }
    }
  }

  resetFormulario() {
    this.cotizacionForm.reset();
    this.itemsCotizacion = [];
  }

  inicializarFormulario(): void {
    this.cotizacionForm = this.fb.group({
      cliente: [null, Validators.required],
      producto: [null],
      paquete: [null],
      iva: [0, Validators.required],
      estado: [1, Validators.required],
      fechaValidez: ['', Validators.required],
      fechaEvento: ['', Validators.required],
      nombreCotizacion: ['', [Validators.required, Validators.minLength(3)]],
      tipoEvento: ['', Validators.required],
      duracionEvento: ['', [Validators.required, Validators.min(1)]],
    });
  }

  cargarCatalogos(): void {
    this.getClientes();
    this.getProductos();
    this.getPaquetes();
    this.getEstadosCotizacion();
    this.getTipoEventos();
  }

  getFechaMinima(): string {
    return this.hoy;
  }

  getEstadosCotizacion(): void {
    let empresaId = this.empresaId!;
    this.catalogosService
      .getCatalogoByGrupoByEmpresaId(
        CATALOGOS.GRUPO_ESTADOS_COTIZACIONES,
        empresaId,
      )
      .subscribe({
        next: (data) => (this.estadosCotizacion = data),
      });
  }

  getTipoEventos(): void {
    let empresaId = this.empresaId!;
    this.catalogosService
      .getCatalogoByGrupoByEmpresaId(CATALOGOS.GRUPO_TIPO_EVENTOS, empresaId)
      .subscribe({
        next: (data) => (this.tiposEvento = data),
      });
  }

  // ==========================================
  // CARGAR COTIZACIÓN PARA EDITAR
  // ==========================================
  cargarCotizacion(cotizacion: any): void {
    if (!cotizacion) return;

    this.itemsCotizacion = [];

    this.cotizacionForm.patchValue({
      cliente: cotizacion.cliente?.id ?? 0,
      empresa_id: this.authService.getEmpresaId() ?? 0,
      iva: Number(cotizacion.iva) || 0,
      estado: cotizacion.estado_info?.id ?? 1,
      fechaValidez: this.parsearFecha(cotizacion.fecha_vigencia),
      fechaEvento: this.parsearFecha(cotizacion.fecha_evento),
      nombreCotizacion: cotizacion.nombre_evento ?? '',
      tipoEvento: cotizacion.tipo_evento_info?.id ?? '',
      duracionEvento: cotizacion.duracion_evento ?? 1,
    });
    this.poblarItemsCotizacion(cotizacion);
  }

  // ==========================================
  // FORMATEAR FECHAS
  // ==========================================
  parsearFecha(fecha: any): string {
    if (!fecha) return '';
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) return '';
      return fechaObj.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  // ==========================================
  // POBLAR ITEMS EN MODO EDICIÓN
  // ==========================================
  poblarItemsCotizacion(cotizacion: any): void {
    if (!cotizacion?.detalles?.length) return;

    cotizacion.detalles.forEach((detalle: any) => {
      const tipoItem = detalle.tipo_item;

      // Producto individual
      if (tipoItem === 1 || tipoItem === 3) {
        const costo = Number(detalle.info_producto?.costo || 0);
        const cantidad = Number(detalle.cantidad || 1);
        const descuento = Number(detalle.descuento || 0);

        this.itemsCotizacion.push({
          id: detalle.info_producto?.id,
          nombre: detalle.info_producto?.producto,
          cantidad,
          descuento,
          precio_unitario: costo,
          total: cantidad * costo - descuento,
          tipo: tipoItem,
          disable: tipoItem === 3,
        });

        // Fuerza refresh de mat-table
        this.itemsCotizacion = [...this.itemsCotizacion];
      }

      // Paquete
      if (tipoItem === 2 && detalle.info_paquete) {
        this.itemsCotizacion.push({
          id: detalle.info_paquete.id,
          nombre: detalle.info_paquete.nombre_paquete,
          cantidad: detalle.cantidad || 1,
          descuento: detalle.descuento || 0,
          precio_unitario: detalle.info_paquete.precio_total || 0,
          total:
            (detalle.info_paquete.precio_total || 0) * (detalle.cantidad || 1),
          tipo: 2,
          disable: true,
        });

        // refresh table
        this.itemsCotizacion = [...this.itemsCotizacion];
      }
    });
  }

  // ==========================================
  // OBTENER DATOS
  // ==========================================
  getClientes(): void {
    let id = this.empresaId!;
    this.clientesService.getClientesByEmpresaId(id).subscribe({
      next: (data) => {
        this.clientes = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
    });
  }

  getProductos(): void {
    let id = this.empresaId!;
    this.productosService.getProductosByEmpresaId(id).subscribe({
      next: (data) => {
        this.productos = data.sort((a, b) =>
          a.producto.localeCompare(b.producto),
        );
      },
    });
  }

  getPaquetes(): void {
    let id = this.empresaId!;
    this.paquetesService.getPaquetesByEmpresaId(id).subscribe({
      next: (data) => {
        this.paquetes = data.sort((a, b) =>
          a.nombre_paquete.localeCompare(b.nombre_paquete),
        );
      },
    });
  }

  // ==========================================
  // AGREGAR PRODUCTO
  // ==========================================
  agregarProducto(): void {
    const producto = this.cotizacionForm.get('producto')?.value;

    if (!producto) return;

    this.itemsCotizacion.push({
      id: producto.id,
      nombre: producto.producto,
      cantidad: 1,
      descuento: 0,
      precio_unitario: producto.costo,
      total: producto.costo,
      tipo: 1,
      disable: false,
    });

    // FORZAR REFRESH DE MAT TABLE
    this.itemsCotizacion = [...this.itemsCotizacion];

    this.cotizacionForm.patchValue({
      producto: null,
    });
  }

  // ==========================================
  // AGREGAR PAQUETE
  // ==========================================
  agregarPaquete(): void {
    const paquete = this.cotizacionForm.get('paquete')?.value;

    if (!paquete) return;

    this.itemsCotizacion.push({
      id: paquete.id,
      nombre: paquete.nombre_paquete,
      cantidad: 1,
      descuento: 0,
      precio_unitario: paquete.precio_total || 0,
      total: paquete.precio_total || 0,
      tipo: 2,
      disable: true,
    });

    // FORZAR REFRESH DE MAT TABLE
    this.itemsCotizacion = [...this.itemsCotizacion];

    this.paquetesService.getPaqueteById(paquete.id).subscribe((response) => {
      const paqueteDetalle = response?.[0];

      if (!paqueteDetalle?.detalles?.length) return;

      paqueteDetalle.detalles.forEach((detalle: any) => {
        const cantidad = Number(detalle.cantidad || 1);
        const costoProducto = Number(detalle.costo_producto || 0);

        const precioUnitario = cantidad > 0 ? costoProducto / cantidad : 0;

        this.itemsCotizacion.push({
          id: detalle.producto.id,
          nombre: detalle.producto.producto,
          cantidad,
          descuento: 0,
          precio_unitario: precioUnitario,
          total: costoProducto,
          tipo: 3,
          disable: true,
        });

        // FORZAR REFRESH DE MAT TABLE
        this.itemsCotizacion = [...this.itemsCotizacion];
      });
    });

    this.cotizacionForm.patchValue({
      paquete: null,
    });
  }

  // ==========================================
  // ACTUALIZAR TOTAL ITEM
  // ==========================================
  actualizarTotal(index: number): void {
    const item = this.itemsCotizacion[index];
    if (!item) return;
    item.cantidad = Math.max(1, Number(item.cantidad) || 1);
    item.descuento = Math.max(0, Number(item.descuento) || 0);
    const subtotal = item.cantidad * item.precio_unitario;
    item.total = Math.max(0, subtotal - item.descuento);
  }

  // ==========================================
  // ELIMINAR ITEM
  // ==========================================
  eliminarItem(index: number): void {
    this.itemsCotizacion.splice(index, 1);
    this.itemsCotizacion = [...this.itemsCotizacion];
  }

  // ==========================================
  // SUBTOTAL Y TOTAL
  // ==========================================
  calcularSubtotal(): number {
    return this.itemsCotizacion.reduce((sum, item) => {
      return Number(sum) + (Number(item.total) || 0);
    }, 0);
  }

  // calcularTotal(): number {
  //   const subtotal = this.calcularSubtotal();
  //   const iva = subtotal * (Number(this.cotizacionForm.value.iva) / 100);

  //   return Number((subtotal + iva).toFixed(2));
  // }

  calcularTotal(): number {
    const subtotal = Number(this.calcularSubtotal()) || 0;
    const porcentajeIva = Number(this.cotizacionForm.get('iva')?.value) || 0;
    const iva = subtotal * (porcentajeIva / 100);
    const total = subtotal + iva;
    return Number(total.toFixed(2));
  }

  // ==========================================
  // GUARDAR / ACTUALIZAR
  // ==========================================
  guardarCotizacion(): void {
    if (this.cotizacionForm.invalid) {
      this.marcarCamposComoSucios();
      return;
    }
    this.isSaving = true;
    const formValue = this.cotizacionForm.value;
    const empresaId = this.authService.getEmpresaId();

    const cotizacion = {
      id: this.cotizacionExistente?.id,
      cliente: Number(formValue.cliente),
      iva: formValue.iva,
      estado: formValue.estado,
      subtotal: this.calcularSubtotal(),
      total: this.calcularTotal(),
      fecha_vigencia: formValue.fechaValidez,
      fecha_evento: formValue.fechaEvento,
      nombre_evento: formValue.nombreCotizacion,
      tipo_evento: formValue.tipoEvento,
      duracion_evento: formValue.duracionEvento,
      empresa_id: empresaId,

      detalles: this.itemsCotizacion.map((item) => ({
        cantidad: item.cantidad,
        paquete: item.tipo === 2 ? item.id : null,
        producto: item.tipo === 1 || item.tipo === 3 ? item.id : null,
        tipo_item: item.tipo,
        descuento: Number(item.descuento) || 0,
      })),
    };

    const request$ = cotizacion.id
      ? this.cotizacionesService.updateCotizacion(cotizacion.id, cotizacion)
      : this.cotizacionesService.createCotizacion(cotizacion);

    request$
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
      )
      .subscribe({
        next: () => {
          this.showSuccess(
            cotizacion.id ? 'Cotización actualizada' : 'Cotización creada',
          );
          this.cotizacionGuardada.emit();
          this.limpiarFormulario();
          this.closeModal(true);
        },
        error: (error) => {
          console.error(error);
          this.showError('Error al guardar cotización');
        },
      });
  }

  // ==========================================
  // VALIDACIONES
  // ==========================================
  marcarCamposComoSucios(): void {
    Object.values(this.cotizacionForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }

  // ==========================================
  // LIMPIAR FORMULARIO
  // ==========================================
  limpiarFormulario(): void {
    this.cotizacionForm.reset({
      cliente: 0,
      producto: null,
      paquete: null,
      iva: 0,
      estado: 1,
      fechaValidez: '',
      fechaEvento: '',
      nombreCotizacion: '',
      tipoEvento: '',
      duracionEvento: '',
    });

    this.itemsCotizacion = [];

    this.cdr.detectChanges();
  }

  // ==========================================
  // MODAL
  // ==========================================
  // openModal(content: TemplateRef<any>): void {
  //   this.modalRef = this.modalService.open(content, {
  //     size: 'xl',
  //     centered: true,
  //     backdrop: 'static',
  //     scrollable: true,
  //   });

  //   this.modalRef.result.finally(() => {
  //     this.modalCerrado.emit();
  //   });
  // }

  openModal(): void {
    const dialogRef = this.dialog.open(CotizadorFormComponent, {
      width: '1400px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      disableClose: true,
      autoFocus: false,
      panelClass: 'cotizacion-dialog',
      data: {
        cotizacionExistente: this.cotizacionExistente,
        isEditMode: this.isEditMode,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.cotizacionGuardada.emit();
      }
    });
  }

  // closeModal(): void {
  //   // this.modalRef?.close();
  //   this.dialog.closeAll();
  // }
  closeModal(success: boolean = false): void {
    this.dialogRef.close({ success });
  }

  // ==========================================
  // NOTIFICACIONES
  // ==========================================
  showSuccess(msg: any) {
    this.toastr.success(msg);
  }
  showError(msg: any) {
    this.toastr.error(msg);
  }
}
