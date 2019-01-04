import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ProductosPescaService } from './productos-pesca.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { LS } from '../../../../constantes/app-constants';
import { PrdProducto } from '../../../../entidades/rrhh/PrdProducto';

@Component({
  selector: 'app-productos-pesca',
  templateUrl: './productos-pesca.component.html',
  styleUrls: ['./productos-pesca.component.css']
})
export class ProductosPescaComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public busqueda: string = null;
  public parametro: any = {};
  public parametrosFormulario: any = {};
  public constantes: any;
  public cargando: boolean = false;
  public vistaFormulario: boolean = false;
  public vistaListado: boolean = false;
  public activar: boolean = false;
  //
  public producto: PrdProducto;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private productosPescaService: ProductosPescaService,
    private utilService: UtilService,
    private filasService: FilasResolve,
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['producto'];
    this.producto = new PrdProducto();
    this.constantes = LS;
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.listaEmpresas ? this.cambiarEmpresaSelect() : null;
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    }
    this.definirAtajosDeTeclado();
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.vistaFormulario = false;
    this.vistaListado = false;
  }

  limpiarPiscinas() {
    this.vistaFormulario = false;
    this.vistaListado = false;
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      this.activar = !this.activar;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      !this.vistaFormulario ? this.listarProductoPesca(false) : null
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      this.nuevaProductoPesca();
      return false;
    }))
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.productosPescaService.verificarPermiso(accion, this, mostraMensaje);
  }

  listarProductoPesca(inactivo) {
    this.parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      debeBuscar: true,
      inactivos: inactivo
    };
    this.vistaListado = true;
    this.vistaFormulario = false;
    this.definirAtajosDeTeclado();
  }

  refrescarTabla(estado, productoPesca, accion) {
    this.parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      mostrarInactivo: estado,
      productoPesca: productoPesca,
      accion: accion,
      debeBuscar: false
    };
    this.definirAtajosDeTeclado();
    this.vistaListado = true;
    this.vistaFormulario = false;
  }

  nuevaProductoPesca() {
    this.vistaFormulario = true;
    this.vistaListado = false;
    this.parametrosFormulario = {
      accion: LS.ACCION_NUEVO,
      productoPescaSeleccionada: new PrdProducto(),
    };
  }

  limpiarResultado() {
    this.parametro = null;
    this.parametrosFormulario = null;
    this.vistaListado = false;
    this.vistaFormulario = false;
    this.filasService.actualizarFilas(0, 0);
  }

  cancelar(event) {
    if (event) {
      if (this.parametro) {
        switch (event.accion) {
          case LS.ACCION_NUEVO:
          case LS.ACCION_EDITAR:
          case LS.ACCION_REGISTRO_NO_EXITOSO:
            this.refrescarTabla(this.parametro.mostrarInactivo, event.productoPesca, event.accion);
            break;
          default:
            this.parametro = {
              empresa: LS.KEY_EMPRESA_SELECT,
              mostrarInactivo: true,
              accion: LS.ACCION_LISTAR,
              debeBuscar: false
            };
            this.vistaListado = true;
            this.vistaFormulario = false;
            this.definirAtajosDeTeclado();
            break;
        }
      } else {
        this.limpiarResultado();
      }
      this.definirAtajosDeTeclado();
    }
  }

  accionLista(event) {
    //En que lugar de la lista debe insertar,
    switch (event.accion) {
      case LS.ACCION_NUEVO:
        this.nuevaProductoPesca();
        break;
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        this.mostrarFormulario(event);
        break;
    }
  }

  mostrarFormulario(event) {
    this.vistaFormulario = true;
    this.vistaListado = false;
    this.parametrosFormulario = {
      accion: event.accion,
      productoPescaSeleccionada: event.productoPescaSeleccionada,
    };
  }
}
