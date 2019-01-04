import { Component, OnInit } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RhComboFormaPagoBeneficioSocialTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoBeneficioSocialTO';
import { RhUtilidadMotivo } from '../../../../entidades/rrhh/RhUtilidadMotivo';
import { RhUtilidadesPeriodoTO } from '../../../../entidadesTO/rrhh/RhUtilidadesPeriodoTO';
import { FormaPagoBeneficiosService } from '../../archivo/forma-pago-beneficios/forma-pago-beneficios.service';
import { MotivoUtilidadService } from '../../archivo/motivo-utilidad/motivo-utilidad.service';
import { PeriodoUtilidadService } from '../../archivo/periodo-utilidad/periodo-utilidad.service';
import { ParticipacionUtilidadesService } from './participacion-utilidades.service';

@Component({
  selector: 'app-participacion-utilidades',
  templateUrl: './participacion-utilidades.component.html'
})
export class ParticipacionUtilidadesComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public sectores: Array<PrdListaSectorTO> = new Array();
  public periodos: Array<RhUtilidadesPeriodoTO> = new Array();
  public motivos: Array<RhUtilidadMotivo> = new Array();
  public formasDePago: Array<RhComboFormaPagoBeneficioSocialTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public periodoSeleccionado: RhUtilidadesPeriodoTO = new RhUtilidadesPeriodoTO();
  public motivoSeleccionado: RhUtilidadMotivo = new RhUtilidadMotivo();
  public fpSeleccionada: RhComboFormaPagoBeneficioSocialTO;

  public parametrosFormulario: any = {};
  public constantes: any = LS;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public vistaFormulario: boolean = false;
  public cargando: boolean = false;
  public activar: boolean = false;
  public es: any = {}; //Locale Date (Obligatoria)
  public fechaActual: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private utilidadService: ParticipacionUtilidadesService,
    private sectorService: SectorService,
    private periodoService: PeriodoUtilidadService,
    private motivoService: MotivoUtilidadService,
    private formaPagoService: FormaPagoBeneficiosService,
    private toastr: ToastrService
  ) {
    moment.locale('es'); // para la fecha
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['utilidadListadoTrans'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.definirAtajosDeTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.obtenerDatosParaCrudUtilidades();
    this.limpiarResultado();
  }

  obtenerDatosParaCrudUtilidades() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.utilidadService.obtenerDatosParaCrudUtilidades(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaCrudUtilidades(data) {
    this.cargando = false;
    this.sectores = data.sectores;
    this.sectorSeleccionado = this.sectores[0];
    this.periodos = data.periodos;
    this.periodoSeleccionado = this.periodos[0];
    this.motivos = data.motivos;
    this.motivoSeleccionado = this.motivos[0];
    this.formasDePago = data.formasDePago;
  }

  listarSectores() {
    this.sectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.sectores = listaSectores;
    if (this.sectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.sectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  listarPeriodos() {
    this.periodos = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, activo: true };
    this.periodoService.listaRhUtilidadesPeriodoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListaRhUtilidadesPeriodoTO(lista) {
    this.periodos = lista;
    if (this.periodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.utiDescripcion ? this.periodos.find(item => item.utiDescripcion === this.periodoSeleccionado.utiDescripcion) : this.periodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  listarMotivos() {
    this.motivos = [];
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      estado: true
    }
    this.motivoService.listaRhUtilidadMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarRhUtilidadMotivo(lista) {
    this.motivos = lista;
    if (this.motivos.length > 0) {
      this.motivoSeleccionado = this.motivoSeleccionado && this.motivoSeleccionado.rhUtilidadMotivoPK.motDetalle ? this.motivos.find(item => item.rhUtilidadMotivoPK.motDetalle === this.motivoSeleccionado.rhUtilidadMotivoPK.motDetalle) : this.motivos[0];
    } else {
      this.motivoSeleccionado = null;
    }
    this.cargando = false;
  }

  listarFormasDePago() {
    this.formasDePago = [];
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    };
    this.formaPagoService.listarComboFormaPagoBeneficioSocial(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarComboFormaPagoBeneficioSocial(lista) {
    this.formasDePago = lista;
    if (this.formasDePago.length > 0) {
      this.fpSeleccionada = this.fpSeleccionada && this.fpSeleccionada.fpDetalle ? this.formasDePago.find(item => item.fpDetalle === this.fpSeleccionada.fpDetalle) : null;
    } else {
      this.fpSeleccionada = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.filasService.actualizarFilas("0", "0");
    this.vistaFormulario = false;
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element = document.getElementById("buscar");
      element ? element.click() : null;
      return false;
    }))
  }

  buscar(form: NgForm) {
    if (this.validarAntesDeEnviar(form)) {
      this.parametrosFormulario = {};
      this.parametrosFormulario.listar = true;
      this.parametrosFormulario.empresa = LS.KEY_EMPRESA_SELECT;
      this.parametrosFormulario.sector = this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null;
      this.parametrosFormulario.desde = this.periodoSeleccionado ? this.periodoSeleccionado.utiDesde : null;
      this.parametrosFormulario.hasta = this.periodoSeleccionado ? this.periodoSeleccionado.utiHasta : null;
      this.parametrosFormulario.totalDias = this.periodoSeleccionado ? this.periodoSeleccionado.utiTotalDias : null;
      this.parametrosFormulario.totalCargas = this.periodoSeleccionado ? this.periodoSeleccionado.utiTotalCargas : null;
      this.parametrosFormulario.totalPagar = this.periodoSeleccionado ? this.periodoSeleccionado.utiTotalPagar : null;
      this.parametrosFormulario.fechaMaximaPago = this.periodoSeleccionado ? this.utilService.convertirFechaStringDDMMYYYY(this.periodoSeleccionado.utiFechaMaximaPago) : null;
      this.parametrosFormulario.fpSeleccionada = this.fpSeleccionada;
      this.vistaFormulario = true;
    }
  }

  validarAntesDeEnviar(form: NgForm) {
    let validado = true;
    let formTouched = this.utilService.establecerFormularioTocado(form);
    if (!(formTouched && form && form.valid)) {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    if (!this.formasDePago || this.formasDePago.length == 0) {
      this.toastr.warning(LS.MSJ_NO_EXISTEN_FORMAS_PAGO, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    return validado;
  }

  ejecutarAccion(event) {
    this.definirAtajosDeTeclado();
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.activar = false;
        this.vistaFormulario = false;
        break;
    }
  }

}
