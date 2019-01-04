import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { InvProductoCategoriaTO } from '../../../../entidadesTO/inventario/InvProductoCategoriaTO';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { ProductoCategoriaService } from '../../componentes/producto-categoria/producto-categoria.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-listado-producto',
  templateUrl: './listado-producto.component.html',
  styleUrls: ['./listado-producto.component.css']
})
export class ListadoProductoComponent implements OnInit {
  public listaCategorias: Array<InvProductoCategoriaTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listadoProductos: Array<InvListaProductosGeneralTO> = [];
  public categoriaSeleccionada: InvProductoCategoriaTO = new InvProductoCategoriaTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public cargando: boolean = false;
  public activar: boolean = false;
  public constantes: any = LS;
  public busqueda: string = null;
  public parametro = null;
  public parametrosFormulario = null;
  public vistaFormulario: boolean = false;
  public vistaListado: boolean = false;
  //Variables para que no se vuelva a cargar productos
  public listarProductosEstado: boolean = false;
  public objetoNuevoEditado: { producto: null, accion: null };

  constructor(
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private productoCategoriaService: ProductoCategoriaService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['listadoProducto'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.categoriaSeleccionada = null;
    this.busqueda = null;
    this.limpiarResultado();
    this.listarCategorias();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarProductos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  limpiarResultado() {
    this.listadoProductos = [];
    this.parametro = null;
    this.parametrosFormulario = null;
    this.vistaListado = false;
    this.vistaFormulario = false;
    this.listarProductosEstado = false;
    this.objetoNuevoEditado = { producto: null, accion: null };
    this.filasService.actualizarFilas("0", "0");
  }

  listarCategorias() {
    this.cargando = true;
    this.listaCategorias = [];
    this.limpiarResultado();
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, tipoComprobante: "", accion: LS.ACCION_COMBO };
    this.productoCategoriaService.listarInvProductoCategoriaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProductoCategoriaTO(data) {
    this.listaCategorias = data;
    if (this.listaCategorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.catCodigo ? this.listaCategorias.find(item => item.catCodigo === this.categoriaSeleccionada.catCodigo) : null;
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  //Operaciones
  buscarProductos(estado) {
    this.limpiarResultado();
    this.parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      categoria: this.categoriaSeleccionada && this.categoriaSeleccionada.catCodigo ? this.categoriaSeleccionada.catCodigo : null,
      busqueda: this.busqueda ? this.busqueda : null,
      incluirInactivos: estado,
      limite: false,
      activar: false,
      vista: 'listadoProductos'
    }
    this.listarProductosEstado = true;
    this.activar = false;
    this.vistaListado = true;
    this.vistaFormulario = false;
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
        this.buscarProductos(false);
        break;
    }
    this.generarAtajosTeclado();
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
