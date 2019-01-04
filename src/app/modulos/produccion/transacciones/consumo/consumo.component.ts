import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { ActivatedRoute } from '@angular/router';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { InvConsumosMotivoTO } from '../../../../entidadesTO/inventario/InvConsumosMotivoTO';
import { MotivoConsumosService } from '../../../inventario/archivo/motivo-consumos/motivo-consumos.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { ConsumoService } from './consumo.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html'
})
export class ConsumoComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public listaPeriodos: Array<SisPeriodo> = [];
  public listaConsumoMotivo: Array<InvConsumosMotivoTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public motivoSeleccionado: InvConsumosMotivoTO = new InvConsumosMotivoTO();
  public parametrosFormulario: any = {};
  public parametrosListado: any = {};
  public constantes: any = LS;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public busqueda: string = "";
  public cargando: boolean = false;
  public vistaFormulario: boolean = false;
  public activar: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private consumoService: ConsumoService,
    private periodoService: PeriodoService,
    private motivoConsumoService: MotivoConsumosService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['consumosListado'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.definirAtajosDeTeclado();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.listarPeriodos();
    this.listarMotivosConsumo();
    this.limpiarResultado();
  }

  listarPeriodos() {
    this.listaPeriodos = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarPeriodos() y asi seleccionar el primer elemento*/
  despuesDeListarPeriodos(listaPeriodos) {
    this.listaPeriodos = listaPeriodos;
    if (this.listaPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.sisPeriodoPK.perCodigo ? this.listaPeriodos.find(item => item.sisPeriodoPK.perCodigo === this.periodoSeleccionado.sisPeriodoPK.perCodigo) : this.listaPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  listarMotivosConsumo() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivos: false };
    this.motivoConsumoService.listarInvConsumosMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarInvConsumosMotivoTO()*/
  despuesDeListarInvConsumosMotivoTO(data) {
    this.listaConsumoMotivo = data;
    if (this.listaConsumoMotivo.length > 0) {
      this.motivoSeleccionado = this.motivoSeleccionado && this.motivoSeleccionado.cmCodigo ? this.listaConsumoMotivo.find(item => item.cmCodigo === this.motivoSeleccionado.cmCodigo) : null;
    } else {
      this.motivoSeleccionado = null;
    }
    this.cargando = false;
  }

  /** Metodo para limpiar la tabla y filas */
  limpiarResultado() {
    this.filasService.actualizarFilas("0", "0");
    this.parametrosListado = {};
    this.parametrosListado.listar = false;
    this.vistaFormulario = false;
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.consumoService.verificarPermiso(accion, this.empresaSeleccionada, mostraMensaje);
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  listarConsumo(cantidad) {
    if (this.validarObligatorios()) {
      this.parametrosListado = {};
      this.parametrosListado.empresa = LS.KEY_EMPRESA_SELECT;
      this.parametrosListado.listar = true;
      this.parametrosListado.periodo = this.periodoSeleccionado ? this.periodoSeleccionado.sisPeriodoPK.perCodigo : "";
      this.parametrosListado.motivo = this.motivoSeleccionado ? this.motivoSeleccionado.cmCodigo : "";
      this.parametrosListado.busqueda = this.busqueda;
      this.parametrosListado.nRegistros = cantidad;
      this.vistaFormulario = false;
    }
  }

  validarObligatorios() {
    if (!this.periodoSeleccionado && !this.motivoSeleccionado && !this.busqueda) {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
      return false;
    }
    return true;
  }

  nuevoConsumo() {
    if (this.consumoService.verificarPermiso(LS.ACCION_CREAR, this.empresaSeleccionada, true)) {
      this.vistaFormulario = true;
      this.parametrosFormulario = {
        accion: LS.ACCION_CREAR,
        motivoSeleccionado: this.motivoSeleccionado
      }
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
        this.nuevoConsumo();
        break;
      case LS.ACCION_LISTAR:
        this.listarConsumo(20);
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
      case LS.ACCION_ANULAR:
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_RESTAURAR:
        this.irAlHijo(event);
        break;
    }
  }

  actualizarTabla(event) {
    this.vistaFormulario = false;
    this.empresaSeleccionada = event.empresa;
    let parametro = { ...this.parametrosListado };
    parametro.consResultante = event.consResultante;
    parametro.listar = false;
    this.parametrosListado = parametro;
    this.activar = false;
  }

  irAlHijo(event) {
    this.parametrosFormulario.accion = event.accion;
    this.parametrosFormulario.seleccionado = event.objetoSeleccionado;
    this.vistaFormulario = true;
    this.activar = true;
  }
  
}
