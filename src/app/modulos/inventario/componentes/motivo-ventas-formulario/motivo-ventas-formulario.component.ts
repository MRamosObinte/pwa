import { Component, OnInit, EventEmitter, Input, Output, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { MotivoVentasService } from '../../archivo/motivo-ventas/motivo-ventas.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { InvVentaMotivoTO } from '../../../../entidadesTO/inventario/InvVentaMotivoTO';
import { NgForm } from '@angular/forms';
import { TipoContableService } from '../../../contabilidad/archivo/tipo-contable/tipo-contable.service';

@Component({
  selector: 'app-motivo-ventas-formulario',
  templateUrl: './motivo-ventas-formulario.component.html',
  styleUrls: ['./motivo-ventas-formulario.component.css']
})
export class MotivoVentasFormularioComponent implements OnInit {

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
  public listaTipos: Array<ConTipoTO> = [];
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
  public listaFormaImprimir: Array<string> = LS.LISTA_MOTIVOS_COMPRA_FORMA_IMPRIMIR;
  public formaImprimirSeleccionado: string = "";
  public listaFormaContabilizar: Array<string> = LS.LISTA_MOTIVOS_COMPRA_FORMA_CONTABILIZAR;
  public formaContabilizarSeleccionado: string = "";
  //
  public invVentaMotivoTO: InvVentaMotivoTO = new InvVentaMotivoTO();
  //
  @ViewChild("frmVentaMotivoDatos") frmVentaMotivoDatos: NgForm;
  public valoresIniciales: any;
  public motivoVentaInicial: any;

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private motivoVentasService: MotivoVentasService,
    private tipoContableService: TipoContableService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.listaTipos = this.parametros.listaTipos;
    this.invVentaMotivoTO = { ...this.parametros.invVentaMotivoTO };
    this.operaciones();
    this.generarAtajos();
    this.extraerValoresIniciales();
  }


  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmVentaMotivoDatos ? this.frmVentaMotivoDatos.value : null));
      this.motivoVentaInicial = JSON.parse(JSON.stringify(this.motivoVentaInicial ? this.motivoVentaInicial : null));
    }, 50);
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.obtenerDatosMotivoVentasNuevo();
        this.tituloForm = LS.TITULO_FORM_NUEVO_MOTIVO_VENTA;
        break;
      case LS.ACCION_CONSULTAR:
        this.obtenerDatosMotivoVentas();
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_MOTIVO_VENTA + ": Código: " + this.invVentaMotivoTO.vmCodigo;
        break;
      case LS.ACCION_EDITAR:
        this.obtenerDatosMotivoVentas();
        this.tituloForm = LS.TITULO_FORM_EDITAR_MOTIVO_VENTA + ": Código: " + this.invVentaMotivoTO.vmCodigo;
        break;
    }
  }

  obtenerDatosMotivoVentasNuevo() {
    this.cargando = true;
    this.invVentaMotivoTO = new InvVentaMotivoTO();
    this.formaContabilizarSeleccionado = this.listaFormaContabilizar[0];
    this.formaImprimirSeleccionado = this.listaFormaImprimir[0];
    this.tipoSeleccionado = this.listaTipos.length > 0 ? this.listaTipos[0] : null;
    this.cargando = false;
  }

  obtenerDatosMotivoVentas() {
    this.cargando = true;
    this.invVentaMotivoTO = this.parametros.invVentaMotivoTO;
    this.llenarCombos();
    this.cargando = false;
  }

  insertarInvVentaMotivoTO(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invVentaMotivoTOCopia = JSON.parse(JSON.stringify(this.invVentaMotivoTO));
        this.setearValoresInvVentaMotivoTO(invVentaMotivoTOCopia);
        let parametro = { invVentaMotivoTO: invVentaMotivoTOCopia };
        this.motivoVentasService.insertarInvVentasMotivoTO(parametro, this, invVentaMotivoTOCopia, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarInvVentasMotivoTO(respuesta, invVentaMotivoTOCopia) {
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      invVentaMotivoTOCopia: invVentaMotivoTOCopia,
      accionChar: 'I'
    };
    this.cargando = false;
    this.enviarAccion.emit(parametro);
  }

  actualizarInvVentaMotivoTO(form: NgForm) {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmVentaMotivoDatos)) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      this.enviarCancelar.emit();
    } else {
      if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          let invVentaMotivoTOCopia = JSON.parse(JSON.stringify(this.invVentaMotivoTO));
          this.setearValoresInvVentaMotivoTO(invVentaMotivoTOCopia);
          this.motivoVentasService.actualizarInvVentaMotivoTO(this.parametros, this, invVentaMotivoTOCopia, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    }
  }

  despuesDeActualizarInvVentasMotivoTO(respuesta, invVentaMotivoTOCopia){
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      invVentaMotivoTOCopia: invVentaMotivoTOCopia,
      accionChar: 'U'
    };
    this.cargando = false;
    this.enviarAccion.emit(parametro);
  }

  llenarCombos() {
    this.tipoSeleccionado = this.listaTipos.filter(tipo => tipo.tipCodigo === this.invVentaMotivoTO.tipCodigo)[0];
    this.formaContabilizarSeleccionado = this.listaFormaContabilizar.filter(forma => forma === this.invVentaMotivoTO.vmFormaContabilizar)[0];
    this.formaImprimirSeleccionado = this.listaFormaImprimir.filter(forma => forma === this.invVentaMotivoTO.vmFormaImprimir)[0];
  }

  //OTROS METODOS
  /** Metodo para setear los valores en comun del objeto  InvVentaMotivoTO*/
  setearValoresInvVentaMotivoTO(invVentaMotivoTOCopia) {
    invVentaMotivoTOCopia.vmEmpresa = LS.KEY_EMPRESA_SELECT;
    invVentaMotivoTOCopia.vmFormaContabilizar = this.formaContabilizarSeleccionado;
    invVentaMotivoTOCopia.vmFormaImprimir = this.formaImprimirSeleccionado;
    invVentaMotivoTOCopia.tipCodigo = this.tipoSeleccionado.tipCodigo;
    invVentaMotivoTOCopia.usrCodigo = this.auth.getCodigoUser();
  }

  //LISTADOS
  /** Metodo que lista todos los tipos contables segun empresa*/
  listarTipos() {
    this.listaTipos = [];
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.tipoContableService.listarTipoContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo se ejecuta despues de haber ejecutado el metodo listarTipos() y asi seleccionar el primer elemento*/
  despuesDeListarTipoContable(listaTipos) {
    this.listaTipos = listaTipos ? listaTipos : [];
    if (this.listaTipos.length > 0) {
      this.tipoSeleccionado = this.tipoSeleccionado ? this.listaTipos.find(item => item.tipCodigo === this.tipoSeleccionado.tipCodigo) : this.listaTipos[0];
    } else {
      this.tipoSeleccionado = null;
    }
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmVentaMotivoDatos)) {
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
