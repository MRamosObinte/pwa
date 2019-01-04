import { Component, OnInit, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ConContableTO } from '../../../../entidadesTO/contabilidad/ConContableTO';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { TipoContableService } from '../../archivo/tipo-contable/tipo-contable.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListadoPlanCuentasComponent } from '../../componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { EmpresaService } from '../../../sistema/archivo/empresa/empresa.service';
import { NgForm } from '@angular/forms';
import { ContabilizarCierreCuentasService } from './contabilizar-cierre-cuentas.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';

@Component({
  selector: 'app-contabilizar-cierre-cuentas',
  templateUrl: './contabilizar-cierre-cuentas.component.html',
  styleUrls: ['./contabilizar-cierre-cuentas.component.css']
})
export class ContabilizarCierreCuentasComponent implements OnInit {

  /* Generales */
  public constantes: any;
  public cargando: boolean = false;
  public activar: boolean = false;
  public accion: string = null;//Bandera
  public isScreamMd: boolean = true;
  public frmTitulo: string;
  public classTitulo: string;
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public fechaSeleccionada: Date;
  public fechaActual: Date;
  public columnaEstadoFinanciero: number = -1;//-1 indica que no tiene un valor valido
  public es: any;
  public vistaFormulario: boolean = false;//Es true siempre que es listado tambien sea true
  public vistaListado: boolean = false;
  public parametroBusquedaListado: any = {};
  public dataListado: any = {};
  public tamanioEstructura: number = 0;
  //Formulario
  public conContableTO: ConContableTO = new ConContableTO();
  public listaTipoContable: Array<ConTipoTO> = new Array();
  public tipoContableSeleccionado: ConTipoTO = new ConTipoTO();
  public cuentaCodigo: string = null;//Debe ser null al inicio y cuando no sea valido
  public cuentaDetalle: string = "";
  //
  @ViewChild("frmContable") frmContable: NgForm;
  public valoresIniciales: any;
  public listaFiltradoInicial: any;
  public listaFiltrado: Array<ConTipoTO> = [];

