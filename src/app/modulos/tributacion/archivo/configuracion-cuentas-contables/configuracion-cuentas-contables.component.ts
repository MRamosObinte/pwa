import { Component, OnInit, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { AnxCuentasContablesTO } from '../../../../entidadesTO/anexos/AnxCuentasContablesTO';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ConfiguracionCuentasContablesService } from './configuracion-cuentas-contables.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { NgForm } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { PlanContableService } from '../../../contabilidad/archivo/plan-contable/plan-contable.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnxCuentasContablesObjetosTO } from '../../../../entidadesTO/anexos/AnxCuentasContablesObjetosTO';

@Component({
  selector: 'app-configuracion-cuentas-contables',
  templateUrl: './configuracion-cuentas-contables.component.html',
  styleUrls: ['./configuracion-cuentas-contables.component.css']
})
export class ConfiguracionCuentasContablesComponent implements OnInit {

  public constantes: any;
  public cargando: boolean = false;
  public cuentasContables: AnxCuentasContablesTO = new AnxCuentasContablesTO();
  public cuentasContablesObjetos: AnxCuentasContablesObjetosTO = new AnxCuentasContablesObjetosTO();
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public accion: string = null;
  public activar: boolean = false;
  public classIcon: string = LS.ICON_FILTRAR;
  public screamXS: boolean = true;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public vistaFormulario = false;
  public tamanioEstructura: number = 0;
  @ViewChild("frmConfiguracionCuentasContables") frmConfiguracionCuentasContables: NgForm;
  public valoresIniciales: any;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private cuentasContablesService: ConfiguracionCuentasContablesService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private auth: AuthService,
    private modalService: NgbModal,
    private planContableService: PlanContableService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['configuracionCuentasContables'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarCuentasContables') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarConfiguracionCuentasContables') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarConfiguracionCuentasContables') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmConfiguracionCuentasContables ? this.frmConfiguracionCuentasContables.value : null));
    }, 50);
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.filasService.actualizarFilas("0", "0");
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.planContableService.getTamanioListaConEstructura(parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  limpiarResultado() {
    this.vistaFormulario = false;
    this.filasService.actualizarFilas("0", "0");
  }

  buscarAnexoCuentasContables() {
    this.cargando = true;
    this.limpiarResultado();
    this.filasTiempo.iniciarContador();
    this.vistaFormulario = true;
    this.cuentasContablesService.obtenerAnxCuentasContablesObjetosTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerAnxCuentasContablesObjetosTO(data) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.cuentasContablesObjetos = data ? data : new AnxCuentasContablesObjetosTO();
    this.inicializarCuentasContables();
  }

  actualizarAnexoConfiguracionCuentasContables(ngForm: NgForm) {
    if (!this.utilService.puedoCancelar(this.valoresIniciales, this.frmConfiguracionCuentasContables)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(ngForm);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      if (formTocado && !ngForm.invalid) {
        let parametro = {
          empresa: LS.KEY_EMPRESA_SELECT,
          anxCuentasContablesTO: this.cuentasContables,
          usuario: this.auth.getCodigoUser()
        }
        this.cuentasContablesService.actualizarAnexoCuentasContables(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.TOAST_ADVERTENCIA);
      }
    } else {
      this.cancelarCuentasContables();
      this.utilService.generarSwal(LS.TAG_CONFIGURACION_CUENTAS_CONTABLES, LS.SWAL_SUCCESS, LS.NO_REALIZO_NINGUN_CAMBIO);
    }
  }

  despuesDeActualizarAnexoListaConsolidadoRetencionesVentas() {
    this.toastr.success(LS.MSJ_SE_MODIFICO_CUENTAS_CONTABLES, LS.TOAST_CORRECTO);
    this.cargando = false;
    this.cancelarCuentasContables();
  }

  cancelarAccion() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmConfiguracionCuentasContables)) {
      this.cancelarCuentasContables();
    } else {
      let parametros = {
        title: LS.MSJ_TITULO_CANCELAR,
        texto: LS.MSJ_PREGUNTA_CANCELAR,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_ACEPTAR,
        cancelButtonText: LS.MSJ_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cancelarCuentasContables();
        }
      });
    }
  }

  cancelarCuentasContables() {
    this.limpiarResultado();
    this.cuentasContables = new AnxCuentasContablesTO();
    this.vistaFormulario = false;
    this.accion = null;
    this.activar = false;
  }

  inicializarCuentasContables() {
    this.cuentasContables = new AnxCuentasContablesTO();
    this.cuentasContables.ctaEmpresa = this.empresaSeleccionada.empCodigo;
    this.cuentasContables.ctaIvaPagado = this.cuentasContablesObjetos.ctaIvaPagado.cuentaCodigo;
    this.cuentasContables.ctaIvaCobrado = this.cuentasContablesObjetos.ctaIvaCobrado.cuentaCodigo;
    this.cuentasContables.ctaRetFteIvaPagado = this.cuentasContablesObjetos.ctaRetFteIvaPagado.cuentaCodigo;
    this.cuentasContables.ctaRetFteIvaCobrado = this.cuentasContablesObjetos.ctaRetFteIvaCobrado.cuentaCodigo;
    this.cuentasContables.ctaRetFteIvaAsumido = this.cuentasContablesObjetos.ctaRetFteIvaAsumido.cuentaCodigo;
    this.cuentasContables.ctaRetFteIrPagado = this.cuentasContablesObjetos.ctaRetFteIrPagado.cuentaCodigo;
    this.cuentasContables.ctaRetFteIrCobrado = this.cuentasContablesObjetos.ctaRetFteIrCobrado.cuentaCodigo;
    this.cuentasContables.ctaRetFteIrAsumido = this.cuentasContablesObjetos.ctaRetFteIrAsumido.cuentaCodigo;
    this.cuentasContables.ctaOtrosImpuestos = this.cuentasContablesObjetos.ctaOtrosImpuestos.cuentaCodigo;
    this.cuentasContables.ctaCuentasPorCobrar = this.cuentasContablesObjetos.ctaCuentasPorCobrar.cuentaCodigo;
    this.cuentasContables.ctaCuentasPorPagar = this.cuentasContablesObjetos.ctaCuentasPorPagar.cuentaCodigo;
    this.cuentasContables.ctaCuentasPorPagarActivoFijo = this.cuentasContablesObjetos.ctaCuentasPorPagarActivoFijo.cuentaCodigo;
    this.cuentasContables.ctaAnticiposDeClientes = this.cuentasContablesObjetos.ctaAnticiposDeClientes.cuentaCodigo;
    this.cuentasContables.ctaAnticiposAProveedores = this.cuentasContablesObjetos.ctaAnticiposAProveedores.cuentaCodigo;
    this.cuentasContables.ctaInventarioProductosProceso = this.cuentasContablesObjetos.ctaInventarioProductosProceso.cuentaCodigo;
    this.cuentasContables.ctaCostoProductosProceso = this.cuentasContablesObjetos.ctaCostoProductosProceso.cuentaCodigo;
    this.extraerValoresIniciales();
  }

  //Buscar cuentas
  buscarConCuentas(event, tipo) {
    let fueBuscado = true;
    let cuentaCodigo = null;
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      switch (tipo) {
        case 'ctaIvaPagado': {
          fueBuscado = (this.cuentasContablesObjetos.ctaIvaPagado.cuentaCodigo === this.cuentasContables.ctaIvaPagado && this.cuentasContablesObjetos.ctaIvaPagado.cuentaCodigo !== null && this.cuentasContables.ctaIvaPagado !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaIvaPagado.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaIvaPagado.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaIvaPagado.cuentaCodigo ? this.cuentasContablesObjetos.ctaIvaPagado.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaIvaCobrado': {
          fueBuscado = (this.cuentasContablesObjetos.ctaIvaCobrado.cuentaCodigo === this.cuentasContables.ctaIvaCobrado && this.cuentasContablesObjetos.ctaIvaCobrado.cuentaCodigo !== null && this.cuentasContables.ctaIvaCobrado !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaIvaCobrado.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaIvaCobrado.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaIvaCobrado.cuentaCodigo ? this.cuentasContablesObjetos.ctaIvaCobrado.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaRetFteIvaPagado': {
          fueBuscado = (this.cuentasContablesObjetos.ctaRetFteIvaPagado.cuentaCodigo === this.cuentasContables.ctaRetFteIvaPagado && this.cuentasContablesObjetos.ctaRetFteIvaPagado.cuentaCodigo !== null && this.cuentasContables.ctaRetFteIvaPagado !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIvaPagado.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaRetFteIvaPagado.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIvaPagado.cuentaCodigo ? this.cuentasContablesObjetos.ctaRetFteIvaPagado.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaRetFteIvaCobrado': {
          fueBuscado = (this.cuentasContablesObjetos.ctaRetFteIvaCobrado.cuentaCodigo === this.cuentasContables.ctaRetFteIvaCobrado && this.cuentasContablesObjetos.ctaRetFteIvaCobrado.cuentaCodigo !== null && this.cuentasContables.ctaRetFteIvaCobrado !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIvaCobrado.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaRetFteIvaCobrado.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIvaCobrado.cuentaCodigo ? this.cuentasContablesObjetos.ctaRetFteIvaCobrado.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaRetFteIvaAsumido': {
          fueBuscado = (this.cuentasContablesObjetos.ctaRetFteIvaAsumido.cuentaCodigo === this.cuentasContables.ctaRetFteIvaAsumido && this.cuentasContablesObjetos.ctaRetFteIvaAsumido.cuentaCodigo !== null && this.cuentasContables.ctaRetFteIvaAsumido !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIvaAsumido.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaRetFteIvaAsumido.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIvaAsumido.cuentaCodigo ? this.cuentasContablesObjetos.ctaRetFteIvaAsumido.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaRetFteIrPagado': {
          fueBuscado = (this.cuentasContablesObjetos.ctaRetFteIrPagado.cuentaCodigo === this.cuentasContables.ctaRetFteIrPagado && this.cuentasContablesObjetos.ctaRetFteIrPagado.cuentaCodigo !== null && this.cuentasContables.ctaRetFteIrPagado !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIrPagado.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaRetFteIrPagado.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIrPagado.cuentaCodigo ? this.cuentasContablesObjetos.ctaRetFteIrPagado.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaRetFteIrCobrado': {
          fueBuscado = (this.cuentasContablesObjetos.ctaRetFteIrCobrado.cuentaCodigo === this.cuentasContables.ctaRetFteIrCobrado && this.cuentasContablesObjetos.ctaRetFteIrCobrado.cuentaCodigo !== null && this.cuentasContables.ctaRetFteIrCobrado !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIrCobrado.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaRetFteIrCobrado.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIrCobrado.cuentaCodigo ? this.cuentasContablesObjetos.ctaRetFteIrCobrado.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaRetFteIrAsumido': {
          fueBuscado = (this.cuentasContablesObjetos.ctaRetFteIrAsumido.cuentaCodigo === this.cuentasContables.ctaRetFteIrAsumido && this.cuentasContablesObjetos.ctaRetFteIrAsumido.cuentaCodigo !== null && this.cuentasContables.ctaRetFteIrAsumido !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIrAsumido.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaRetFteIrAsumido.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaRetFteIrAsumido.cuentaCodigo ? this.cuentasContablesObjetos.ctaRetFteIrAsumido.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaOtrosImpuestos': {
          fueBuscado = (this.cuentasContablesObjetos.ctaOtrosImpuestos.cuentaCodigo === this.cuentasContables.ctaOtrosImpuestos && this.cuentasContablesObjetos.ctaOtrosImpuestos.cuentaCodigo !== null && this.cuentasContables.ctaOtrosImpuestos !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaOtrosImpuestos.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaOtrosImpuestos.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaOtrosImpuestos.cuentaCodigo ? this.cuentasContablesObjetos.ctaOtrosImpuestos.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaCuentasPorCobrar': {
          fueBuscado = (this.cuentasContablesObjetos.ctaCuentasPorCobrar.cuentaCodigo === this.cuentasContables.ctaCuentasPorCobrar && this.cuentasContablesObjetos.ctaCuentasPorCobrar.cuentaCodigo !== null && this.cuentasContables.ctaCuentasPorCobrar !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaCuentasPorCobrar.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaCuentasPorCobrar.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaCuentasPorCobrar.cuentaCodigo ? this.cuentasContablesObjetos.ctaCuentasPorCobrar.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaCuentasPorPagar': {
          fueBuscado = (this.cuentasContablesObjetos.ctaCuentasPorPagar.cuentaCodigo === this.cuentasContables.ctaCuentasPorPagar && this.cuentasContablesObjetos.ctaCuentasPorPagar.cuentaCodigo !== null && this.cuentasContables.ctaCuentasPorPagar !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaCuentasPorPagar.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaCuentasPorPagar.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaCuentasPorPagar.cuentaCodigo ? this.cuentasContablesObjetos.ctaCuentasPorPagar.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaCuentasPorPagarActivoFijo': {
          fueBuscado = (this.cuentasContablesObjetos.ctaCuentasPorPagarActivoFijo.cuentaCodigo === this.cuentasContables.ctaCuentasPorPagarActivoFijo && this.cuentasContablesObjetos.ctaCuentasPorPagarActivoFijo.cuentaCodigo !== null && this.cuentasContables.ctaCuentasPorPagarActivoFijo !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaCuentasPorPagarActivoFijo.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaCuentasPorPagarActivoFijo.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaCuentasPorPagarActivoFijo.cuentaCodigo ? this.cuentasContablesObjetos.ctaCuentasPorPagarActivoFijo.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaAnticiposDeClientes': {
          fueBuscado = (this.cuentasContablesObjetos.ctaAnticiposDeClientes.cuentaCodigo === this.cuentasContables.ctaAnticiposDeClientes && this.cuentasContablesObjetos.ctaAnticiposDeClientes.cuentaCodigo !== null && this.cuentasContables.ctaAnticiposDeClientes !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaAnticiposDeClientes.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaAnticiposDeClientes.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaAnticiposDeClientes.cuentaCodigo ? this.cuentasContablesObjetos.ctaAnticiposDeClientes.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaAnticiposAProveedores': {
          fueBuscado = (this.cuentasContablesObjetos.ctaAnticiposAProveedores.cuentaCodigo === this.cuentasContables.ctaAnticiposAProveedores && this.cuentasContablesObjetos.ctaAnticiposAProveedores.cuentaCodigo !== null && this.cuentasContables.ctaAnticiposAProveedores !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaAnticiposAProveedores.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaAnticiposAProveedores.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaAnticiposAProveedores.cuentaCodigo ? this.cuentasContablesObjetos.ctaAnticiposAProveedores.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaInventarioProductosProceso': {
          fueBuscado = (this.cuentasContablesObjetos.ctaInventarioProductosProceso.cuentaCodigo === this.cuentasContables.ctaInventarioProductosProceso && this.cuentasContablesObjetos.ctaInventarioProductosProceso.cuentaCodigo !== null && this.cuentasContables.ctaInventarioProductosProceso !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaInventarioProductosProceso.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaInventarioProductosProceso.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaInventarioProductosProceso.cuentaCodigo ? this.cuentasContablesObjetos.ctaInventarioProductosProceso.cuentaCodigo.toUpperCase() : null;
          break;
        }
        case 'ctaCostoProductosProceso': {
          fueBuscado = (this.cuentasContablesObjetos.ctaCostoProductosProceso.cuentaCodigo === this.cuentasContables.ctaCostoProductosProceso && this.cuentasContablesObjetos.ctaCostoProductosProceso.cuentaCodigo !== null && this.cuentasContables.ctaCostoProductosProceso !== null);
          cuentaCodigo = this.cuentasContablesObjetos.ctaCostoProductosProceso.cuentaCodigo === '' ? null : this.cuentasContablesObjetos.ctaCostoProductosProceso.cuentaCodigo;
          cuentaCodigo = this.cuentasContablesObjetos.ctaCostoProductosProceso.cuentaCodigo ? this.cuentasContablesObjetos.ctaCostoProductosProceso.cuentaCodigo.toUpperCase() : null;
          break;
        }
      }

      if (!fueBuscado) {
        if (cuentaCodigo) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: cuentaCodigo, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          this.abrirModalCuenta(parametroBusquedaConCuentas, tipo);
        }
      }
    }
  }

  abrirModalCuenta(parametroBusquedaConCuentas, tipo) {
    const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
    modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
    modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
    modalRef.result.then((result) => {
      switch (tipo) {
        case 'ctaIvaPagado': {
          this.cuentasContables.ctaIvaPagado = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaIvaPagado.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaIvaPagado.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaIvaCobrado').focus();
          break;
        }
        case 'ctaIvaCobrado': {
          this.cuentasContables.ctaIvaCobrado = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaIvaCobrado.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaIvaCobrado.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaRetFteIvaPagado').focus();
          break;
        }
        case 'ctaRetFteIvaPagado': {
          this.cuentasContables.ctaRetFteIvaPagado = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIvaPagado.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIvaPagado.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaRetFteIvaCobrado').focus();
          break;
        }
        case 'ctaRetFteIvaCobrado': {
          this.cuentasContables.ctaRetFteIvaCobrado = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIvaCobrado.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIvaCobrado.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaRetFteIvaAsumido').focus();
          break;
        }
        case 'ctaRetFteIvaAsumido': {
          this.cuentasContables.ctaRetFteIvaAsumido = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIvaAsumido.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIvaAsumido.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaRetFteIrPagado').focus();
          break;
        }
        case 'ctaRetFteIrPagado': {
          this.cuentasContables.ctaRetFteIrPagado = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIrPagado.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIrPagado.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaRetFteIrCobrado').focus();
          break;
        }
        case 'ctaRetFteIrCobrado': {
          this.cuentasContables.ctaRetFteIrCobrado = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIrCobrado.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIrCobrado.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaRetFteIrAsumido').focus();
          break;
        }
        case 'ctaRetFteIrAsumido': {
          this.cuentasContables.ctaRetFteIrAsumido = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIrAsumido.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaRetFteIrAsumido.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaOtrosImpuestos').focus();
          break;
        }
        case 'ctaOtrosImpuestos': {
          this.cuentasContables.ctaOtrosImpuestos = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaOtrosImpuestos.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaOtrosImpuestos.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaCuentasPorCobrar').focus();
          break;
        }
        case 'ctaCuentasPorCobrar': {
          this.cuentasContables.ctaCuentasPorCobrar = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaCuentasPorCobrar.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaCuentasPorCobrar.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaCuentasPorPagar').focus();
          break;
        }
        case 'ctaCuentasPorPagar': {
          this.cuentasContables.ctaCuentasPorPagar = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaCuentasPorPagar.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaCuentasPorPagar.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaAnticiposDeClientes').focus();
          break;
        }
        case 'ctaCuentasPorPagarActivoFijo': {
          this.cuentasContables.ctaCuentasPorPagarActivoFijo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaCuentasPorPagarActivoFijo.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaCuentasPorPagarActivoFijo.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaAnticiposDeClientes').focus();
          break;
        }
        case 'ctaAnticiposDeClientes': {
          this.cuentasContables.ctaAnticiposDeClientes = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaAnticiposDeClientes.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaAnticiposDeClientes.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaAnticiposAProveedores').focus();
          break;
        }
        case 'ctaAnticiposAProveedores': {
          this.cuentasContables.ctaAnticiposAProveedores = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaAnticiposAProveedores.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaAnticiposAProveedores.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('ctaAnticiposAProveedores').focus();
          break;
        }
        case 'ctaInventarioProductosProceso': {
          this.cuentasContables.ctaInventarioProductosProceso = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaInventarioProductosProceso.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaInventarioProductosProceso.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('cuenta').focus();
          break;
        }
        case 'ctaCostoProductosProceso': {
          this.cuentasContables.ctaCostoProductosProceso = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaCostoProductosProceso.cuentaCodigo = result ? result.cuentaCodigo : null;
          this.cuentasContablesObjetos.ctaCostoProductosProceso.cuentaDetalle = result ? result.cuentaDetalle.trim() : null;
          document.getElementById('cuenta').focus();
          break;
        }
      }
      this.filasService.actualizarFilas("0", "0");
    }, (reason) => {//Cuando se cierra sin un dato
      let element: HTMLElement = document.getElementById('cuenta') as HTMLElement;
      element ? element.focus() : null;
    });
  }

  validarCuenta(tipo) {
    switch (tipo) {
      case 'ctaIvaPagado': {
        if (this.cuentasContablesObjetos.ctaIvaPagado.cuentaCodigo !== this.cuentasContables.ctaIvaPagado) {
          this.cuentasContablesObjetos.ctaIvaPagado = new ConCuentasTO();
          this.cuentasContables.ctaIvaPagado = null;
        }
        break;
      }
      case 'ctaIvaCobrado': {
        if (this.cuentasContablesObjetos.ctaIvaCobrado.cuentaCodigo !== this.cuentasContables.ctaIvaCobrado) {
          this.cuentasContablesObjetos.ctaIvaCobrado = new ConCuentasTO();
          this.cuentasContables.ctaIvaCobrado = null;
        }
        break;
      }
      case 'ctaRetFteIvaPagado': {
        if (this.cuentasContablesObjetos.ctaRetFteIvaPagado.cuentaCodigo !== this.cuentasContables.ctaRetFteIvaPagado) {
          this.cuentasContablesObjetos.ctaRetFteIvaPagado = new ConCuentasTO();
          this.cuentasContables.ctaRetFteIvaPagado = null;
        }
        break;
      }
      case 'ctaRetFteIvaCobrado': {
        if (this.cuentasContablesObjetos.ctaRetFteIvaCobrado.cuentaCodigo !== this.cuentasContables.ctaRetFteIvaCobrado) {
          this.cuentasContablesObjetos.ctaRetFteIvaCobrado = new ConCuentasTO();
          this.cuentasContables.ctaRetFteIvaCobrado = null;
        }
        break;
      }
      case 'ctaRetFteIvaAsumido': {
        if (this.cuentasContablesObjetos.ctaRetFteIvaAsumido.cuentaCodigo !== this.cuentasContables.ctaRetFteIvaAsumido) {
          this.cuentasContablesObjetos.ctaRetFteIvaAsumido = new ConCuentasTO();
          this.cuentasContables.ctaRetFteIvaAsumido = null;
        }
        break;
      }
      case 'ctaRetFteIrPagado': {
        if (this.cuentasContablesObjetos.ctaRetFteIrPagado.cuentaCodigo !== this.cuentasContables.ctaRetFteIrPagado) {
          this.cuentasContablesObjetos.ctaRetFteIrPagado = new ConCuentasTO();
          this.cuentasContables.ctaRetFteIrPagado = null;
        }
        break;
      }
      case 'ctaRetFteIrCobrado': {
        if (this.cuentasContablesObjetos.ctaRetFteIrCobrado.cuentaCodigo !== this.cuentasContables.ctaRetFteIrCobrado) {
          this.cuentasContablesObjetos.ctaRetFteIrCobrado = new ConCuentasTO();
          this.cuentasContables.ctaRetFteIrCobrado = null;
        }
        break;
      }
      case 'ctaRetFteIrAsumido': {
        if (this.cuentasContablesObjetos.ctaRetFteIrAsumido.cuentaCodigo !== this.cuentasContables.ctaRetFteIrAsumido) {
          this.cuentasContablesObjetos.ctaRetFteIrAsumido = new ConCuentasTO();
          this.cuentasContables.ctaRetFteIrAsumido = null;
        }
        break;
      }
      case 'ctaOtrosImpuestos': {
        if (this.cuentasContablesObjetos.ctaOtrosImpuestos.cuentaCodigo !== this.cuentasContables.ctaOtrosImpuestos) {
          this.cuentasContablesObjetos.ctaOtrosImpuestos = new ConCuentasTO();
          this.cuentasContables.ctaOtrosImpuestos = null;
        }
        break;
      }
      case 'ctaCuentasPorCobrar': {
        if (this.cuentasContablesObjetos.ctaCuentasPorCobrar.cuentaCodigo !== this.cuentasContables.ctaCuentasPorCobrar) {
          this.cuentasContablesObjetos.ctaCuentasPorCobrar = new ConCuentasTO();
          this.cuentasContables.ctaCuentasPorCobrar = null;
        }
        break;
      }
      case 'ctaCuentasPorPagar': {
        if (this.cuentasContablesObjetos.ctaCuentasPorPagar.cuentaCodigo !== this.cuentasContables.ctaCuentasPorPagar) {
          this.cuentasContablesObjetos.ctaCuentasPorPagar = new ConCuentasTO();
          this.cuentasContables.ctaCuentasPorPagar = null;
        }
        break;
      }
      case 'ctaCuentasPorPagarActivoFijo': {
        if (this.cuentasContablesObjetos.ctaCuentasPorPagarActivoFijo.cuentaCodigo !== this.cuentasContables.ctaCuentasPorPagarActivoFijo) {
          this.cuentasContablesObjetos.ctaCuentasPorPagarActivoFijo = new ConCuentasTO();
          this.cuentasContables.ctaCuentasPorPagarActivoFijo = null;
        }
        break;
      }
      case 'ctaAnticiposDeClientes': {
        if (this.cuentasContablesObjetos.ctaAnticiposDeClientes.cuentaCodigo !== this.cuentasContables.ctaAnticiposDeClientes) {
          this.cuentasContablesObjetos.ctaAnticiposDeClientes = new ConCuentasTO();
          this.cuentasContables.ctaAnticiposDeClientes = null;
        }
        break;
      }
      case 'ctaAnticiposAProveedores': {
        if (this.cuentasContablesObjetos.ctaAnticiposAProveedores.cuentaCodigo !== this.cuentasContables.ctaAnticiposAProveedores) {
          this.cuentasContablesObjetos.ctaAnticiposAProveedores = new ConCuentasTO();
          this.cuentasContables.ctaAnticiposAProveedores = null;
        }
        break;
      }
      case 'ctaInventarioProductosProceso': {
        if (this.cuentasContablesObjetos.ctaInventarioProductosProceso.cuentaCodigo !== this.cuentasContables.ctaInventarioProductosProceso) {
          this.cuentasContablesObjetos.ctaInventarioProductosProceso = new ConCuentasTO();
          this.cuentasContables.ctaInventarioProductosProceso = null;
        }
        break;
      }
      case 'ctaCostoProductosProceso': {
        if (this.cuentasContablesObjetos.ctaCostoProductosProceso.cuentaCodigo !== this.cuentasContables.ctaCostoProductosProceso) {
          this.cuentasContablesObjetos.ctaCostoProductosProceso = new ConCuentasTO();
          this.cuentasContables.ctaCostoProductosProceso = null;
        }
        break;
      }
    }
  }
}
