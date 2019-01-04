import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { PrdListaSobrevivenciaTO } from '../../../../entidadesTO/Produccion/PrdListaSobrevivenciaTO';
import { PrdSobrevivenciaTO } from '../../../../entidadesTO/Produccion/PrdSobrevivenciaTO';
import { NgForm } from '@angular/forms';
import { SobrevivenciaService } from '../../archivos/sobrevivencia/sobrevivencia.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';

@Component({
  selector: 'app-sobrevivencia-formulario',
  templateUrl: './sobrevivencia-formulario.component.html',
  styleUrls: ['./sobrevivencia-formulario.component.css']
})
export class SobrevivenciaFormularioComponent implements OnInit {

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
  public sobrevivenciaRespaldo: PrdListaSobrevivenciaTO;
  public sobrevivenciaSeleccionada: PrdListaSobrevivenciaTO;
  public sobrevivencia: PrdSobrevivenciaTO;
  public sectorSeleccionado: PrdListaSectorTO;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public fechaActual: Date = new Date();
  @ViewChild("frmPiscinaDatos") frmPiscinaDatos: NgForm;
  public valoresIniciales: any;
  public piscinaInicial: any;
  public configAutonumeric: AppAutonumeric;
  public tituloForm: string = LS.TITULO_FILTROS;

  constructor(
    private piscinaService: SobrevivenciaService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private sistemaService: AppSistemaService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.sobrevivencia = new PrdSobrevivenciaTO();
    this.sectorSeleccionado = this.parametros.sectorSeleccionado;
    this.actuarSegunAccion();
    this.definirAtajosDeTeclado();
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '999999',
      minimumValue: '0',
    }
  }

  actuarSegunAccion() {
    switch (this.accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        this.obtenerSobrevivencia();
        break;
    }
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  soloNumeros(event) {
    return this.utilService.soloNumeros(event);
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmPiscinaDatos ? this.frmPiscinaDatos.value : null));
      this.piscinaInicial = JSON.parse(JSON.stringify(this.sobrevivencia ? this.sobrevivencia : null));
    }, 50);
  }

  obtenerSobrevivencia() {
    this.cargando = true;
    this.obtenerTituloFormulario();
    this.sobrevivenciaSeleccionada = this.parametros.sobrevivenciaSeleccionada;
    this.sobrevivencia = this.convertirPrdLiquidacionProductoTOAPrdProducto();
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  obtenerTituloFormulario() {
    switch (this.accion) {
      case LS.ACCION_NUEVO:
        this.tituloForm = LS.TITULO_FORM_NUEVA_SOBREVIVENCIA;
        break;
      case LS.ACCION_EDITAR:
        this.tituloForm = LS.TITULO_FORM_EDITAR_SOBREVIVENCIA;
        break;
      case LS.ACCION_CONSULTAR:
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_SOBREVIVENCIA;
        break;
    }
  }

  convertirPrdLiquidacionProductoTOAPrdProducto(): PrdSobrevivenciaTO {
    let predPiscina = new PrdSobrevivenciaTO(this.parametros.sobrevivenciaSeleccionada);
    predPiscina.sobAlimentacion = this.parametros.sobrevivenciaSeleccionada.sobAlimentacion;
    predPiscina.secEmpresa = LS.KEY_EMPRESA_SELECT;
    predPiscina.secCodigo = this.sectorSeleccionado.secCodigo;
    predPiscina.usrEmpresa = this.empresaSeleccionada.empCodigo;
    predPiscina.usrCodigo = this.empresaSeleccionada.empCodigo;
    predPiscina.usrFechaInsertaSobrevivencia = this.utilService.formatearDateToStringYYYYMMDD(this.fechaActual);
    return predPiscina;
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.piscinaService.verificarPermiso(accion, this, mostraMensaje);
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
    this.convertirANumeros();
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmPiscinaDatos) && this.utilService.compararObjetos(this.piscinaInicial, this.sobrevivencia);
  }

  convertirANumeros() {
    // formulario
    if (this.accion === LS.ACCION_EDITAR) {
      this.frmPiscinaDatos.value.diasdesde = Number(this.frmPiscinaDatos.value.diasdesde);
      this.frmPiscinaDatos.value.diashasta = Number(this.frmPiscinaDatos.value.diashasta);
      this.frmPiscinaDatos.value.sobSobrevivencia = Number(this.frmPiscinaDatos.value.sobSobrevivencia);
      this.frmPiscinaDatos.value.alimentacion = Number(this.frmPiscinaDatos.value.alimentacion);
      // objeto
      this.sobrevivencia.sobDiasDesde = Number(this.sobrevivencia.sobDiasDesde);
      this.sobrevivencia.sobDiasHasta = Number(this.sobrevivencia.sobDiasHasta);
      this.sobrevivencia.sobSobrevivencia = Number(this.sobrevivencia.sobSobrevivencia);
      this.sobrevivencia.sobAlimentacion = Number(this.sobrevivencia.sobAlimentacion);
    } else {
      
    }
  }

  insertarPiscina(form: NgForm) {
    this.cargando = true;
    if (this.piscinaService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          prdSobrevivenciaTO: this.sobrevivencia
        }
        this.piscinaService.insertarSobrevivencia(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarSobrevivencia(data) {
    this.cargando = false;
    if (data) {
      this.convertirPrdProductoAPrdLiquidacionProductoTO();
      this.enviarCancelar.emit({ sobrevivencia: this.sobrevivenciaSeleccionada, accion: LS.ACCION_NUEVO });
    }
  }

  actualizarPiscina(form: NgForm) {
    if (!this.sePuedeCancelar()) {
      this.cargando = true;
      if (this.piscinaService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          let parametro = {
            prdSobrevivenciaTO: this.sobrevivencia
          }
          this.piscinaService.modificarSobrevivencia(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    } else {
      let parametro = {
        empresa: this.empresaSeleccionada,
        accion: LS.ACCION_REGISTRO_NO_EXITOSO,
        prdLiquidacionProductoTO: this.sobrevivenciaSeleccionada
      }
      this.enviarCancelar.emit(parametro);
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
    }
  }

  despuesDeModificarSobrevivencia(data) {
    this.cargando = false;
    if (data) {
      this.convertirPrdProductoAPrdLiquidacionProductoTO();
      this.enviarCancelar.emit({ sobrevivencia: this.sobrevivenciaSeleccionada, accion: this.accion });
    }
  }

  convertirPrdProductoAPrdLiquidacionProductoTO() {
    this.sobrevivenciaSeleccionada = new PrdListaSobrevivenciaTO(this.sobrevivencia);
    this.sobrevivenciaSeleccionada.sobSobrevivencia = this.sobrevivencia.sobSobrevivencia;
    this.sobrevivenciaSeleccionada.sobAlimentacion = this.sobrevivencia.sobAlimentacion;
  }

  cancelar() {
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_REGISTRO_NO_EXITOSO,
      accionPiscina: this.accion,
      sobrevivenciaSeleccionada: this.sobrevivenciaSeleccionada
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
