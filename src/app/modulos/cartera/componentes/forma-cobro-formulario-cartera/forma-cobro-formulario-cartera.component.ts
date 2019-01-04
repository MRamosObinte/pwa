import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CarPagosCobrosFormaTO } from '../../../../entidadesTO/cartera/CarPagosCobrosFormaTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { NgForm } from '@angular/forms';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FormaCobroService } from '../../archivo/forma-cobro/forma-cobro.service';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';

@Component({
  selector: 'app-forma-cobro-formulario-cartera',
  templateUrl: './forma-cobro-formulario-cartera.component.html',
  styleUrls: ['./forma-cobro-formulario-cartera.component.css']
})
export class FormaCobroFormularioCarteraComponent implements OnInit {
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarAccion = new EventEmitter();
  @Input() parametros;
  //
  public accion: string = null;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activarFormulario: boolean = false;
  public tituloForm: string = "";
  public constantes: any = LS;
  // Cuenta
  public codigoCuenta: String = null;
  public tamanioEstructura: number = 0;
  //Sector
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  //
  public formaCobro: CarPagosCobrosFormaTO = new CarPagosCobrosFormaTO();
  //
  public listaResultado: Array<CarPagosCobrosFormaTO> = [];

  @ViewChild("frmFormaCobroDatos") frmFormaCobroDatos: NgForm;
  public valoresIniciales: any;

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private modalService: NgbModal,
    private sectorService: SectorService,
    private formaCobroService: FormaCobroService
  ) {
   
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.tamanioEstructura = this.parametros.tamanioEstructura;
    this.listaSectores = this.parametros.listaSectores;
    this.listaResultado = this.parametros.listaResultado;
    this.activarFormulario = this.parametros.activar;
    this.operaciones();
    this.extraerValoresIniciales();
    this.generarAtajos();
  }


  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarFormulario') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarFormaCobro') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmFormaCobroDatos ? this.frmFormaCobroDatos.value : null));
    }, 60);
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.tituloForm = LS.TITULO_FORM_NUEVO_FORMA_COBRO;
        this.obtenerDatosFormaCobroNuevo();
        break;
      case LS.ACCION_CONSULTAR:
        this.obtenerDatoFormaCobroConsulta();
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_FORMA_COBRO;
        break;
      case LS.ACCION_EDITAR:
        this.obtenerDatoFormaCobro();
        this.tituloForm = LS.TITULO_FORM_EDITAR_FORMA_COBRO;
        break;
    }
  }

  obtenerDatosFormaCobroNuevo() {
    this.cargando = true;
    this.formaCobro = new CarPagosCobrosFormaTO();
    this.sectorSeleccionado = this.listaSectores[0];
    this.tamanioEstructura = this.parametros.tamanioEstructura;
    this.cargando = false;
  }

  obtenerDatoFormaCobroConsulta() {
    this.cargando = true;
    this.formaCobro = { ...this.parametros.formaCobro };
    this.codigoCuenta = this.formaCobro.ctaCodigo;
    this.llenarCombo();
    this.cargando = false;
  }

  obtenerDatoFormaCobro() {
    this.cargando = true;
    this.formaCobro = { ...this.parametros.formaCobro };
    this.codigoCuenta = this.formaCobro.ctaCodigo;
    this.llenarCombo();
    this.cargando = false;
  }

  llenarCombo() {
    this.sectorSeleccionado = this.formaCobroService.seleccionarSector(this.listaSectores, this.formaCobro.secCodigo);
  }

  insertarFormaCobro(form: NgForm) {
    if (this.formaCobroService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let formaCobroCopia = JSON.parse(JSON.stringify(this.formaCobro));
        this.setearValoresInvComprasFormaCobro(formaCobroCopia);
        let parametro = { accion: 'I', carPagosCobrosFormaTO: formaCobroCopia };
        this.formaCobroService.accionCarCobrosForma(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  modificarFormaCobro(form: NgForm) {
    if (this.formaCobroService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let formaCobroCopia = JSON.parse(JSON.stringify(this.formaCobro));
        this.setearValoresInvComprasFormaCobro(formaCobroCopia);
        let parametro = { accion: 'M', carPagosCobrosFormaTO: formaCobroCopia };
        this.formaCobroService.accionCarCobrosForma(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeAccionCarCobroForma(respuesta) {
    this.cargando = false;
    if (respuesta) {
      if (this.accion === LS.ACCION_CREAR) {
        respuesta.formaCobro.fpSecuencial = respuesta.extraInfo.fpSecuencial;
        this.enviarAccion.emit({ accion: LS.ACCION_CREADO, formaCobro: respuesta.formaCobro, tipo: 'I' });
      } else {
        this.enviarAccion.emit({ accion: LS.ACCION_CREADO, formaCobro: respuesta.formaCobro, tipo: 'M' });
      }
    }
  }

  setearValoresInvComprasFormaCobro(formaCobro) {
    formaCobro.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
    formaCobro.usrCodigo = this.auth.getCodigoUser();
    formaCobro.secCodigo = this.sectorSeleccionado.secCodigo;
  }

  /** Metodo para listar los sectores dependiendo de la empresa*/
  listarSectores() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarSectores()*/
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listarSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  //BUSQUEDAS
  /** Metodo que muestra un modal de todas las cuentas que coincidan con lo que se ingreso en el input de cuenta */
  buscarConCuentas(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      let fueBuscado = (this.formaCobro.ctaCodigo === this.codigoCuenta && this.formaCobro.ctaCodigo && this.codigoCuenta);
      if (!fueBuscado) {
        this.formaCobro.ctaCodigo = this.formaCobro.ctaCodigo === '' ? null : this.formaCobro.ctaCodigo;
        this.formaCobro.ctaCodigo = this.formaCobro.ctaCodigo ? this.formaCobro.ctaCodigo.toUpperCase() : null;
        if (this.formaCobro.ctaCodigo) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.formaCobro.ctaCodigo, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', backdrop: 'static' });
          modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
          modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
          modalRef.result.then((result) => {
            this.codigoCuenta = result ? result.cuentaCodigo : null;
            this.formaCobro.ctaCodigo = result ? result.cuentaCodigo : null;
            this.formaCobro.fpDetalle = result ? (result.cuentaDetalle.trim()).toUpperCase() : null;
            this.focusSector();
          }, (reason) => {//Cuando se cierra sin un dato
            this.focusCuenta();
          });
        }
      }
    }
  }

  focusCuenta() {
    let element: HTMLElement = document.getElementById('cuenta') as HTMLElement;
    element ? element.focus() : null;
  }

  focusSector() {
    let element: HTMLElement = document.getElementById('sector') as HTMLElement;
    element ? element.focus() : null;
  }

  //VALIDACIONES
  /** Metodo para validar si el input la cuenta es correcto y no se envie otro codigo*/
  validarCuenta() {
    if (this.codigoCuenta !== this.formaCobro.ctaCodigo) {
      this.codigoCuenta = null;
      this.formaCobro.ctaCodigo = null;
    }
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmFormaCobroDatos)) {
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    } else {
      switch (this.accion) {
        case LS.ACCION_EDITAR:
        case LS.ACCION_CREAR:
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI,
            cancelButtonText: LS.MSJ_NO
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
            }
          });
          break;
        default:
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
      }
    }
  }

  cambiarActivar() {
    this.activarFormulario = !this.activarFormulario;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: this.activarFormulario });
  }
}
