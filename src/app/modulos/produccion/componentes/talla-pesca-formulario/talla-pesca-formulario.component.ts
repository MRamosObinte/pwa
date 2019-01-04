import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { PrdTalla } from '../../../../entidades/produccion/PrdTalla';
import { NgForm } from '@angular/forms';
import { TallaPescaService } from '../../archivos/talla-pesca/talla-pesca.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';

@Component({
  selector: 'app-talla-pesca-formulario',
  templateUrl: './talla-pesca-formulario.component.html',
  styleUrls: ['./talla-pesca-formulario.component.css']
})
export class TallaPescaFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  /**
   * parametros debe incluir: --> accion: (nuevo, editar, consulta)
   *                          --> objetoSeleccionado: (El seleccionado de la lista)
   */
  @Input() parametros;
  @Output() enviarCancelar = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  //
  public constantes: any = LS;
  public accion: string = null;
  public rptaCedula: string = null;
  public rptaRepetido: string = null;
  public productoPescaRespaldo: PrdTalla;
  public productoPescaSeleccionado: PrdTalla;
  public productoPesca: PrdTalla;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public tituloForm: string = LS.TITULO_FILTROS;
  public configAutonumeric: AppAutonumeric;
  @ViewChild("frmTallaPescaDatos") frmTallaPescaDatos: NgForm;
  public valoresIniciales: any;
  public tallaPescaInicial: any;
  //
  public listaUnidadMedida: any = {};
  constructor(
    private tallaPescaService: TallaPescaService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.productoPesca = new PrdTalla();
    this.actuarSegunAccion();
    this.definirAtajosDeTeclado();
    this.configAutonumeric = {
      decimalPlaces: 6,
      decimalPlacesRawValue: 6,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 6,
      maximumValue: '99999999999.99',
      minimumValue: '0'
    };
  }

  actuarSegunAccion() {
    switch (this.accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        this.obtenerTallaPesca();
        break;
    }
  }

  soloNumeros(event) {
    return event.charCode >= 48 && event.charCode <= 57
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmTallaPescaDatos ? this.frmTallaPescaDatos.value : null));
      this.tallaPescaInicial = JSON.parse(JSON.stringify(this.productoPesca ? this.productoPesca : null));
    }, 50);
  }

  obtenerTallaPesca() {
    this.cargando = true;
    this.obtenerTituloFormulario();
    this.productoPescaSeleccionado = this.parametros.tallaPescaSeleccionada;
    this.productoPesca = this.parametros.tallaPescaSeleccionada;
    this.listaUnidadMedida = LS.LISTA_UNIDAD_MEDIDA;
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  obtenerTituloFormulario() {
    switch (this.accion) {
      case LS.ACCION_NUEVO:
        this.tituloForm = LS.TITULO_FORM_NUEVO_TALLA_PESCA;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.TITULO_FORM_EDITAR_TALLA_PESCA;
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_TALLA_PESCA;
        break;
    }
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.tallaPescaService.verificarPermiso(accion, this, mostraMensaje);
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

  sePuedeCancelar() {
    this.verValoresNumericosFormulario();
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmTallaPescaDatos) && this.utilService.compararObjetos(this.tallaPescaInicial, this.productoPesca);
  }

  verValoresNumericosFormulario() {
    this.frmTallaPescaDatos.value.gramosdesde = this.frmTallaPescaDatos.value.gramosdesde === "" ? null : this.frmTallaPescaDatos.value.gramosdesde;
    this.frmTallaPescaDatos.value.gramoshasta = this.frmTallaPescaDatos.value.gramoshasta === "" ? null : this.frmTallaPescaDatos.value.gramoshasta;
    this.frmTallaPescaDatos.value.tallaPrecio = this.frmTallaPescaDatos.value.tallaPrecio === "" ? null : this.frmTallaPescaDatos.value.tallaPrecio;

    this.productoPesca.tallaGramosDesde = String(this.productoPesca.tallaGramosDesde) === "" ? null : this.productoPesca.tallaGramosDesde;
    this.productoPesca.tallaGramosHasta = String(this.productoPesca.tallaGramosHasta) === "" ? null : this.productoPesca.tallaGramosHasta;
    this.productoPesca.tallaPrecio = String(this.productoPesca.tallaPrecio) === "" ? null : this.productoPesca.tallaPrecio;
  }

  insertarTallaPesca(form: NgForm) {
    this.cargando = true;
    if (this.tallaPescaService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.productoPesca.prdLiquidacionTallaPK.tallaEmpresa = LS.KEY_EMPRESA_SELECT;
        this.productoPesca.usrCodigo = this.empresaSeleccionada.empSmtpUserName;
        this.productoPesca.usrEmpresa = LS.KEY_EMPRESA_SELECT;
        let parametro = {
          prdLiquidacionTalla: this.productoPesca
        }
        this.tallaPescaService.insertarTallaPesca(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarTallaPesca(data) {
    this.cargando = false;
    if (data) {
      this.enviarCancelar.emit({ productoPesca: this.productoPescaSeleccionado, accion: LS.ACCION_NUEVO });
    }
  }

  actualizarTallaPesca(form: NgForm) {
    if (!this.sePuedeCancelar()) {
      this.cargando = true;
      if (this.tallaPescaService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          let parametro = {
            prdLiquidacionTalla: this.productoPesca
          }
          this.tallaPescaService.modificarTallaPesca(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    } else {
      let parametro = {
        empresa: this.empresaSeleccionada,
        accion: LS.ACCION_REGISTRO_NO_EXITOSO,
        prdLiquidacionProductoTO: this.productoPescaSeleccionado
      }
      this.enviarCancelar.emit(parametro);
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
    }
  }

  despuesDeModificarTallaPesca(data) {
    this.cargando = false;
    this.enviarCancelar.emit({ productoPesca: this.productoPescaSeleccionado, accion: this.accion });
  }

  cancelar() {
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_REGISTRO_NO_EXITOSO,
      accionPiscina: this.accion,
      tallaPescaSeleccionada: this.productoPescaSeleccionado
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
  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }
}
