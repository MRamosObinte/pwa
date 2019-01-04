import { Component, OnInit } from '@angular/core';
import { InvFunListadoClientesTO } from '../../../../entidadesTO/inventario/InvFunListadoClientesTO';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { InvClienteCategoriaTO } from '../../../../entidadesTO/inventario/InvClienteCategoriaTO';
import { ClienteCategoriaService } from '../../archivo/cliente-categoria/cliente-categoria.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-listado-cliente',
  templateUrl: './listado-cliente.component.html',
  styleUrls: ['./listado-cliente.component.css']
})
export class ListadoClienteComponent implements OnInit {
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listadoClientes: Array<InvFunListadoClientesTO> = new Array();
  public listadoCategorias: Array<InvClienteCategoriaTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public categoriaSeleccionada: InvClienteCategoriaTO = new InvClienteCategoriaTO();
  public activar: boolean = false;
  public cargando: boolean = false;
  public constantes: any = LS;
  public filasTiempo: FilasTiempo = new FilasTiempo();

  vistaFormulario: boolean = false;
  vistaListado: boolean = false;
  parametrosFormulario: any = {};
  parametro: any = {};

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private clienteCategoriaService: ClienteCategoriaService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['listadoCliente'];
    this.generarAtgajosTeclado();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
  }

  generarAtgajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      this.activar = !this.activar;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      !this.vistaFormulario ? this.buscarClientes(false) : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.categoriaSeleccionada = null;
    this.limpiarResultado();
    this.listarCategorias();
  }

  limpiarResultado() {
    this.listadoClientes = [];
    this.vistaListado = false;
    this.vistaFormulario = false;
    this.filasService.actualizarFilas("0", "0");
  }

  listarCategorias() {
    this.cargando = true;
    this.limpiarResultado();
    this.listadoCategorias = [];
    this.clienteCategoriaService.listarInvClienteCategoriaTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvClienteCategoriaTO(data) {
    this.listadoCategorias = data;
    if (this.listadoCategorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.ccCodigo ? this.listadoCategorias.find(item => item.ccCodigo === this.categoriaSeleccionada.ccCodigo) : null;
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  //Operaciones
  buscarClientes(estado) {
    this.parametro = {};
    this.parametro.empresa = LS.KEY_EMPRESA_SELECT;
    this.parametro.categoria = this.categoriaSeleccionada && this.categoriaSeleccionada.ccCodigo ? this.categoriaSeleccionada.ccCodigo : null;
    this.parametro.busqueda = null;
    this.parametro.mostrarInactivo = estado;
    this.parametro.soloEditarConsultar = true;
    this.parametro.debeBuscar = true;
    this.vistaListado = true;
    this.vistaFormulario = false;
  }

  accionLista(event) {
    //En que lugar de la lista debe insertar,
    switch (event.accion) {
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
      objetoSeleccionado: event.objetoSeleccionado
    };
  }

  cancelar(event) {
    if (event) {
      if (this.parametro && this.parametro.mostrarInactivo != undefined) {
        this.buscarClientes(this.parametro.mostrarInactivo);
      } else {
        this.limpiarResultado();
      }
      this.generarAtgajosTeclado();
    }
  }

}
