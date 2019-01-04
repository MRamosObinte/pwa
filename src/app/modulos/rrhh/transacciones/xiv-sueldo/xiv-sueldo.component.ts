import { Hotkey } from 'angular2-hotkeys/src/hotkey.model';
import { NgForm } from '@angular/forms';
import { PeriodoXivSueldoService } from './../../archivo/periodo-xiv-sueldo/periodo-xiv-sueldo.service';
import { MotivoXivSueldoService } from './../../archivo/motivo-xiv-sueldo/motivo-xiv-sueldo.service';
import { FormaPagoBeneficiosService } from './../../archivo/forma-pago-beneficios/forma-pago-beneficios.service';
import { ToastrService } from 'ngx-toastr';
import { SectorService } from './../../../produccion/archivos/sector/sector.service';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { FilasResolve } from './../../../../serviciosgenerales/filas.resolve';
import { HotkeysService } from 'angular2-hotkeys';
import { ActivatedRoute } from '@angular/router';
import { RhXivSueldoMotivo } from './../../../../entidades/rrhh/RhXivSueldoMotivo';
import { RhXivSueldoPeriodoTO } from './../../../../entidadesTO/rrhh/RhXivSueldoPeriodoTO';
import { LS } from './../../../../constantes/app-constants';
import { FilasTiempo } from './../../../../enums/FilasTiempo';
import { Component, OnInit } from '@angular/core';
import { RhxivSueldoxivSueldoCalcular } from '../../../../entidadesTO/rrhh/RhXivSueldoXivSueldoCalcular';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhComboFormaPagoBeneficioSocialTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoBeneficioSocialTO';

@Component({
  selector: 'app-xiv-sueldo',
  templateUrl: './xiv-sueldo.component.html',
  styleUrls: ['./xiv-sueldo.component.css']
})
export class XivSueldoComponent implements OnInit {
  public parametrosFormulario;
  public parametrosBusqueda;

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaResultado: Array<RhxivSueldoxivSueldoCalcular> = [];
  public listaFormasPagoBeneficio: Array<RhComboFormaPagoBeneficioSocialTO> = [];
  public listaMotivos: Array<RhXivSueldoMotivo> = [];
  public listaPeriodos: Array<RhXivSueldoPeriodoTO> = [];

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public objetoSeleccionado: RhxivSueldoxivSueldoCalcular = new RhxivSueldoxivSueldoCalcular();
  public formaPagoSeleccionado: RhComboFormaPagoBeneficioSocialTO = new RhComboFormaPagoBeneficioSocialTO();
  public motivoxivSueldoSeleccionado: RhXivSueldoMotivo = new RhXivSueldoMotivo();
  public periodoSeleccionado: RhXivSueldoPeriodoTO = new RhXivSueldoPeriodoTO();

  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private sectorService: SectorService,
    private toastr: ToastrService,
    public formaPagoBeneficiosService: FormaPagoBeneficiosService,
    private motivoxivSueldoService: MotivoXivSueldoService,
    private periodoxivService: PeriodoXivSueldoService
  ) {
    this.constantes = LS;
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data["xivSueldoListadoTrans"];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.listarPeriodos();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarxivSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarxivSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.formaPagoSeleccionado = null;
    this.motivoxivSueldoSeleccionado = null;
    this.limpiarResultado();
    this.listarSectores();
    this.listarFormaPago();
    this.listarPeriodos();
    this.listarxivSueldoMotivo();
  }

  limpiarResultado() {
    this.activar = false;
    this.parametrosFormulario = null;
    this.parametrosBusqueda = null;
    this.filasService.actualizarFilas(0, 0);
  }

  //Listar sectores
  listarSectores() {
    this.limpiarResultado();
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  //Listar forma pago
  listarFormaPago() {
    this.limpiarResultado();
    this.listaFormasPagoBeneficio = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, estado: true };
    this.formaPagoBeneficiosService.listarComboFormaPagoBeneficioSocial(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarComboFormaPagoBeneficioSocial(data) {
    this.listaFormasPagoBeneficio = data;
    if (this.listaFormasPagoBeneficio.length > 0) {
      this.formaPagoSeleccionado = this.formaPagoSeleccionado && this.formaPagoSeleccionado.fpCodigoMinisterial ? this.listaFormasPagoBeneficio.find(item => item.fpCodigoMinisterial === this.formaPagoSeleccionado.fpCodigoMinisterial) : this.listaFormasPagoBeneficio[0];
    } else {
      this.formaPagoSeleccionado = null;
    }
    this.cargando = false;
  }

  //Listar periodos
  listarPeriodos() {
    this.limpiarResultado();
    this.listaPeriodos = [];
    this.cargando = true;
    this.periodoxivService.listaRhXivSueldoPeriodoTO({}, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarRhXivSueldoPeriodoTO(data) {
    this.listaPeriodos = data;
    if (this.listaPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.periodoSecuencial ? this.listaPeriodos.find(item => item.periodoSecuencial === this.periodoSeleccionado.periodoSecuencial) : this.listaPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  //Listar motivos
  listarxivSueldoMotivo() {
    this.limpiarResultado();
    this.listaMotivos = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: false };
    this.motivoxivSueldoService.listaRhXivSueldoMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarRhXivSueldoMotivo(data) {
    this.listaMotivos = data;
    if (this.listaMotivos.length > 0) {
      this.motivoxivSueldoSeleccionado = this.motivoxivSueldoSeleccionado && this.motivoxivSueldoSeleccionado.rhXivSueldoMotivoPK.motDetalle ? this.listaMotivos.find(item => item.rhXivSueldoMotivoPK.motDetalle === this.motivoxivSueldoSeleccionado.rhXivSueldoMotivoPK.motDetalle) : this.listaMotivos[0];
    } else {
      this.motivoxivSueldoSeleccionado = null;
    }
    this.cargando = false;
  }

  //Operaciones
  buscarxivSueldo(form: NgForm) {
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      if (this.listaFormasPagoBeneficio.length > 0) {
        this.cargando = true;
        /**Para realizar la busqueda */
        this.parametrosBusqueda = {
          empresa: this.empresaSeleccionada.empCodigo,
          sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
          desde: this.periodoSeleccionado.xivDesde,
          hasta: this.periodoSeleccionado.xivHasta,
          formaPagoSeleccionado: this.formaPagoSeleccionado ? true : false
        }
        /**Para ser usado en el formulario */
        this.parametrosFormulario = {
          empresaSeleccionada: this.empresaSeleccionada,
          listaFormasPagoBeneficio: this.listaFormasPagoBeneficio,
          formaPagoSeleccionado: this.formaPagoSeleccionado,
          activarXivSueldo: this.activar,
          periodoSeleccionado: this.periodoSeleccionado
        }
      } else {
        this.toastr.warning(LS.MSJ_POR_LO_MENOS_1_FORMA_PAGO, LS.TAG_AVISO);
        this.cargando = false;
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  accionesXivSueldo(event) {
    this.generarAtajosTeclado();
    let objeto = event;
    switch (objeto.accion) {
      case LS.ACCION_ACTIVAR: {
        this.activar = objeto.estado;
        break;
      }
      case LS.ACCION_CARGANDO: {
        this.cargando = objeto.estado;
        break;
      }
      case LS.ACCION_LIMPIAR_RESULTADO: {
        this.limpiarResultado();
        break;
      }
    }
  }
}
