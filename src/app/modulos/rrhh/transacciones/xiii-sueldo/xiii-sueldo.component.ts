import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { RhXiiiSueldoXiiiSueldoCalcular } from '../../../../entidadesTO/rrhh/RhXiiiSueldoXiiiSueldoCalcular';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormaPagoBeneficiosService } from '../../archivo/forma-pago-beneficios/forma-pago-beneficios.service';
import { RhXiiiSueldoMotivo } from '../../../../entidades/rrhh/RhXiiiSueldoMotivo';
import { MotivoXiiiSueldoService } from '../../archivo/motivo-xiii-sueldo/motivo-xiii-sueldo.service';
import { RhXiiiSueldoPeriodoTO } from '../../../../entidadesTO/rrhh/RhXiiiSueldoPeriodoTO';
import { PeriodoXiiiSueldoService } from '../../archivo/periodo-xiii-sueldo/periodo-xiii-sueldo.service';
import { RhComboFormaPagoBeneficioSocialTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoBeneficioSocialTO';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';

@Component({
  selector: 'app-xiii-sueldo',
  templateUrl: './xiii-sueldo.component.html',
  styleUrls: ['./xiii-sueldo.component.css']
})
export class XiiiSueldoComponent implements OnInit {
  public parametrosFormulario;
  public parametrosBusqueda;

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];

  public listaFormasPagoBeneficio: Array<RhComboFormaPagoBeneficioSocialTO> = [];
  public listaMotivos: Array<RhXiiiSueldoMotivo> = [];
  public listaPeriodos: Array<RhXiiiSueldoPeriodoTO> = [];

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public objetoSeleccionado: RhXiiiSueldoXiiiSueldoCalcular = new RhXiiiSueldoXiiiSueldoCalcular();
  public formaPagoSeleccionado: RhComboFormaPagoBeneficioSocialTO = new RhComboFormaPagoBeneficioSocialTO();
  public motivoXiiiSueldoSeleccionado: RhXiiiSueldoMotivo = new RhXiiiSueldoMotivo();
  public periodoSeleccionado: RhXiiiSueldoPeriodoTO = new RhXiiiSueldoPeriodoTO();

  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private sectorService: SectorService,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    public formaPagoBeneficiosService: FormaPagoBeneficiosService,
    private motivoXiiiSueldoService: MotivoXiiiSueldoService,
    private periodoXiiiService: PeriodoXiiiSueldoService) {
    this.constantes = LS;
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data["xiiiSueldoListadoTrans"];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.listarPeriodos();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarXiiiSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarXiiiSueldo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.formaPagoSeleccionado = null;
    this.motivoXiiiSueldoSeleccionado = null;
    this.limpiarResultado();
    this.listarSectores();
    this.listarFormaPago();
    this.listarXiiiSueldoMotivo();
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
    this.periodoXiiiService.listaRhXiiiSueldoPeriodoTO({}, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarRhXiiiSueldoPeriodoTO(data) {
    this.listaPeriodos = data;
    if (this.listaPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.periodoSecuencial ? this.listaPeriodos.find(item => item.periodoSecuencial === this.periodoSeleccionado.periodoSecuencial) : this.listaPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  //Listar motivos
  listarXiiiSueldoMotivo() {
    this.limpiarResultado();
    this.listaMotivos = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: false };
    this.motivoXiiiSueldoService.listarMotivoXiiiSueldo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarMotivoXiiiSueldo(data) {
    this.listaMotivos = data;
    if (this.listaMotivos.length > 0) {
      this.motivoXiiiSueldoSeleccionado = this.motivoXiiiSueldoSeleccionado && this.motivoXiiiSueldoSeleccionado.rhXiiiSueldoMotivoPK.motDetalle ? this.listaMotivos.find(item => item.rhXiiiSueldoMotivoPK.motDetalle === this.motivoXiiiSueldoSeleccionado.rhXiiiSueldoMotivoPK.motDetalle) : this.listaMotivos[0];
    } else {
      this.motivoXiiiSueldoSeleccionado = null;
    }
    this.cargando = false;
  }

  //Operaciones
  buscarXiiiSueldo(form: NgForm) {
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      if (this.listaFormasPagoBeneficio.length > 0) {
        this.cargando = true;
        /**Para realizar la busqueda */
        this.parametrosBusqueda = {
          empresa: this.empresaSeleccionada.empCodigo,
          sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
          desde: this.periodoSeleccionado.xiiiDesde,
          hasta: this.periodoSeleccionado.xiiiHasta,
          formaPagoSeleccionado: this.formaPagoSeleccionado ? true : false
        }
        /**Para ser usado en el formulario */
        this.parametrosFormulario = {
          empresaSeleccionada: this.empresaSeleccionada,
          listaFormasPagoBeneficio: this.listaFormasPagoBeneficio,
          formaPagoSeleccionado: this.formaPagoSeleccionado,
          activarXiiiSueldo: this.activar,
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

  accionesXiiiSueldo(event) {
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
