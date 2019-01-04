import { Component, OnInit } from '@angular/core';
import { ProductoService } from './producto.service';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvProductoCategoriaTO } from '../../../../entidadesTO/inventario/InvProductoCategoriaTO';
import { ProductoCategoriaService } from '../producto-categoria/producto-categoria.service';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { InvProductoTO } from '../../../../entidadesTO/inventario/InvProductoTO';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public listadoCategorias: Array<InvProductoCategoriaTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public categoriaSeleccionada: InvProductoCategoriaTO = new InvProductoCategoriaTO();
  public parametro = null;
  public parametrosFormulario = null;
  public constantes: any = LS;
  public busqueda: string = null;
  public cargando: boolean = false;
  public vistaFormulario: boolean = false;
  public vistaListado: boolean = false;
  public activar: boolean = false;
  //Variables para que no se vuelva a cargar productos
  public listarProductosEstado: boolean = false;
  public objetoNuevoEditado: { producto: null, accion: null };

  constructor(
    private route: ActivatedRoute,
    private productoCategoriaService: ProductoCategoriaService,
    private productoService: ProductoService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService
  ) {
    this.categoriaSeleccionada = new InvProductoCategoriaTO();
    this.constantes = LS;
    this.definirAtajosDeTeclado();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['productoInv'];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.cambiarEmpresaSelect();
    }
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.categoriaSeleccionada = new InvProductoCategoriaTO();
    this.activar = false;
    this.vistaFormulario = false;
    this.vistaListado = false;
    this.filasService.actualizarFilas("0", "0");
  }

  cargarCategoriasDeProducto(): any {
    this.cargando = true;
    this.productoCategoriaService.listarInvProductoCategoriaTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProductoCategoriaTO(data) {
    this.listadoCategorias = data;
    if (this.listadoCategorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.catCodigo ? this.listadoCategorias.find(item => item.catCodigo === this.categoriaSeleccionada.catCodigo) : this.listadoCategorias[0];
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarProductos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoProductos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.productoService.verificarPermiso(accion, this, mostraMensaje);
  }

  validarBusqueda(): boolean {
    return this.busqueda && this.busqueda !== '';
  }

  listarProductos(estado) {
    this.limpiarResultado();
    this.parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      categoria: null,
      busqueda: this.busqueda,
      incluirInactivos: estado,
      limite: false,
      activar: false
    }
    this.listarProductosEstado = true;
    this.activar = false;
    this.vistaListado = true;
    this.vistaFormulario = false;
  }

  limpiarResultado() {
    this.parametro = null;
    this.parametrosFormulario = null;
    this.vistaListado = false;
    this.vistaFormulario = false;
    this.listarProductosEstado = false;
    this.objetoNuevoEditado = { producto: null, accion: null };
    this.filasService.actualizarFilas(0, 0);
    if (this.busqueda) {
      (<HTMLInputElement>document.getElementById('btnBuscarProductos')).disabled = false;
      (<HTMLInputElement>document.getElementById('btnInactivo')).disabled = false;
    } else {
      (<HTMLInputElement>document.getElementById('btnBuscarProductos')).disabled = true;
      (<HTMLInputElement>document.getElementById('btnInactivo')).disabled = true;
    }
  }

  nuevoProducto() {
    this.vistaFormulario = true;
    this.vistaListado = false;
    this.parametrosFormulario = {
      accion: LS.ACCION_CREAR,
      activar: this.activar,
      objetoSeleccionado: new InvProductoTO()
    };
  }

  accionLista(event) {
    switch (event.accion) {
      case LS.ACCION_CANCELAR:
        this.activar = false;
        this.vistaListado = true;
        this.parametrosFormulario = null;
        this.vistaFormulario = false;
        this.listarProductosEstado = false;
        this.objetoNuevoEditado = { producto: null, accion: null };
        break;
      case LS.ACCION_CREADO:
        this.objetoNuevoEditado = {
          accion: event.accion,
          producto: event.objeto
        };
        this.parametrosFormulario = null;
        this.vistaFormulario = false;
        this.activar = false;
        this.vistaListado = true;
        this.listarProductosEstado = false;
        break;
      case LS.ACCION_MODIFICADO:
        this.objetoNuevoEditado = {
          accion: event.accion,
          producto: event.objeto
        };
        this.parametrosFormulario = null;
        this.vistaFormulario = false;
        this.activar = false;
        this.vistaListado = true;
        this.listarProductosEstado = false;
        break;
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        this.objetoNuevoEditado = {
          accion: null,
          producto: null
        };
        this.mostrarFormulario(event);
        break;
      default:
        this.listarProductos(false);
        break;
    }
    this.definirAtajosDeTeclado();
  }

  mostrarFormulario(event) {
    this.vistaFormulario = true;
    this.vistaListado = false;
    this.activar = true;
    this.parametrosFormulario = {
      accion: event.accion,
      activar: true,
      objetoSeleccionado: event.objetoSeleccionado
    };
  }
}