  constructor(
    private sectorService: SectorService,
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private empresaService: EmpresaService,
    private tipoContableService: TipoContableService,
    private modalService: NgbModal,
    private cierreService: ContabilizarCierreCuentasService,
    private planContableService: PlanContableService,
  ) {
    this.constantes = LS; //Hace referncia a los constantes
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['contabilizarCierreCuentasResultado'];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.cambiarEmpresaSelect();
    }
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.inicializarAtajos();
    this.obtenerFechaInicioFinMes();
    this.obtenerTamanioEstructura();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmContable ? this.frmContable.value : null));
      this.listaFiltradoInicial = JSON.parse(JSON.stringify(this.listaFiltrado ? this.listaFiltrado : null));
    }, 50);
  }

  inicializarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      if (this.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
        element ? element.click() : null;
        return false;
      }
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      if (this.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
        element ? element.click() : null;
        return false;
      }
    }));
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarLista();
    this.activar = false;
    this.accion = null;
    this.listarSectores();
    this.obtenerColumnaEstadoFinanciero();
    this.obtenerListaTiposContable();
    this.obtenerTamanioEstructura();
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaSeleccionada = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarLista() {
    this.vistaListado = false;
    this.filasService.actualizarFilas(0);
  }

  listarSectores() {
    this.cargando = true;
    this.listaSectores = [];
    this.sectorSeleccionado = null;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.listaSectores = data;
    if (this.listaSectores.length > 0)
      this.sectorSeleccionado = this.listaSectores[0];
    this.cargando = false;
  }

  obtenerColumnaEstadoFinanciero() {
    this.columnaEstadoFinanciero = -1;
    let parametro = { empCodigo: LS.KEY_EMPRESA_SELECT };
    this.empresaService.getColumnasEstadosFinancieros(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetColumnasEstadosFinancieros(data) {
    data ? this.columnaEstadoFinanciero = data : -1;
  }

  buscarContabilizarCierreCuentas() {
    if (this.columnaEstadoFinanciero > -1) {
      this.parametroBusquedaListado = {
        empresa: LS.KEY_EMPRESA_SELECT,
        sector: this.sectorSeleccionado.secCodigo,
        fechaDesde: null,
        fechaHasta: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaSeleccionada),
        columnasEstadosFinancieros: this.columnaEstadoFinanciero,
        ocultarDetalle: false
      };
      this.dataListado = { empresaSeleccionada: this.empresaSeleccionada, ocultarEncabezado: true };
      this.vistaListado = true;
    } else {
      this.toastr.warning(LS.MSJ_EMPRESA_NO_COL_ESTADO_FIN, LS.TAG_AVISO);
    }
  }

  modificarActivar(event) {
    if (!this.vistaFormulario) {
      this.conContableTO = new ConContableTO();
      this.tipoContableSeleccionado = this.listaTipoContable.length > 0 ? this.listaTipoContable[0] : new ConTipoTO();
      this.accion = LS.ACCION_CREAR;
      this.vistaFormulario = true;
      this.extraerValoresIniciales();
    }
  }

  //Formulario
  obtenerListaTiposContable() {
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.tipoContableService.listarTipoContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarTipoContable(listaTipos) {
    this.listaTipoContable = listaTipos;
    if (this.listaTipoContable.length > 0) {
      this.tipoContableSeleccionado = this.listaTipoContable[0]
    }
  }

  obtenerTamanioEstructura() {
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.planContableService.getTamanioListaConEstructura(parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => { this.utilService.handleError(err, this); });
  }

  buscarCuentaContable(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && !this.esCuentaCodigoValido()) {
      if (this.conContableTO.conNumero && this.conContableTO.conNumero.length > 0) {
        let parametroBusquedaConCuentas = { empresa: LS.KEY_EMPRESA_SELECT, buscar: this.conContableTO.conNumero, cuentaActivo: true, ctaGrupo: null };
        event.srcElement.blur();
        event.preventDefault();
        const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
        modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
        modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
        modalRef.result.then((result) => {
          this.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.conContableTO.conNumero = result ? result.cuentaCodigo : "";
          this.cuentaDetalle = result ? result.cuentaDetalle.trim() : "";
        }, (reason) => {
          //Al minimizar, es necesario  
        });
      } else {
        this.toastr.info(LS.MSJ_ENTER_NO_DATA, LS.TOAST_INFORMACION)
      }
    }
  }

  esCuentaCodigoValido(): boolean {
    return this.cuentaCodigo && this.cuentaCodigo === this.conContableTO.conNumero;
  }

  validarCuentaCodigo() {
    if (this.cuentaCodigo !== this.conContableTO.conNumero) {
      this.cuentaCodigo = null;
      this.cuentaDetalle = "";
      this.conContableTO.conNumero = "";
    }
  }

  /**
  * Reinicia los objetos del formulario, y lo oculta
  * @memberof ContabilizarCierreCuentasComponent
  */
  resetearFormulario() {
    this.conContableTO = new ConContableTO();
    this.tipoContableSeleccionado = new ConTipoTO();
    this.vistaFormulario = false;
    this.limpiarLista();
    this.accion = null;
    this.activar = false;
    this.cuentaDetalle = "";
  }

  cancelarAccion() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmContable)) {
      this.resetearFormulario();
    } else {
      if (this.accion === LS.ACCION_CONSULTAR) {
        this.resetearFormulario();
      } else {
        let parametros = {
          title: LS.MSJ_TITULO_CANCELAR,
          texto: LS.MSJ_PREGUNTA_CANCELAR,
          type: LS.SWAL_QUESTION,
          confirmButtonText: LS.MSJ_SI,
          cancelButtonText: LS.MSJ_NO
        }
        this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
          if (respuesta) {//Si presiona SI
            this.resetearFormulario();
          }
        });
      }
    }
  }

  insertarContableCierreCuentas(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(form);
      if (formTocado && form.valid) {
        //Parametro a enviar
        let parametro = {
          conContableTO: this.cierreService.formatearConContableTOCierreCuentas(this.conContableTO, this),
          centroProduccion: this.sectorSeleccionado.secCodigo,
          conNumeroContable: this.conContableTO.conNumero,
        };
        this.api.post("todocompuWS/contabilidadWebController/insertarConContableCierreCuentas", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.resetearFormulario();
              this.utilService.generarSwalHTML(LS.TOAST_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }
}
