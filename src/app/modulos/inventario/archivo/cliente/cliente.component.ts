import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '@angular/router';
import { LS } from '../../../../constantes/app-constants';
import { InvCliente } from '../../../../entidades/inventario/InvCliente';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { InvClienteCategoriaTO } from '../../../../entidadesTO/inventario/InvClienteCategoriaTO';
import { InvClienteTO } from '../../../../entidadesTO/inventario/InvClienteTO';
import { ClienteService } from './cliente.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  listadoCategorias: Array<InvClienteCategoriaTO> = new Array();
  empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  cliente: InvCliente;
  public busqueda: string = null;
  parametro: any = {};
  parametrosFormulario: any = {};
  constantes: any;
  cargando: boolean = false;
  vistaFormulario: boolean = false;
  vistaListado: boolean = false;
  activar: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private clienteService: ClienteService,
    private filasService: FilasResolve,
    private utilService: UtilService
  ) {
    this.cliente = new InvCliente();
    this.constantes = LS;
    this.iniciarAtajos();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['clienteInv'];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    }
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.vistaFormulario = false;
    this.vistaListado = false;
  }

  iniciarAtajos(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      this.activar = !this.activar;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      !this.vistaFormulario ? this.listarClientes(false) : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      this.nuevoCliente();
      return false;
    }))
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.clienteService.verificarPermiso(accion, this, mostraMensaje);
  }

  listarClientes(estado) {
    this.parametro = {};
    this.parametro.empresa = LS.KEY_EMPRESA_SELECT;
    this.parametro.categoria = null;
    this.parametro.busqueda = this.busqueda;
    this.parametro.debeBuscar = true;
    this.parametro.mostrarInactivo = estado;
    this.vistaListado = true;
    this.vistaFormulario = false;
  }

  nuevoCliente() {
    this.vistaFormulario = true;
    this.vistaListado = false;
    this.parametrosFormulario = {
      accion: LS.ACCION_NUEVO,
      objetoSeleccionado: new InvClienteTO(),
      categoriaSeleccionada: null
    };
  }

  limpiarResultado() {
    this.parametro = null;
    this.parametrosFormulario = null;
    this.vistaListado = false;
    this.vistaFormulario = false;
    this.filasService.actualizarFilas(0, 0);
    if (this.busqueda) {
      (<HTMLInputElement>document.getElementById('btnBuscarCliente')).disabled = false;
      (<HTMLInputElement>document.getElementById('btnInactivo')).disabled = false;
    } else {
      (<HTMLInputElement>document.getElementById('btnBuscarCliente')).disabled = true;
      (<HTMLInputElement>document.getElementById('btnInactivo')).disabled = true;
    }
  }

  cancelar(event) {
    if (event) {
      if (this.parametro && this.parametro.mostrarInactivo != undefined) {
        this.listarClientes(this.parametro.mostrarInactivo);
      } else {
        this.limpiarResultado();
        this.activar = false;
        this.vistaListado = false;
        this.parametrosFormulario = null;
        this.vistaFormulario = false;
        this.parametro = null;
      }
      this.iniciarAtajos();
    }
  }
  /**
   *El accion del evento (event.accion) es una accion nuevo entonces ejecutamos el metodo "nuevoCliente()"
   *caso contrario la misma accion del evento es editar o consultar se ejecuta el metodo "mostrarFormulario(event)"
   * @param {event} event
   * @memberof ClienteComponent
   */
  accionLista(event) {
    //En que lugar de la lista debe insertar,
    switch (event.accion) {
      case LS.ACCION_NUEVO:
        this.nuevoCliente();
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
      objetoSeleccionado: event.objetoSeleccionado
    };
  }
}
