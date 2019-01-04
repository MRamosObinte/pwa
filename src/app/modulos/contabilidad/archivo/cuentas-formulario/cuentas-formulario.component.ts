import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';
import { MenuItem } from 'primeng/api';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PlanContableService } from '../plan-contable/plan-contable.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ConEstructuraTO } from '../../../../entidadesTO/contabilidad/ConEstructuraTO';
import { NgForm } from '@angular/forms';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CuentasEstructuraComponent } from '../cuentas-estructura/cuentas-estructura.component';

@Component({
  selector: 'app-cuentas-formulario',
  templateUrl: './cuentas-formulario.component.html',
  styleUrls: ['./cuentas-formulario.component.css']
})
export class CuentasFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() data: any;
  @Output() enviarCancelar: EventEmitter<any> = new EventEmitter();
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  isScreamMd: boolean = true;
  cargando: boolean = false;
  activar: boolean = false;
  opciones: MenuItem[];
  constantes: any = {};
  estado: any = {};
  columnas: Array<any> = [];
  columnasSeleccionadas: Array<any> = [];
  listadoPlanContableImportado: Array<ConCuentasTO> = [];
  listadoFiltradoPlanContableImportado: Array<ConCuentasTO> = [];
  cuentaSeleccionada: ConCuentasTO;
  indexTable: number = 0;
  conEstructuraTO: ConEstructuraTO = new ConEstructuraTO();
  tamanioEstructura: number = 0;
  vistaImportar: boolean = true;
  vistaFormulario: boolean = false;
  codigoEnfocado: boolean = false;
  numero: string = "";

  constructor(
    private filasService: FilasResolve,
    private utilService: UtilService,
    private auth: AuthService,
    private api: ApiRequestService,
    private planContableService: PlanContableService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef
  ) {
    this.constantes = LS;
  }

  ngOnInit() {
    this.generarColumnas();
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    if (this.data && this.data.conEstructuraTO && this.data.tamanioEstructura) {
      this.conEstructuraTO = this.data.conEstructuraTO;
      this.tamanioEstructura = this.data.tamanioEstructura;
      this.vistaFormulario = true;
      this.cambiarActivar(this.activar);
    }
  }

  generarOpciones() {
    this.indexTable = this.listadoPlanContableImportado.indexOf(this.cuentaSeleccionada);
    let permiso = this.utilService.verificarPermiso(LS.ACCION_CREAR, this);
    this.opciones = [
      { label: LS.ACCION_AGREGAR_FILA_ARRIBA, icon: LS.ICON_FLECHA_ARRIBA, disabled: !permiso, command: (event) => permiso ? this.agregarFilaArriba() : null },
      { label: LS.ACCION_AGREGAR_FILA_ABAJO, icon: LS.ICON_FLECHA_ABAJO, disabled: !permiso, command: (event) => permiso ? this.agregarFilaAbajo() : null },
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permiso, command: (event) => permiso ? this.eliminarFila() : null },
    ];
  }

  agregarFilaAbajo() {
    this.cargando = true;
    setTimeout(() => {//Es necesario para mostrar la pantalla cargando
      // Agrega un elemento abajo del actual seleccionado
      let indexInsertar = this.listadoPlanContableImportado.indexOf(this.cuentaSeleccionada);
      this.listadoPlanContableImportado.splice(indexInsertar + 1, 0, this.planContableService.generarConCuentaTO(this.cuentaSeleccionada));
      this.refrescarLista();
    }, 500);
  }

  agregarFilaArriba() {
    this.cargando = true;
    setTimeout(() => {//Es necesario para mostrar la pantalla cargando
      let indexInsertar = this.listadoPlanContableImportado.indexOf(this.cuentaSeleccionada);
      this.listadoPlanContableImportado.splice(indexInsertar, 0, this.planContableService.generarConCuentaTO(this.cuentaSeleccionada));
      this.refrescarLista();
    }, 500);
  }

  eliminarFila() {
    this.cargando = true;
    setTimeout(() => {//Es necesario para mostrar la pantalla cargando
      let indexEliminar = this.listadoPlanContableImportado.indexOf(this.cuentaSeleccionada);
      this.listadoPlanContableImportado = this.listadoPlanContableImportado.filter((val, i) => i != indexEliminar);
      this.refrescarLista();
    }, 500);
  }

  refrescarLista() {
    var listaCopia = this.listadoPlanContableImportado.slice();//Copia todos los elementos
    this.listadoPlanContableImportado = [];
    this.cdRef.detectChanges();
    this.listadoPlanContableImportado = listaCopia;
    this.cargando = false;
    this.actualizarFilas();
  }

  generarColumnas() {
    this.columnas = [
      { field: 'cuentaCodigo', header: LS.TAG_CODIGO, width: '15%' },
      { field: 'cuentaDetalle', header: LS.TAG_DETALLE, width: '75%' },
    ];
    this.columnasSeleccionadas = this.columnas;
  }

  cargarDatosDeArchivo(event) {
    if (event && event.files && event.files.length > 0) {
      this.cargando = true;
      this.limpiarResultado();
      let archivo = event.files[0];
      var reader = new FileReader();
      reader.onload = (e) => {
        var textoCompleto = reader.result;
        this.cargarDatosALista(textoCompleto);
      }
      reader.readAsText(archivo);
    }
  }

  cargarDatosALista(textoCompleto) {
    var lineas = textoCompleto.split('\n');
    let listaCuentaTemp = [];
    for (var index = 0; index < lineas.length; index++) {
      let textoCuenta = lineas[index];
      let cuentaArray = textoCuenta.split(';');
      if (cuentaArray.length === 2) {
        let codigoUsuario = this.auth.getCodigoUser();
        let cuentaTO = new ConCuentasTO({
          cuentaCodigo: cuentaArray[0] + "".trim(),
          empCodigo: this.empresaSeleccionada.empCodigo,
          cuentaDetalle: this.planContableService.formatoCapitalizado(cuentaArray[1] + "".trim(), cuentaArray[0], this.tamanioEstructura).trim(),
          usrInsertaCuenta: codigoUsuario,
          usrFechaInsertaCuenta: null,
        });
        listaCuentaTemp.push(cuentaTO);
      }
    }
    this.listadoPlanContableImportado = listaCuentaTemp;
    this.listadoFiltradoPlanContableImportado = this.listadoPlanContableImportado;
    this.vistaImportar = false;
    this.cdRef.detectChanges();
    this.actualizarFilas();
    this.seleccionarPrimeraFila();
    this.cargando = false;
  }

  guardarPlanCuentas(form: NgForm) {
    this.cargando = true;
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      if (form && this.validarAntesDeEnviar(form)) {
        let parametro = {
          'listadoConCuentasTO': this.formaterListaConCuentasTO(this.listadoPlanContableImportado),
          'empresa': this.empresaSeleccionada.empCodigo
        };
        this.api.post("todocompuWS/contabilidadWebController/insertarListadoConCuentaTO", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
              this.resetearFormulario();
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ERROR);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.cargando = false;
      }
    }
  }

  formaterListaConCuentasTO(listadoConCuentas: Array<ConCuentasTO>): Array<ConCuentasTO> {
    let listaCuentasCopia = listadoConCuentas.slice();
    for (let cuenta of listaCuentasCopia) {
      cuenta.cuentaDetalle = this.planContableService.formatoCapitalizado(cuenta.cuentaDetalle, cuenta.cuentaCodigo, this.tamanioEstructura);
    }
    return listaCuentasCopia;
  }

  validarAntesDeEnviar(form: NgForm): boolean {
    //Validaciones
    let indexResultRep = this.validarCodigosRepetidos(form);
    let indexResultTam = this.validarCodigoTamanio(form);
    let indexResultGru = this.validarCodigoGrupos(form);
    //Muestra los errores
    var errores = this.utilService.obtenerFormErrores(form);
    if (errores.length > 0) {
      this.toastr.warning(this.utilService.remplazarTodo(errores.join(), ",", "<br>"), LS.TAG_AVISO, { enableHtml: true });
      //Enfoca al primer campo con errores
      switch (true) {
        case indexResultRep > -1: {
          this.indexTable = indexResultRep;
          this.codigoEnfocado = true;
          break;
        }
        case indexResultTam > -1: {
          this.indexTable = indexResultTam;
          this.codigoEnfocado = true;
          break;
        }
        case indexResultGru > -1: {
          this.indexTable = indexResultGru;
          this.codigoEnfocado = true;
          break;
        }
      }
      this.cdRef.detectChanges();
      //Fin de enfoque
      return false;
    }
    if (!form.valid) {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      return false;
    }
    return true;
  }

  validarCodigosRepetidos(form: NgForm): number {
    for (let index in this.listadoPlanContableImportado) {
      let cuenta = this.listadoPlanContableImportado[index];
      let listaTemporal = this.listadoPlanContableImportado.filter(item => item != cuenta && item.cuentaCodigo === cuenta.cuentaCodigo);
      if (listaTemporal.length > 0) {
        form.form.controls['cuentaCodigo_' + index].setErrors({ 'duplicado': false });
        return +index;// the unary + converts to number
      }
    }
    return -1;
  }

  validarCodigoTamanio(form: NgForm): number {
    for (let index in this.listadoPlanContableImportado) {
      let cuenta = this.listadoPlanContableImportado[index];
      if (!this.planContableService.verificarPlanCuentaIngresadoCorrectamente(cuenta.cuentaCodigo, this.conEstructuraTO)) {
        form.form.controls['cuentaCodigo_' + index].setErrors({ 'tamanioIncorrecto': false });
        return +index;
      }
    }
    return -1;
  }

  validarCodigoGrupos(form: NgForm): number {
    for (let index in this.listadoPlanContableImportado) {
      let cuenta = this.listadoPlanContableImportado[index];
      if (!this.planContableService.verificarGrupoCuenta(this.listadoPlanContableImportado, cuenta.cuentaCodigo, this.conEstructuraTO)) {
        //No tiene grupo o esta mal ubicado, por lo tanto no es válido
        form.form.controls['cuentaCodigo_' + index].setErrors({ 'grupoIncorrecto': false });
        return +index;
      }
    }
    return -1;
  }

  /** Oculta el formulario y muestra la búsqueda. */
  cancelarAccion() {
    let parametros = {
      title: LS.MSJ_TITULO_CANCELAR,
      texto: LS.MSJ_PREGUNTA_CANCELAR,
      type: LS.SWAL_QUESTION,
      confirmButtonText: LS.MSJ_SI,
      cancelButtonText: LS.MSJ_NO
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona SI
        this.resetearFormulario();
      }
    });
  }

  limpiarResultado() {
    this.listadoFiltradoPlanContableImportado = [];
    this.listadoPlanContableImportado = [];
    this.cuentaSeleccionada = new ConCuentasTO();
    this.actualizarFilas();
  }

  verEstructura(event) {
    event.srcElement.blur();
    event.preventDefault();
    const modalRef = this.modalService.open(CuentasEstructuraComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    modalRef.componentInstance.accion = LS.ACCION_CONSULTAR;
    modalRef.result.then((result) => {
      //Al finalizar
    }, (reason) => {
      //Al cerrar, es necesario  
    });
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(this.activar);
  }

  resetearFormulario() {
    this.empresaSeleccionada = null;
    this.data = null;
    this.activar = false;
    this.limpiarResultado();
    this.vistaFormulario = false;
    this.enviarCancelar.emit();
  }

  onFilterTabla(event) {
    this.listadoFiltradoPlanContableImportado = event.filteredValue;
    this.seleccionarPrimeraFila();
  }

  seleccionarPrimeraFila() {
    if (this.listadoFiltradoPlanContableImportado.length > 0) {
      this.cuentaSeleccionada = this.listadoFiltradoPlanContableImportado[0];
      this.indexTable = 0;
      this.cdRef.detectChanges();
    }
    this.actualizarFilas();
  }

  actualizarIndiceTabla(event) {
    this.indexTable = event;
    this.codigoEnfocado = true;
    this.cdRef.detectChanges();
  }

  detectarCambios() {
    this.cdRef.detectChanges();
  }

  actualizarFilas() {
    this.filasService.actualizarFilas(this.listadoPlanContableImportado.length);
  }
}
