import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { InvVentasFormaCobroTO } from '../../../../entidadesTO/inventario/InvVentasFormaCobroTO';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { FormaCobroService } from '../../archivo/forma-cobro/forma-cobro.service';
import { NgForm } from '@angular/forms';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';

@Component({
  selector: 'app-forma-cobro-formulario',
  templateUrl: './forma-cobro-formulario.component.html',
  styleUrls: ['./forma-cobro-formulario.component.css']
})
export class FormaCobroFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarCancelar = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();
  @Input() parametros;
  //
  public accion: string = null;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public tituloForm: string = "";
  public constantes: any = LS;
  //
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public listaTipos: Array<string> = LS.LISTA_TIPOS_FORMA_COBRO;
  //
  public invVentasFormaCobroTO: InvVentasFormaCobroTO = new InvVentasFormaCobroTO();
  // Cuenta
  public codigoCuenta: String = null;
  public tamanioEstructura: number = 0;
  //
  @ViewChild("frmFormaCobroDatos") frmFormaCobroDatos: NgForm;
  public valoresIniciales: any;
  public formaCobroInicial: any;
  //
  public indexTablaEditar: number = 0;
  public listaResultado: Array<InvVentasFormaCobroTO> = [];

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private modalService: NgbModal,
    private formaCobroService: FormaCobroService,
    private sectorService: SectorService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.tamanioEstructura = this.parametros.tamanioEstructura;
    this.invVentasFormaCobroTO = { ...this.parametros.invVentasFormaCobroTO };
    this.operaciones();
    this.extraerValoresIniciales();
    this.generarAtajos();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmFormaCobroDatos ? this.frmFormaCobroDatos.value : null));
      this.formaCobroInicial = JSON.parse(JSON.stringify(this.invVentasFormaCobroTO ? this.invVentasFormaCobroTO : null));
    }, 60);
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

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.tituloForm = LS.TITULO_FORM_NUEVO_FORMA_COBRO;
        this.obtenerDatosNuevaFormaCobro();
        break;
      case LS.ACCION_CONSULTAR:
        this.obtenerDatosConsultarFormaCobro();
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_FORMA_COBRO + ": Cuenta: " + this.invVentasFormaCobroTO.ctaCodigo;
        break;
      case LS.ACCION_EDITAR:
        this.obtenerDatosEditarFormaCobro();
        this.tituloForm = LS.TITULO_FORM_EDITAR_FORMA_COBRO + ": Cuenta: " + this.invVentasFormaCobroTO.ctaCodigo;
        break;
    }
  }

  obtenerDatosNuevaFormaCobro() {
    this.cargando = true;
    this.invVentasFormaCobroTO = new InvVentasFormaCobroTO();
    this.listaSectores = this.parametros.listaSectores;
    this.sectorSeleccionado = this.listaSectores[0];
    this.invVentasFormaCobroTO.fcTipoPrincipal = this.listaTipos[0];
    this.cargando = false;
  }

  obtenerDatosConsultarFormaCobro() {
    this.cargando = true;
    this.invVentasFormaCobroTO = this.parametros.invVentasFormaCobroTO;
    this.listaSectores = this.parametros.listaSectores;
    this.listaResultado = this.parametros.listaResultado;
    this.llenarCombo();
    this.cargando = false;
  }

  obtenerDatosEditarFormaCobro() {
    this.cargando = true;
    this.invVentasFormaCobroTO = this.parametros.invVentasFormaCobroTO;
    this.codigoCuenta = this.invVentasFormaCobroTO.ctaCodigo;
    this.listaSectores = this.parametros.listaSectores;
    this.listaResultado = this.parametros.listaResultado;
    this.llenarCombo();
    this.indexTablaEditar = this.invVentasFormaCobroTO.fcSecuencial ? this.listaResultado.findIndex(item => item.fcSecuencial === this.invVentasFormaCobroTO.fcSecuencial) :
      this.listaResultado.findIndex(item => item.ctaCodigo === this.invVentasFormaCobroTO.ctaCodigo);
    this.cargando = false;
  }

  insertarInvVentasFormaCobro(form: NgForm) {
    if (this.formaCobroService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invVentasFormaCobroCopia = JSON.parse(JSON.stringify(this.invVentasFormaCobroTO));
        this.setearValoresVentasFormaCobroTO(invVentasFormaCobroCopia);
        let parametro = {
          accionChar: 'I',
          invVentasFormaCobroCopia: invVentasFormaCobroCopia
        };
        this.cargando = false;
        this.enviarAccion.emit(parametro);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  actualizarInvVentasFormaCobro(form: NgForm) {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmFormaCobroDatos)) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      this.enviarCancelar.emit();
    } else {
      if (this.formaCobroService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          let invVentasFormaCobroCopia = JSON.parse(JSON.stringify(this.invVentasFormaCobroTO));
          this.setearValoresVentasFormaCobroTO(invVentasFormaCobroCopia);
          let parametro = {
            accionChar: 'M',
            invVentasFormaCobroCopia: invVentasFormaCobroCopia,
            indexTablaEditar: this.indexTablaEditar
          };
          this.cargando = false;
          this.enviarAccion.emit(parametro);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    }
  }

  setearValoresVentasFormaCobroTO(invVentasFormaCobroTO) {
    invVentasFormaCobroTO.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
    invVentasFormaCobroTO.secEmpresa = LS.KEY_EMPRESA_SELECT.trim();
    invVentasFormaCobroTO.ctaEmpresa = LS.KEY_EMPRESA_SELECT.trim();
    invVentasFormaCobroTO.usrCodigo = this.auth.getCodigoUser();
    invVentasFormaCobroTO.secCodigo = this.sectorSeleccionado.secCodigo;
  }

  llenarCombo() {
    this.sectorSeleccionado = this.formaCobroService.seleccionarSector(this.listaSectores, this.invVentasFormaCobroTO.secCodigo);
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarFormulario') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarFormaCobro') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarFormaCobro') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  //BUSQUEDAS
  /** Metodo que muestra un modal de todas las cuentas que coincidan con lo que se ingreso en el input de cuenta */
  buscarConCuentas(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      let fueBuscado = (this.invVentasFormaCobroTO.ctaCodigo === this.codigoCuenta && this.invVentasFormaCobroTO.ctaCodigo && this.codigoCuenta);
      if (!fueBuscado) {
        this.invVentasFormaCobroTO.ctaCodigo = this.invVentasFormaCobroTO.ctaCodigo === '' ? null : this.invVentasFormaCobroTO.ctaCodigo;
        this.invVentasFormaCobroTO.ctaCodigo = this.invVentasFormaCobroTO.ctaCodigo ? this.invVentasFormaCobroTO.ctaCodigo.toUpperCase() : null;
        if (this.invVentasFormaCobroTO.ctaCodigo) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.invVentasFormaCobroTO.ctaCodigo, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', backdrop: 'static' });
          modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
          modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
          modalRef.result.then((result) => {
            this.codigoCuenta = result ? result.cuentaCodigo : null;
            this.invVentasFormaCobroTO.ctaCodigo = result ? result.cuentaCodigo : null;
            this.invVentasFormaCobroTO.fcDetalle = result ? (result.cuentaDetalle.trim()).toUpperCase() : null;
            document.getElementById('cuenta').focus();
          }, (reason) => {//Cuando se cierra sin un dato
            let element: HTMLElement = document.getElementById('cuenta') as HTMLElement;
            element ? element.focus() : null;
          });
        }
      }
    }
  }

  //VALIDACIONES
  /** Metodo para validar si el input la cuenta es correcto y no se envie otro codigo*/
  validarCuenta() {
    if (this.codigoCuenta !== this.invVentasFormaCobroTO.ctaCodigo) {
      this.codigoCuenta = null;
      this.invVentasFormaCobroTO.ctaCodigo = null;
    }
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmFormaCobroDatos)) {
      this.enviarCancelar.emit();
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
              this.enviarCancelar.emit();
            }
          });
          break;
        default:
          this.enviarCancelar.emit();
      }
    }
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }
}
