import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from './api-request.service';
import printJS from 'print-js/src';
import { Router } from '@angular/router';
import * as moment from 'moment';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { NgForm, ValidationErrors } from '@angular/forms';
import { LS } from '../constantes/app-constants';
import { GridApi } from '../../../node_modules/ag-grid';
import { PinnedCellComponent } from '../modulos/componentes/pinned-cell/pinned-cell.component';
import { BotonOpcionesComponent } from '../modulos/componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../modulos/componentes/tooltip-reader/tooltip-reader.component';
import { BotonAccionComponent } from '../modulos/componentes/boton-accion/boton-accion.component';
import { PermisosEmpresaMenuTO } from '../entidadesTO/web/PermisosEmpresaMenuTO';
import { SpanAccionComponent } from '../modulos/componentes/span-accion/span-accion.component';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class UtilService {

  fechaServidor: any;

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private router: Router
  ) {
    moment.locale('es');
  }

  formatoDateSinZonaHorariaYYYMMDD(fecha): Date {//la fecha viene como YYYY-MM-DD
    let fechaDate: Date;
    if (fecha) {
      fecha = moment(fecha).format('YYYY-MM-DD:HH:mm:ss');
      fechaDate = new Date(fecha);
      return fechaDate;
    }
    return fechaDate;
  }


  formatoDateSinZonaHorariaDDMMYYYY(fecha): Date {
    let fechaDate: Date;
    if (fecha) {
      fecha = moment(fecha, "DD-MM-YYYY").format('YYYY-MM-DD:HH:mm:ss');
      fechaDate = new Date(fecha);
      return fechaDate;
    }
    return fechaDate;
  }

  formatoStringSinZonaHorariaYYYMMDD(fecha): string {
    return fecha ? moment(fecha).format('YYYY-MM-DD') : null;
  }

  formatoStringSinZonaHorariaDDMMYYYY(fecha): string {
    return fecha ? moment(fecha).format('DD-MM-YYYY') : null;
  }

  setLocaleDate(): any {
    return {
      firstDayOfWeek: 0,
      dayNames: [LS.TAG_DOMINGO, LS.TAG_LUNES, LS.TAG_MARTES, LS.TAG_MIERCOLES, LS.TAG_JUEVES, LS.TAG_VIERNES, LS.TAG_SABADO],
      dayNamesShort: [LS.TAG_DOM, LS.TAG_LUN, LS.TAG_MAR, LS.TAG_MIE, LS.TAG_JUE, LS.TAG_VIE, LS.TAG_SAB],
      dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Jue", "Vi", "Sa"],
      monthNames: ["Enero ", "Febrero ", "Marzo ", "Abril ", "Mayo ", "Junio ", "Julio ", "Agosto ", "Septiembre ", "Octubre ", "Noviembre ", "Diciembre "],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      today: 'Hoy',
      clear: 'Limpiar'
    };
  }

  /**
   * Recibe un string fecha en un formato dado y retorna un Date 
   * @param fecha : string {1999-11-11}
   * @param formato : string {DD/MM/AAAA}
   * Buscar más ejemplos en: https://momentjs.com/docs/
   */
  fomatearFechaString(fecha, formato): Date {
    return moment(fecha, formato).toDate();
  }

  /**
   * @param {Date} fecha
   * @returns
   * @memberof UtilService
   */
  formatearDateToStringYYYYMMDD(fecha: Date) {
    return fecha ? fecha.toISOString().slice(0, 10) : null;
  }

  formatearDateToStringDDMMYYYY(fecha: Date) {
    let fechaString = fecha.toISOString().slice(0, 10).split('-');
    return fechaString[2] + '-' + fechaString[1] + '-' + fechaString[0];
  }

  obtenerHorayFechaActual() { //DE LA PC DE USUARIO
    return moment().format('hh_mm_ss DD-MM-YYYY');
  }

  convertirStringNumber(numeroString) {
    return parseFloat(numeroString.toString().replace(/,/gi, ""));
  }

  /**
   * @param {*} tipoDocumento:
   * @param {*} nombreArchivo
   * @param {*} data
   * @memberof UnidadMedidaComponent
   */
  descargarArchivoPDF(nombreArchivo, data) {
    var fileName = nombreArchivo;
    var file = new Blob([data._body], { type: 'application/pdf' });
    var url = URL.createObjectURL(file);
    printJS(url);
  }

  descargarArchivoExcel(data, nombreReporte) {
    var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8" });
    var objectUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = objectUrl;
    a.download = nombreReporte + this.obtenerHorayFechaActual() + ".xlsx";
    a.click();
    this.toastr.success(LS.MSJ_DOC_GENERADO, LS.TOAST_CORRECTO);
  }

  descargarZip(data, nombreReporte) {
    var blob = new Blob([data], { type: "application/zip" });
    var objectUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = objectUrl;
    a.download = nombreReporte + this.obtenerHorayFechaActual() + ".zip";
    a.click();
    this.toastr.success(LS.MSJ_DOC_GENERADO, LS.TOAST_CORRECTO);
  }

  descargarArchivoXml(data, nombreReporte) {
    var blob = new Blob([data], { type: "application/xml" });
    var objectUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = objectUrl;
    a.download = nombreReporte + this.obtenerHorayFechaActual() + ".xml";
    a.click();
    this.toastr.success(LS.MSJ_DOC_GENERADO, LS.TOAST_CORRECTO);
  }

  handleError(error: any, contexto) {
    switch (error.status) {
      case 401:
      case 403:
        this.toastr.warning('No autorizado', 'Aviso');
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['login']);
        break;
      case 404:
        this.toastr.warning('página solicitada no se encuentra', 'Aviso');
        break;
      case 0:
        this.toastr.warning("No hay conexión con el servidor.", 'Aviso');
        break;
      default:
        this.toastr.error(error.message || error, 'Error');
        break;
    }
    contexto.cargando = false;
  }

  public enviarListadoSeleccionados(listado) {
    let respuesta = { conStatus: false, listadoResultado: [], mensaje: "" };
    for (let item of listado) {
      if (item.conStatus && item.conStatus !== LS.ETIQUETA_BLOQUEADO) {
        respuesta.conStatus = true;
        break;
      }
      item.conFecha = this.convertirFechaStringYYYYMMDD(item.conFecha);
      respuesta.listadoResultado.push(item);
    }
    if (respuesta.conStatus) {
      respuesta.mensaje = "Todos los contables seleccionados tienen alguno de estos estados: ANULADO, PENDIENTE, REVERSADO.";
    } else {
      if (respuesta.listadoResultado.length === 0) {
        respuesta.mensaje = "Debe seleccionar al menos una fila";
      }
    }
    return respuesta;
  }

  public enviarListadoPedidosSeleccionados(listado) {
    let respuesta = { conStatus: false, listadoResultado: [], mensaje: "" };
    for (let item of listado) {
      if (item.pedpendiente || item.pedanulado) {
        respuesta.conStatus = true;
        break;
      }
      respuesta.listadoResultado.push(item);
    }
    if (respuesta.conStatus) {
      respuesta.mensaje = "Algunas de las órdenes de pedidos seleccionadas están PENDIENTE O ANULADOS";
    } else {
      if (respuesta.listadoResultado.length === 0) {
        respuesta.mensaje = "Debe seleccionar al menos una fila";
      }
    }
    return respuesta;
  }

  public enviarListadoOrdenCompraSeleccionados(listado) {
    let respuesta = { conStatus: false, listadoResultado: [], mensaje: "" };
    for (let item of listado) {
      if (item.ocAnulado) {
        respuesta.conStatus = true;
        break;
      }
      respuesta.listadoResultado.push(item);
    }
    if (respuesta.conStatus) {
      respuesta.mensaje = "Algunas de las órdenes de compra seleccionadas están ANULADOS";
    } else {
      if (respuesta.listadoResultado.length === 0) {
        respuesta.mensaje = "Debe seleccionar al menos una fila";
      }
    }
    return respuesta;
  }

  public enviarListadoCobrosSeleccionados(listado) {
    let respuesta = { conStatus: false, listadoResultado: [], mensaje: "" };
    for (let item of listado) {
      if (item.cobPendiente || item.cobAnulado) {
        respuesta.conStatus = true;
        break;
      }
      respuesta.listadoResultado.push(item);
    }
    if (respuesta.conStatus) {
      respuesta.mensaje = "Algunas de los cobros seleccionados están PENDIENTES O ANULADOS";
    } else {
      if (respuesta.listadoResultado.length === 0) {
        respuesta.mensaje = "Debe seleccionar al menos una fila";
      }
    }
    return respuesta;
  }

  public convertirFechaStringDDMMYYYY(fecha) {
    return (typeof fecha === 'undefined' || fecha === null || fecha === "") ? null : moment(fecha.toString()).format('DD-MM-YYYY');//CONVIERTE EN STRING - DIFF TOFORMAT
  }

  public convertirFechaStringYYYYMMDD(fecha) {
    return (typeof fecha === 'undefined' || fecha === null || fecha === "") ? null : moment(fecha.toString()).format('YYYY-MM-DD');//CONVIERTE EN STRING - DIFF TOFORMAT
  }

  obtenerConContablePK(cadena, empCodigo, separador) {
    let splitConContablePK = cadena.split(separador);
    return { conEmpresa: empCodigo, conPeriodo: splitConContablePK[0].trim(), conTipo: splitConContablePK[1].trim(), conNumero: splitConContablePK[2].trim() };
  }

  public obtenerFechaInicioMes(): any {
    return moment().startOf('month').toDate();
  }

  public obtenerFechaFinMes(): any {
    return moment().endOf('month').toDate();
  }

  public obtenerFechaActual(): any {
    return moment().toDate();
  }
  /**
   * Retorna un entero que especifica el dia de la semana.
   * 0 - 6 : Domingo - sabado
   * @param {Date} fecha
   * @memberof UtilService
   */
  public getDayOfDate(fecha: Date) {
    return fecha ? fecha.getDay() : -1;
  }

  convertirDecimaleFloat(num) {
    return (typeof num === 'undefined' || num === null || num === '' || num === '.' || num.toString() === 'NaN') ? 0 : parseFloat(this.quitarComasNumero(num));
  }

  convertirNDecimale(num, cantidad) {
    return (typeof num === 'undefined' || num === null || num === '') ? this.convertirNDecimales.new(0, cantidad) : this.convertirNDecimales.new(this.quitarComasNumero(num), cantidad);
  }

  redondearNDecimales(num: number, cantidadDecimales: number) {
    return (num && typeof num !== 'undefined') ? Number(num.toFixed(cantidadDecimales)) : 0;
  }

  convertirNDecimales = {
    separador: ",", // separador para los miles
    sepDecimal: '.', // separador para los decimales
    formatear: function (num, cantidad: number) {
      num = parseFloat(num);
      num = Math.round(num * Math.pow(10, cantidad)) / Math.pow(10, cantidad);
      num = num.toFixed(cantidad);
      num += '';
      var splitStr = num.split(',');
      var splitLeft = splitStr[0];
      var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[2] : "";
      var regx = /(\d+)(\d{3})/;
      while (regx.test(splitLeft)) {
        splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
      }
      splitLeft = splitLeft.toString().split(".")[0] + "." + this.quitarComasNumero(splitLeft.toString().split(".")[1]);
      return this.simbol + splitLeft + splitRight;
    },
    new: function (num, cantidad, simbol?) {
      this.simbol = simbol || '';
      return this.formatear(num, cantidad);
    },
    quitarComasNumero: function (num) {
      if (num !== undefined && num !== null) {
        return num.toString().replace(/,/gi, "");
      }
    }
  };

  quitarComasNumero(num) {
    if (num !== undefined && num !== null) {
      return num.toString().replace(/,/gi, "");
    }
    return '0';
  }

  remplazarTodo(cadena, cadenaBuscar, cadenaRemplazo): string {
    return cadena.split(cadenaBuscar).join(cadenaRemplazo);
  }

  public validarFechas(tipo, fechaInicio, fechaFinal): object {
    let fechasValidas = { fechaInicioValido: true, fechaFinValido: true }
    if (fechaInicio && fechaFinal) {
      fechasValidas.fechaInicioValido = tipo === 'I' ? (fechaInicio <= fechaFinal) : true;
      fechasValidas.fechaFinValido = tipo === 'F' ? (fechaInicio <= fechaFinal) : true;
    } else {
      fechasValidas.fechaInicioValido = fechaInicio ? true : false;
      fechasValidas.fechaFinValido = fechaFinal ? true : false;
    }
    return fechasValidas;
  }

  verificarTieneCuentaGrupos(listadoCuentas, cuentaCodigoEvaluar): boolean {
    let indice = 0, contador = 0, estado = false, i = 0;
    listadoCuentas.forEach(value => {
      if (value.cuentaCodigo === cuentaCodigoEvaluar) {
        if ((contador + 1) == listadoCuentas.length) {
          estado = false;
        } else {
          for (let i = contador + 1; i < listadoCuentas.length; i++) {
            indice = listadoCuentas[i].cuentaCodigo.lastIndexOf(cuentaCodigoEvaluar);
            if (indice >= 0) {
              estado = true;
              break;
            } else {
              estado = false;
            }
          }
        }
      }
      contador++;
    });
    return estado;
  }

  formatearDebitosCreditosStringNumber(listado) {
    listado.forEach(item => {
      item.detCreditos = this.convertirDecimaleFloat(item.detCreditos);
      item.detDebitos = this.convertirDecimaleFloat(item.detDebitos);
      item.saldo = item.detCreditos !== 0 ? item.detCreditos : item.detDebitos;
      item.piscinaSeleccionada = item.piscinaSeleccionada ? item.piscinaSeleccionada : null;
      item.id = null;// se elimina los id provisionales
    });
    return listado;
  }

  establecerFormularioTocado(form: NgForm): boolean {
    let touched = true;
    let formControls = form.form.controls;
    for (let element in formControls) {
      form.controls[element].markAsTouched();
      form.controls[element].updateValueAndValidity();
    }
    return touched;
  }

  obtenerFormErrores(form: NgForm): Array<string> {
    let errores = [];
    let formControls = form.form.controls;
    for (let element in formControls) {
      form.controls[element].markAsTouched();
      let control = form.controls[element];
      const controlErrors: ValidationErrors = control.errors;
      if (controlErrors !== null) {
        Object.keys(controlErrors).forEach(keyError => {
          errores.push("{Campo con valor: " + control.value + "<br>Error: " + this.traducirError(keyError) + "}");
        });
      }
    }
    return errores;
  }

  traducirError(keyError): string {
    switch (keyError) {
      case "required": {
        return "Campo obligatorio."
      }
      case "duplicado": {
        return "Valor duplicado."
      }
      case "tamanioIncorrecto": {
        return "Número de caracteres incorrecto."
      }
      case "grupoIncorrecto": {
        return "Cuenta no tiene grupo o está en un orden incorrecto.";
      }
    }
    return "";
  }

  generarSwalConfirmation(title, msje, type, contexto) {
    return swal({
      title: title,
      text: msje,
      type: type,
      showCancelButton: true,
      confirmButtonColor: '#416273',
      cancelButtonColor: '#d33',
      confirmButtonText: LS.MSJ_SI_ACEPTAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR,
      allowEnterKey: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.value) {
        contexto.confirmacionAceptada();
      }
      if (result.dismiss) {
        contexto.confirmacionCancelada();
      }
    });
  }

  generarSwalConfirmationOption(title, msje, type): SweetAlertOptions {
    return {
      title: title,
      text: msje,
      type: type,
      showCancelButton: true,
      confirmButtonColor: '#416273',
      cancelButtonColor: '#c8ced3',
      confirmButtonText: LS.MSJ_SI_ACEPTAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR,
      allowEnterKey: true,
      allowEscapeKey: true,
    };
  }

  generarSwalHTML(title, type, msje, iconConfirm, textOk) {
    return swal({
      title: title,
      type: type,
      focusConfirm: true,
      confirmButtonColor: '#416273',
      showCancelButton: false,
      showConfirmButton: true,
      html: msje,
      confirmButtonText: "<i class='" + iconConfirm + "'></i>  " + textOk
    });
  }

  generarSwal(title, type, msje) {
    return swal({
      type: type,
      title: title,
      html: msje,
      allowEnterKey: true,
      confirmButtonColor: '#416273',
      allowEscapeKey: true
    });
  }

  generarSwallConfirmacionHtml(parametros) {
    return swal({
      title: parametros.title,
      html: parametros.texto,
      type: parametros.type,
      showCancelButton: true,
      confirmButtonColor: parametros.confirmButtonColor ? parametros.confirmButtonColor : '#416273',
      cancelButtonColor: '#aeb3b7',
      confirmButtonText: parametros.confirmButtonText,
      cancelButtonText: parametros.cancelButtonText,
      allowEnterKey: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.value) {
        return true;
      } else {
        return false;
      }
    });
  }

  generarSwallInputText(parametros) {
    return swal({
      title: parametros.title,
      input: parametros.input,
      inputAttributes: {
        autocapitalize: 'off'
      },
      html: parametros.message,
      showCancelButton: parametros.showCancelButton ? true : false,
      confirmButtonText: parametros.confirmButtonText ? parametros.confirmButtonText : 'Ok',
      cancelButtonText: parametros.cancelButtonText ? parametros.cancelButtonText : null,
      confirmButtonColor: parametros.confirmButtonColor ? parametros.confirmButtonColor : '#416273',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      inputValidator: (result) => {
        if (parametros.input === 'email') {
          return !this.validarEmail(result) && LS.MSJ_VALID_EMAIL;
        } else {
          return !result && LS.MSJ_INGRESE_DATOS_VALIDOS;
        }
      }
    });
  }

  validarEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validarTeclasAgregarFila(keyCode): boolean {
    if (keyCode === LS.KEYCODE_TAB || keyCode === LS.KEYCODE_ENTER) {
      return true;
    }
    return false;
  }

  validarKeyBuscar(keyCode): boolean {
    if (keyCode === LS.KEYCODE_TAB || keyCode === LS.KEYCODE_ENTER) {
      return true;
    }
    return false;
  }

  validarPeriodo(fecha, contexto, empresa) {
    this.api.post("todocompuWS/appWebController/validarPeriodo", fecha, empresa)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeValidarPeriodo(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, 'Aviso');
          contexto.despuesDeValidarPeriodo(null);
        }
      }).catch(err => this.handleError(err, contexto));
  }

  /**
  * Verifica los permisos
  * @param {*} accion
  * @param {*} contexto
  * @param {*} [mostrarMensaje]
  * @returns {boolean}
  * @memberof UtilService
  */
  verificarPermiso(accion, contexto, mostrarMensaje?): Boolean {
    let permiso: Boolean = false;
    let empresa: PermisosEmpresaMenuTO = contexto.empresaSeleccionada;
    switch (accion) {
      case LS.ACCION_CREAR: {
        permiso = empresa.listaSisPermisoTO.gruCrear;
        break;
      }
      case LS.ACCION_CREAR_PC: {//Crear plan de cuentas
        permiso = empresa.listaSisPermisoTO.gruCrear && empresa.listaSisPermisoTO.gruCodigo === 'ADM';
        break;
      }
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_EDITAR: {
        permiso = empresa.listaSisPermisoTO.gruModificar;
        break;
      }
      case LS.ACCION_APROBAR: {
        permiso = empresa.listaSisPermisoTO.gruModificar;
        break;
      }
      case LS.ACCION_EJECUTAR: {
        permiso = empresa.listaSisPermisoTO.gruModificar;
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        permiso = empresa.listaSisPermisoTO.gruModificar;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = empresa.listaSisPermisoTO.gruEliminar;
        break;
      }
      case LS.ACCION_ELIMINAR_PC: {//Eliminar plan de cuentas
        permiso = empresa.listaSisPermisoTO.gruEliminar && empresa.listaSisPermisoTO.gruCodigo === 'ADM';
        break;
      }
      case LS.ACCION_IMPRIMIR: {
        permiso = empresa.listaSisPermisoTO.gruImprimir;
        break;
      }
      case LS.ACCION_EXPORTAR: {
        permiso = empresa.listaSisPermisoTO.gruExportar;
        break;
      }
      case LS.ACCION_DESMAYORIZAR: {
        permiso = empresa.listaSisPermisoTO.gruDesmayorizarContables;
        break;
      }
      case LS.ACCION_MAYORIZAR: {
        permiso = empresa.listaSisPermisoTO.gruMayorizarContables;
        break;
      }
      case LS.ACCION_NOTIFICAR_PROVEEDOR: {
        permiso = true;
        break;
      }
      case LS.ACCION_ANULAR_ORDEN_COMPRA: {
        permiso = empresa.listaSisPermisoTO.gruModificar;
        break;
      }
      case LS.ACCION_APROBAR_ORDEN_COMPRA: {
        permiso = empresa.listaSisPermisoTO.gruModificar;
        break;
      }
      case LS.ACCION_ANULAR: {
        permiso = empresa.listaSisPermisoTO.gruEliminar;
        break;
      }
      case LS.ACCION_RESTAURAR: {
        permiso = empresa.listaSisPermisoTO.gruEliminar;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO);
      contexto.cargando = false;
    }
    return permiso;
  }

  generarCodigoAleatorio(empresaCod, fecha) {
    return empresaCod + '' + fecha.getFullYear() + '' + (fecha.getMonth() + 1)
      + '' + fecha.getDate() + '' + fecha.getHours() + '' + fecha.getMinutes() + '' + fecha.getMilliseconds()
      + '' + Math.floor(Math.random() * (99999 - 10000)) + 10000;
  }

  convertirArrayEnObjeto(arreglo) {
    let objeto = {};
    for (let i = 0; i < arreglo.length; ++i)
      objeto[i] = arreglo[i];
    return objeto;
  }

  convertirMatrizEnLista(matriz) {
    let listaEnviar = [];
    for (let i = 0; i < matriz.length; i++) {
      listaEnviar[i] = this.convertirArrayEnObjeto(matriz[i]);
    }
    return listaEnviar;
  }

  completarCeros(numeroContable) {
    if (numeroContable) {
      let cadena = numeroContable.toString().trim();
      let cadenaCeros = "";
      for (var i = 0; i < (7 - cadena.length); i++) {
        cadenaCeros = cadenaCeros.concat("0");
      }
      return cadenaCeros.concat(cadena);
    }
  };

  completarCeros9(numeroContable) {
    if (numeroContable) {
      let cadena = numeroContable.toString().trim();
      let cadenaCeros = "";
      for (var i = 0; i < (9 - cadena.length); i++) {
        cadenaCeros = cadenaCeros.concat("0");
      }
      return cadenaCeros.concat(cadena);
    }
  };

  soloNumeros(event) {
    return event.charCode >= 48 && event.charCode <= 57
  }

  matRound2(number) {
    number = this.quitarComasNumero(number);
    return Math.round(number * 100) / 100;
  }

  public getColumnaOpciones(tipo?): any {
    return {
      headerName: LS.TAG_OPCIONES,
      headerClass: 'cell-header-center',//Clase a nivel de th
      cellClass: 'text-center',
      width: LS.WIDTH_OPCIONES,
      minWidth: LS.WIDTH_OPCIONES,
      maxWidth: LS.WIDTH_OPCIONES,
      cellRendererFramework: BotonOpcionesComponent,
      headerComponentFramework: TooltipReaderComponent,
      headerComponentParams: {
        class: LS.ICON_OPCIONES,
        tooltip: LS.TAG_OPCIONES,
        text: '',
        enableSorting: false,
      },
      cellRendererParams: { tipo: tipo ? tipo : null },
      pinnedRowCellRenderer: PinnedCellComponent,
    }
  }

  public getColumnaBotonAccion(contexto?): any {
    return {
      headerName: LS.TAG_OPCIONES,
      headerClass: 'cell-header-center',//Clase a nivel de th
      cellClass: 'text-center',
      width: LS.WIDTH_OPCIONES,
      minWidth: LS.WIDTH_OPCIONES,
      cellRendererFramework: BotonAccionComponent,
      cellRendererParams: (params) => {
        return {
          icono: LS.ICON_CONSULTAR,
          tooltip: LS.ACCION_CONSULTAR,
          accion: LS.ACCION_CONSULTAR,
          class: contexto && contexto.accion === LS.ACCION_CONSULTAR ? 'block-div-opacity' : null
        }
      },
      headerComponentFramework: TooltipReaderComponent,
      headerComponentParams: {
        class: LS.ICON_OPCIONES,
        tooltip: LS.TAG_OPCIONES,
        text: '',
        enableSorting: false
      },
      pinnedRowCellRenderer: PinnedCellComponent
    }
  }

  public getColumnaEliminar(tipoUsuario?, contexto?): any {
    return {
      headerName: LS.TAG_OPCIONES,
      headerClass: 'cell-header-center',//Clase a nivel de th
      cellClass: 'text-center',
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      cellRendererFramework: BotonAccionComponent,
      cellRendererParams: (params) => {
        return {
          icono: LS.ICON_ELIMINAR,
          tooltip: LS.ACCION_ELIMINAR,
          accion: LS.ACCION_ELIMINAR,
          class: contexto && contexto.accion === LS.ACCION_CONSULTAR ? 'block-div-opacity' : null,
          data: tipoUsuario ? tipoUsuario : params.data
        }
      },
      headerComponentFramework: TooltipReaderComponent,
      headerComponentParams: {
        class: LS.ICON_OPCIONES,
        tooltip: LS.TAG_OPCIONES,
        text: '',
        enableSorting: false
      },
      pinnedRowCellRenderer: PinnedCellComponent,
    }
  }

  public getSpanSelect(tamanio?): any {
    return {
      headerName: LS.TAG_SELECCIONE,
      headerClass: 'cell-header-center',//Clase a nivel de th
      cellClass: (params) => {
        if (tamanio) {
          if (params.data.cuentaCodigo && params.data.cuentaCodigo.length === tamanio) {
            return 'text-center';
          } else { return 'ag-hidden'; }
        } else {
          return 'text-center';
        }
      },
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      cellRendererFramework: SpanAccionComponent,
      cellRendererParams: (params) => {
        return {
          icono: LS.ICON_SELECCIONAR,
          tooltip: LS.ACCION_SELECCIONAR,
          accion: LS.ACCION_SELECCIONAR,
        }
      },
      headerComponentFramework: TooltipReaderComponent,
      headerComponentParams: {
        class: LS.ICON_SELECCIONAR,
        tooltip: LS.TAG_SELECCIONE,
        text: '',
        enableSorting: false
      },
    }
  }

  establecerLongitudPenultimoGrupo(data): number {
    let longitudPenultimoGrupo: number = 0;
    if (!data[0].estGrupo6) {
      if (!data[0].estGrupo5) {
        if (!data[0].estGrupo4) {
          if (!data[0].estGrupo3) {
            longitudPenultimoGrupo = 0;
            return longitudPenultimoGrupo;
          } else {
            longitudPenultimoGrupo = data[0].estGrupo1 + data[0].estGrupo2
            return longitudPenultimoGrupo;
          }
        } else {
          longitudPenultimoGrupo = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3
          return longitudPenultimoGrupo;
        }
      } else {
        longitudPenultimoGrupo = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4
        return longitudPenultimoGrupo;
      }
    } else {
      longitudPenultimoGrupo = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5
      return longitudPenultimoGrupo;
    }
  }

  public getObjetoSeleccionadoComboOpcional(listaObjetos: Array<any>, objetoCopia: any, columnaCodigo: string): any {
    var objetoSeleccionado = null;
    listaObjetos = listaObjetos.slice();
    if (listaObjetos.length > 0) {//Seleccionar el primer elemento o el anteriormente seleccionado
      let listaFiltrado = objetoCopia ? listaObjetos.filter(item => item[columnaCodigo] === objetoCopia[columnaCodigo]) : [];
      objetoSeleccionado = listaFiltrado.length > 0 ? listaFiltrado[0] : null;
    }
    objetoCopia = null;
    return objetoSeleccionado;
  }

  public getObjetoSeleccionadoComboObligatorio(listaObjetos: Array<any>, objetoCopia: any, columnaCodigo: string): any {
    var objetoSeleccionado = null;
    listaObjetos = listaObjetos.slice();
    if (listaObjetos.length > 0) {//Seleccionar el primer elemento o el anteriormente seleccionado
      let listaFiltrado = objetoCopia ? listaObjetos.filter(item => item[columnaCodigo] === objetoCopia[columnaCodigo]) : [];
      objetoSeleccionado = listaFiltrado.length > 0 ? listaFiltrado[0] : listaObjetos[0];
    }
    objetoCopia = null;
    return objetoSeleccionado;
  }

  arraySum(array) {
    var acum = 0;
    for (var i = 0; i < array.length; i++) {
      acum = acum + array[i];
    }
    return acum;
  }

  public getAGSelectedData(gridApi: GridApi) {
    let selectedData = [];
    if (gridApi) {
      var selectedRows = gridApi.getSelectedRows();
      selectedRows.forEach(function (selectedRow, index) {
        selectedData.push(selectedRow);
      });
    }
    return selectedData;
  }

  desplazarTablaArribaAbajo(keyCode, index, listado): boolean {
    return ((keyCode === LS.KEYCODE_UP && index === 0) || (keyCode === LS.KEYCODE_DOWN && index === listado.length - 1));
  }

  desplazarseInputIzquierdaDerecha(keyCode): boolean {
    return (keyCode === LS.KEYCODE_RIGHT || keyCode === LS.KEYCODE_LEFT);
  }

  obtenerFechaInicioRestando30Dias(fecha) {
    let fechaCopia = new Date(fecha);
    let fecha30DiasMenosMiliSeg = new Date(fechaCopia.setDate(fecha.getDate() - 30));
    fecha30DiasMenosMiliSeg.setMonth(fecha30DiasMenosMiliSeg.getMonth() - 1);

    let fechaRetornar = moment(fecha30DiasMenosMiliSeg).startOf('month').toDate();
    return fechaRetornar;
  }

  /**
   *Obtiene el primer dia del mes
   * @param {*} fecha
   * @returns fecha con el primer día del mes
   * @memberof UtilService
   */
  obtenerPrimerDiaDelMes(fecha) {
    let fechaCopia = new Date(fecha);
    fechaCopia.setDate(1);
    return fechaCopia;
  }

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }

  //EXportar
  cambiarEstadoExportar(listado, exportarTodosEstado) {
    listado.forEach(item => {
      item.check = exportarTodosEstado;
    });
  }

  cambiarEstadoItemExportar(listado, contexto) {
    let isCheckTodos = true;
    listado.forEach(item => {
      !item.check ? isCheckTodos = false : null;
    });
    contexto.exportarTodosEstado = isCheckTodos;
  }

  /**
   * Autoselecciona la empresa
   * @param {Array<PermisosEmpresaMenuTO>} empresas
   * @returns {PermisosEmpresaMenuTO}
   */
  seleccionarEmpresa(empresas: Array<PermisosEmpresaMenuTO>): PermisosEmpresaMenuTO {
    if (empresas && empresas.length > 0) {
      let empresaSeleccionada = empresas.find(item => item.empCodigo == LS.KEY_EMPRESA_SELECT);
      empresaSeleccionada = empresaSeleccionada ? empresaSeleccionada : empresas[0];
      return empresaSeleccionada;
    }
    return null;
  }

  /**
   * Verifico que el formulario haya cambiado con respecto a los valores iniciales.
   * @param {*} valoresIniciales
   * @param {*} formulario
   * @returns {boolean}
   */
  puedoCancelar(valoresIniciales, formulario): boolean {
    let valoresFinales = formulario ? formulario.value : null;
    if (valoresIniciales && valoresFinales) {
      let vi = JSON.stringify(valoresIniciales);
      let vf = JSON.stringify(valoresFinales);
      if (vi !== vf) {
        return false;
      }
    }
    return true;
  }

  /**
   * Compara dos objetos
   * @param {*} datosIniciales
   * @param {*} datosFinales
   * @returns {boolean}
   */
  compararObjetos(datosIniciales, datosFinales): boolean {
    if (datosIniciales && datosFinales) {
      let vi = JSON.stringify(datosIniciales);
      let vf = JSON.stringify(datosFinales);
      if (vi !== vf) {
        return false;
      }
    }
    return true;
  }

  calcularEdad(fecha) {
    if (typeof fecha !== 'undefined' && fecha !== null && fecha !== '') {
      var dia = fecha.getDate();
      var mes = fecha.getMonth() + 1;
      var ano = fecha.getFullYear();
      var fecha_hoy = new Date();
      var ahora_ano = fecha_hoy.getFullYear();
      var ahora_mes = fecha_hoy.getMonth() + 1;
      var ahora_dia = fecha_hoy.getDate();
      var edad = ahora_ano - ano;
      if (ahora_mes < mes) {
        edad--;
      }
      if ((mes === ahora_mes) && (ahora_dia < dia)) {
        edad--;
      }
      if (edad > 1900) {
        edad -= 1900;
      }
      if (edad >= 18 && edad <= 99) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  buscar_EnString(numero: string): boolean {
    let resultado: boolean = numero.indexOf("_") > -1;

    return resultado;
  }

}