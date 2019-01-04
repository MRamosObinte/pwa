import { Component, OnInit } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { EmpleadosService } from './empleados.service';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html'
})
export class EmpleadosComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public parametrosFormulario: any = {};
  public data: any = {};
  public parametrosListado: any = {};
  public constantes: any = LS;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public busqueda: string = "";
  public cargando: boolean = false;
  public vistaFormulario: boolean = false;
  public activar: boolean = false;
  public accion: string = null;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private empleadosService: EmpleadosService
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['empleadoListado'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.definirAtajosDeTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.cargando = true;
    this.activar = false;
    this.obtenerDatosParaCrudEmpleados();
    this.limpiarResultado();
  }

  obtenerDatosParaCrudEmpleados() {
    this.cargando = false;
    let paramaetro = {
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.empleadosService.obtenerDatosParaCrudEmpleados(paramaetro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaCrudEmpleados(data) {
    this.data = data;
    this.cargando = false;
  }

  limpiarResultado() {
    this.filasService.actualizarFilas("0", "0");
    this.parametrosListado = {};
    this.parametrosListado.listar = false;
    this.vistaFormulario = false;
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element = document.getElementById('btnBuscar');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element = document.getElementById('btnNuevo');
      element ? element.click() : null;
      return false;
    }))
  }

  listarEmpleado(estado) {
    this.parametrosListado = {};
    this.parametrosListado.empresa = LS.KEY_EMPRESA_SELECT;
    this.parametrosListado.listar = true;
    this.parametrosListado.buscar = this.busqueda;
    this.parametrosListado.estado = estado;
    this.vistaFormulario = false;
  }

  nuevaEmpleado() {
    if (this.empleadosService.verificarPermiso(LS.ACCION_CREAR, this.empresaSeleccionada, true)) {
      this.vistaFormulario = true;
      this.parametrosFormulario = this.generarParametrosFormulario();
    }
  }

  cancelar() {
    this.vistaFormulario = false;
    this.activar = false;
  }

  /**
   * event contiene la empresa seleccionada, la accion que se envia y otro parametro que se ajuste a la accion
   * @param {*} event
   */
  ejecutarAccion(event) {
    this.definirAtajosDeTeclado();
    switch (event.accion) {
      case LS.ACCION_CREAR:
        this.nuevaEmpleado();
        break;
      case LS.ACCION_LISTAR:
        this.listarEmpleado(false);
        break;
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_CREADO://Se creo un objeto nuevo desde el hijo
        this.actualizarTabla(event);
        break;
      case LS.ACCION_CONSULTAR:
      case LS.ACCION_EDITAR:
        this.irAlHijo(event);
        break;
    }
  }

  actualizarTabla(event) {
    this.vistaFormulario = false;
    this.empresaSeleccionada = event.empresa;
    let parametro = { ...this.parametrosListado };
    parametro.objetoSeleccionado = event.objetoSeleccionado;
    parametro.listar = false;
    this.parametrosListado = parametro;
    this.activar = false;
  }

  irAlHijo(event) {
    this.parametrosFormulario.accion = event.accion;
    this.parametrosFormulario.objetoSeleccionado = event.objetoSeleccionado;
    this.vistaFormulario = true;
    this.activar = true;
  }

  generarParametrosFormulario() {
    return {
      accion: LS.ACCION_CREAR,
      objetoSeleccionado: new RhEmpleado()
    };
  }

}
