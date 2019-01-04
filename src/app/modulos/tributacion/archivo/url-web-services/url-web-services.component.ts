import { Component, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { ToastrService } from 'ngx-toastr';
import { AnxUrlWebServicesTO } from '../../../../entidadesTO/anexos/AnxURLWebServicesTO';
import { NgForm } from '@angular/forms';
import { UrlWebServicesService } from './url-web-services.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-url-web-services',
  templateUrl: './url-web-services.component.html',
  styleUrls: ['./url-web-services.component.css']
})
export class UrlWebServicesComponent implements OnInit {

  public constantes: any;
  public cargando: boolean = false;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  public urlWebService: AnxUrlWebServicesTO = new AnxUrlWebServicesTO;
  public urlWebServiceCopia: AnxUrlWebServicesTO = new AnxUrlWebServicesTO;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public accion: String = null;
  public activar: boolean = false;
  public classIcon: string = LS.ICON_FILTRAR;
  public screamXS: boolean = true;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private urlWebServices: UrlWebServicesService,
    private utilService: UtilService,
    private auth: AuthService,
    private atajoService: HotkeysService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['urlWebServices'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.urlWebServices.obtenerAnexoURLWebServices({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarURLWebService') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  listaURLWebServices(form?: NgForm) {
    if (form && form.valid) {
      this.cargando = true;
      this.urlWebServices.obtenerAnexoURLWebServices({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarAnexoURLWebServices(data) {
    this.cargando = false;
    this.urlWebService = data;
    this.urlWebServiceCopia = data;
  }

  actualizarAnexoURLWebService(ngForm: NgForm) {
    this.cargando = true;
    let editar: String = "M";
    let formTocado = this.utilService.establecerFormularioTocado(ngForm);
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    if (formTocado && !ngForm.invalid) {
      this.urlWebService.usrCodigo = this.auth.getCodigoUser();
      let parametro = {
        anxUrlWebServicesTO: this.urlWebService,
        accion: editar
      }
      this.urlWebServices.accionAnexoURLWebServices(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.TOAST_ADVERTENCIA);
    }
  }

  despuesModificarAnexoURLWebServices() {
    this.toastr.success(LS.MSJ_SE_MODIFICO_URL, LS.TOAST_CORRECTO);
    this.cargando = false;
  }

  verificarURL(ngForm: NgForm, valorV) {
    this.cargando = true;
    let formTocado = this.utilService.establecerFormularioTocado(ngForm);
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    if (formTocado && !ngForm.invalid) {
      if (valorV === 'Pro') {
        let parametro = {
          urlVerificacion: this.urlWebService.urlAmbienteProduccion
        }
        this.urlWebServices.verificacionURL(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        let parametro = {
          urlVerificacion: this.urlWebService.urlAmbientePruebas
        }
        this.urlWebServices.verificacionURL(parametro, this, LS.KEY_EMPRESA_SELECT);
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.TOAST_ADVERTENCIA);
      this.cargando = false;
    }
  }

  despuesVerificarAnexoURLWebServices() {
    this.cargando = false;
    this.toastr.success(LS.MSJ_SE_VERIFICO_URL, LS.TOAST_CORRECTO);
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
