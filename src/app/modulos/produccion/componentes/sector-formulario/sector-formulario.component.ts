import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { SectorService } from '../../archivos/sector/sector.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { PrdSectorTO } from '../../../../entidadesTO/Produccion/PrdSectorTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sector-formulario',
  templateUrl: './sector-formulario.component.html',
  styleUrls: ['./sector-formulario.component.css']
})
export class SectorFormularioComponent implements OnInit {

  @Input() parametros;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarCancelar = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  @ViewChild("frmSectorDatos") frmSectorDatos: NgForm;
  @ViewChild('gmap') gmapElement: any;
  public valoresIniciales: any;
  public sectorInicial: any;//
  //
  public constantes: any = LS;
  public accion: string = null;
  public rptaCedula: string = null;
  public rptaRepetido: string = null;
  public sector: PrdSectorTO;
  public sectorRespaldo: PrdSectorTO;
  public sectorSeleccionado: PrdListaSectorTO;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public tituloForm: string = LS.TITULO_FILTROS;
  // Mapa
  lat: number = -3.2201392042497057;
  lng: number = -80.03072420635988;
  zoom: number = 14;
  constructor(
    private sectorService: SectorService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.sectorSeleccionado = this.parametros.sectorSeleccionado;
    this.sector = new PrdSectorTO();
    this.actuarSegunAccion();
    this.definirAtajosDeTeclado();
  }

  // mapa
  onChoseLocation(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.sector.secLatitud = this.lat + "";
    this.sector.secLongitud = this.lng + "";
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }

  actuarSegunAccion() {
    switch (this.accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        this.obtenerPiscina(this.accion);
        break;
    }
  }

  obtenerPiscina(accion) {
    this.cargando = true;
    this.obtenerTituloFormulario();
    this.sector = this.convertirPrdListaSectorTOAPrdSector();
    this.cargando = false;
    this.extraerValoresIniciales();
    if (accion === LS.ACCION_NUEVO) {
      this.sector.secLatitud = this.sector.secLatitud === "" ? this.lat + "" : this.sector.secLatitud;
      this.sector.secLongitud = this.sector.secLongitud === "" ? this.lng + "" : this.sector.secLongitud;
    } else {
      this.lat = Number.parseFloat(this.sector.secLatitud);
      this.lng = Number.parseFloat(this.sector.secLongitud);
    }
  }

  obtenerTituloFormulario() {
    switch (this.accion) {
      case LS.ACCION_NUEVO:
        this.tituloForm = LS.TITULO_FORM_NUEVO_SECTOR;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.TITULO_FORM_EDITAR_SECTOR;
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_SECTOR;
        break;
    }
  }

  convertirPrdListaSectorTOAPrdSector(): PrdSectorTO {
    let predSector = new PrdSectorTO(this.sectorSeleccionado);
    predSector.secNombre = this.sectorSeleccionado['secNombre'];
    predSector.secEmpresa = LS.KEY_EMPRESA_SELECT;
    predSector.usrEmpresa = this.empresaSeleccionada.empCodigo;
    predSector.usrCodigo = this.empresaSeleccionada.empSmtpUserName;
    predSector.usrFechaInsertaSector = (new Date()).toDateString();
    return predSector;
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.sectorService.verificarPermiso(accion, this, mostraMensaje);
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmSectorDatos ? this.frmSectorDatos.value : null));
      this.sectorInicial = JSON.parse(JSON.stringify(this.sector ? this.sector : null));
    }, 50);
  }

  insertarSector(form: NgForm) {
    this.cargando = true;
    if (this.sectorService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          prdSectorTO: this.sector
        }
        this.sectorService.insertarSector(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarPiscina(data) {
    this.cargando = false;
    if (data) {
      let parametro = {
        empresa: this.empresaSeleccionada,
        acccion: LS.ACCION_REGISTRO_EXITOSO,
        sector: this.sector
      }
      this.enviarCancelar.emit(parametro);
    }
  }

  actualizarSector(form: NgForm) {
    if (!this.sePuedeCancelar()) {
      this.cargando = true;
      if (this.sectorService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          let parametro = {
            prdSectorTO: this.sector
          }
          this.sectorService.modificarSector(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    } else {
      let parametro = {
        empresa: this.empresaSeleccionada,
        accion: LS.ACCION_REGISTRO_NO_EXITOSO,
        sector: this.sectorSeleccionado
      }
      this.enviarCancelar.emit(parametro);
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
    }
  }

  despuesDeModificarPiscina(data) {
    this.cargando = false;
    this.enviarCancelar.emit(this.sector);
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmSectorDatos) && this.utilService.compararObjetos(this.sectorInicial, this.sector);
  }

  cancelar() {
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_REGISTRO_NO_EXITOSO,
      accionSector: this.accion,
      sectorSeleccionado: this.sectorSeleccionado
    }
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_NUEVO:
        if (this.sePuedeCancelar()) {
          this.accion = null;
          this.enviarCancelar.emit(parametro);
        } else {
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI_ACEPTAR,
            cancelButtonText: LS.MSJ_NO_CANCELAR
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.accion = null;
              this.enviarCancelar.emit(parametro);
            }
          });
        }
        break;
      default:
        this.accion = null;
        this.enviarCancelar.emit(parametro);
        break;
    }
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      if (this.accion !== null) {
        this.cancelar();
      }
      return false;
    }))
  }
}
