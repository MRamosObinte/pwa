import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { PrdProducto } from '../../../../entidades/produccion/PrdProducto';
import { NgForm } from '@angular/forms';
import { ProductosPescaService } from '../../archivos/productos-pesca/productos-pesca.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { PrdLiquidacionProductoTO } from '../../../../entidadesTO/rrhh/PrdLiquidacionProductoTO';

@Component({
  selector: 'app-productos-pesca-formulario',
  templateUrl: './productos-pesca-formulario.component.html',
  styleUrls: ['./productos-pesca-formulario.component.css']
})
export class ProductosPescaFormularioComponent implements OnInit {

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
  public productoPescaRespaldo: PrdProducto;
  public productoPescaSeleccionado: PrdProducto;
  public productoPesca: PrdLiquidacionProductoTO;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public tituloForm: string = LS.TITULO_FILTROS;
  @ViewChild("frmProductoPescaDatos") frmProductoPescaDatos: NgForm;
  public valoresIniciales: any;
  public productoPescaInicial: any;
  //
  public listaTipoProducto: any = {};
  public listaClaseProducto: any = {};
  constructor(
    private productoPescaService: ProductosPescaService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.productoPesca = new PrdLiquidacionProductoTO();
    this.actuarSegunAccion();
    this.definirAtajosDeTeclado();
  }

  actuarSegunAccion() {
    switch (this.accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        this.obtenerProductoPesca();
        break;
    }
  }

  soloNumeros(event) {
    return event.charCode >= 48 && event.charCode <= 57
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmProductoPescaDatos ? this.frmProductoPescaDatos.value : null));
      this.productoPescaInicial = JSON.parse(JSON.stringify(this.productoPesca ? this.productoPesca : null));
    }, 50);
  }

  obtenerProductoPesca() {
    this.cargando = true;
    this.obtenerTituloFormulario();
    this.productoPescaSeleccionado = this.parametros.productoPescaSeleccionada;
    this.productoPesca = this.convertirPrdLiquidacionProductoTOAPrdProducto();
    this.listaTipoProducto = LS.LISTA_TIPO_PRODUCTO;
    this.listaClaseProducto = LS.LISTA_CLASE_PRODUCTO;
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  obtenerTituloFormulario() {
    switch (this.accion) {
      case LS.ACCION_NUEVO:
        this.tituloForm = LS.TITULO_FORM_NUEVO_PRODUCTO_PESCA;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.TITULO_FORM_EDITAR_PRODUCTO_PESCA;
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_PRODUCTO_PESCA;
        break;
    }
  }

  convertirPrdLiquidacionProductoTOAPrdProducto(): PrdLiquidacionProductoTO {
    let predPiscina = new PrdLiquidacionProductoTO(this.productoPescaSeleccionado);
    predPiscina.prodEmpresa = LS.KEY_EMPRESA_SELECT;
    predPiscina.prodCodigo = this.productoPescaSeleccionado.prdLiquidacionProductoPK.prodCodigo;
    return predPiscina;
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.productoPescaService.verificarPermiso(accion, this, mostraMensaje);
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
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmProductoPescaDatos) && this.utilService.compararObjetos(this.productoPescaInicial, this.productoPesca);
  }

  insertarProductoPesca(form: NgForm) {
    this.cargando = true;
    if (this.productoPescaService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.productoPesca.usrCodigo = this.empresaSeleccionada.empSmtpUserName;
        let parametro = {
          prdLiquidacionProductoTO: this.productoPesca
        }
        this.productoPescaService.insertarProductoPesca(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarProductoPesca(data) {
    this.cargando = false;
    if (data) {
      this.convertirPrdProductoAPrdLiquidacionProductoTO();
      this.enviarCancelar.emit({ productoPesca: this.productoPescaSeleccionado, accion: LS.ACCION_NUEVO });
    }
  }

  actualizarProductoPesca(form: NgForm) {
    if (!this.sePuedeCancelar()) {
      this.cargando = true;
      if (this.productoPescaService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          let parametro = {
            prdLiquidacionProductoTO: this.productoPesca
          }
          this.productoPescaService.modificarProductoPesca(parametro, this, LS.KEY_EMPRESA_SELECT);
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

  despuesDeModificarProductoPesca(data) {
    this.cargando = false;
    this.convertirPrdProductoAPrdLiquidacionProductoTO();
    this.enviarCancelar.emit({ productoPesca: this.productoPescaSeleccionado, accion: this.accion });
  }

  convertirPrdProductoAPrdLiquidacionProductoTO() {
    this.productoPescaSeleccionado = new PrdProducto(this.productoPesca);
    this.productoPescaSeleccionado.prdLiquidacionProductoPK.prodCodigo = this.productoPesca.prodCodigo;
    this.productoPescaSeleccionado.prdLiquidacionProductoPK.prodEmpresa = LS.KEY_EMPRESA_SELECT;
  }

  cancelar() {
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_REGISTRO_NO_EXITOSO,
      accionPiscina: this.accion,
      productoPescaSeleccionada: this.productoPescaSeleccionado
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
