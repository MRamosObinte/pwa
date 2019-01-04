import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { RhComboFormaPagoTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoTO';
import { EmpleadosService } from '../../archivo/empleados/empleados.service';
import { RhListaEmpleadoLoteTO } from '../../../../entidadesTO/rrhh/RhListaEmpleadoLoteTO';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { AnticiposService } from '../../transacciones/anticipos/anticipos.service';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { RhAnticipo } from '../../../../entidades/rrhh/RhAnticipo';
import { ConCuentas } from '../../../../entidades/contabilidad/ConCuentas';
import { PrdSector } from '../../../../entidades/produccion/PrdSector';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import { ToastrService } from 'ngx-toastr';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImprimirComponent } from '../../../../componentesgenerales/imprimir/imprimir.component';
import { ContableListadoService } from '../../../contabilidad/transacciones/contable-listado/contable-listado.service';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { ContextMenu } from 'primeng/contextmenu';

@Component({
  selector: 'app-anticipos-formulario',
  templateUrl: './anticipos-formulario.component.html'
})
export class AnticiposFormularioComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() parametrosFormulario: any = {};
  @Output() enviarAccion = new EventEmitter();
  @Input() formasDePago: Array<RhComboFormaPagoTO> = new Array();
  @Input() esContable: boolean = false;
  @Input() listadoAnticipos: Array<RhListaEmpleadoLoteTO> = new Array();
  @Input() conContable: ConContable = new ConContable();
  @Input() tipoSeleccionado: ConTipoTO = new ConTipoTO();
  @Input() data: any = {};
  @Input() titulo: string = LS.TALENTO_HUMANO_ANTICIPOS_EMPLEADOS;
  //contable
  public fechaContableValido: boolean = true;
  public conContableCopia: any;

  public autonumeric92: AppAutonumeric;
  public estilos: any = {};
  public accion: string = LS.ACCION_CREAR;
  public constantes: any = LS;
  public cargando: boolean = false;
  public listadoRhAnticipo: Array<RhAnticipo> = new Array();
  public objetoSeleccionado: RhListaEmpleadoLoteTO = new RhListaEmpleadoLoteTO();
  public fpSeleccionada: RhComboFormaPagoTO;
  public filtroGlobal: string = "";
  public observacionesContable: string = "";
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public estadoContableAMayorizar: boolean = false;
  public puedeEditarTabla: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();

  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public pinnedBottomRowData;
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  //formulario validar cancelar
  @ViewChild("frmDatos") frmDatos: NgForm;
  public valoresIniciales: any;
  public detalleInicial: any;

  constructor(
    private empleadoService: EmpleadosService,
    private filasService: FilasResolve,
    private anticipoService: AnticiposService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private modalService: NgbModal,
    private contableService: ContableListadoService
  ) {
    this.autonumeric92 = this.anticipoService.autonumeric92();
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - 220px)'
    }
  }

  ngOnInit() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.fpSeleccionada = this.parametrosFormulario.fpSeleccionada;
    this.esContable ? this.activar = this.data.activar : null;
    this.esContable ? this.estilos.height = 'calc(100vh - 360px)' : null;
    this.conContableCopia = this.esContable ? { ...this.conContable } : new ConContable();
    this.puedeEditarTabla = !this.esContable || this.data.accion === LS.ACCION_MAYORIZAR;
    this.accion = this.esContable ? this.data.accion : LS.ACCION_CREAR;
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    !this.esContable ? this.listadoAnticipos = new Array() : null;
    this.listadoRhAnticipo = new Array();
    this.definirAtajosDeTeclado();
    if (changes.parametrosFormulario) {
      if (changes.parametrosFormulario.currentValue && changes.parametrosFormulario.currentValue.listar) {//puede listar
        this.getListaEmpleadoLote();
      }
    }
  }

  accionesBotones(event) {//recepcion de metodos
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.activar = false;
        this.cancelar();
        break;
      case LS.ACCION_MAYORIZAR:
        if (!this.fechaContableValido) {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        } else {
          this.estadoContableAMayorizar = event.estado;
          this.mayorizar();
        }
        break;
      case LS.ACCION_IMPRIMIR:
        this.enviarAccion.emit({ accion: LS.ACCION_IMPRIMIR });
        break;
      case LS.ACCION_ANULAR:
        this.enviarAccion.emit({ accion: LS.ACCION_ANULAR });
        break;
      case LS.ACCION_ELIMINAR:
        this.enviarAccion.emit({ accion: LS.ACCION_ELIMINAR });
        break;
      case LS.ACCION_REVERSAR:
        this.enviarAccion.emit({ accion: LS.ACCION_REVERSAR });
        break;
    }
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      this.gridApi ? this.gridApi.stopEditing() : null;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      this.gridApi ? this.gridApi.stopEditing() : null;
      element ? element.click() : null;
      return false;
    }))
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = this.accion === LS.ACCION_CREAR ?
        JSON.parse(JSON.stringify(this.observacionesContable)) :
        JSON.parse(JSON.stringify(this.conContable ? this.conContable : null));
      this.detalleInicial = JSON.parse(JSON.stringify(this.listadoAnticipos ? this.listadoAnticipos : null));
    }, 50);
  }

  cancelar() {
    switch (this.accion) {
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_CREAR:
        if (this.sePuedeCancelar()) {
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
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
              this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
            }
          });
        }
        break;
      case LS.ACCION_CONSULTAR:
        this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        break;
      default:
        this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    }
  }

  sePuedeCancelar(): boolean {
    let contableValido = false;
    if (this.accion === LS.ACCION_CREAR) {
      contableValido = this.valoresIniciales === this.observacionesContable;
    } else {
      contableValido = this.utilService.compararObjetos(this.valoresIniciales, this.conContableCopia);
    }
    let listaValida = this.utilService.compararObjetos(this.listadoAnticipos, this.detalleInicial);
    return contableValido && listaValida;
  }

  getListaEmpleadoLote() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.empleadoService.getListaEmpleadoLote(this.parametrosFormulario, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetListaEmpleadoLote(data) {
    if (data && data.length > 0) {
      this.cargando = false;
      this.listadoAnticipos = this.convetirLote(data);
    } else {
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    }
    this.filasTiempo.finalizarContador();
  }

  convetirLote(data: Array<RhListaEmpleadoLoteTO>): Array<RhListaEmpleadoLoteTO> {
    for (let i = 0; i < data.length; i++) {
      data[i]['prIngresos'] = data[i].prSaldoBonos + data[i].prSueldo;
    }
    return data;
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: !activar });
  }

  guardar() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true) && this.validarAntesDeEnviar()) {
      this.cargando = true;
      let parametro = {
        observacionesContable: this.observacionesContable,
        listaRhAnticipo: this.listadoRhAnticipo,
        fechaHasta: this.parametrosFormulario.fecha
      }
      this.anticipoService.insertarRhAnticipo(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
    }
  }

  mayorizar() {
    if (this.utilService.verificarPermiso(LS.ACCION_MAYORIZAR, this, true) && this.validarAntesDeEnviar()) {
      this.cargando = true;
      let contable = { ...this.conContableCopia };
      contable.conPendiente = this.estadoContableAMayorizar;
      let parametro = {
        conContable: contable,
        listaRhAnticipo: this.listadoRhAnticipo
      }
      this.anticipoService.modificarRhAnticipo(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
    }
  }

  despuesDeInsertarRhAnticipo(data) {
    this.conContable = data.extraInfo.conContable;
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    this.preguntarImprimir(data.operacionMensaje);
    this.cargando = false;
  }

  despuesDeModificarRhAnticipo(data) {
    this.conContable.conFecha = this.conContableCopia.conFecha;
    this.conContable.conObservaciones = this.conContableCopia.conObservaciones;
    this.conContable.conPendiente = this.estadoContableAMayorizar;
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    this.estadoContableAMayorizar ? this.mensajeOk(data.operacionMensaje) : this.preguntarImprimir(data.operacionMensaje);
  }

  mensajeOk(mensaje: string) {
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, mensaje);
    this.cargando = false;
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
  }

  ejecutarAccion(data, accion) {
    this.eliminarItem(data);
  }

  eliminarItem(data) {
    if (this.listadoAnticipos && this.listadoAnticipos.length > 1) {
      var indexPais = this.listadoAnticipos.findIndex(item => item.prId === data.prId);
      this.listadoAnticipos.splice(indexPais, 1);
      this.gridApi ? this.gridApi.updateRowData({ remove: [data] }) : null;
      this.actualizarPinned();
    }
  }

  generarOpciones() {
    let permiso = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this);
    this.opciones = [
      { label: LS.ACCION_ELIMINAR_FILA, icon: LS.ICON_ELIMINAR, disabled: !permiso, command: (event) => permiso ? this.eliminarItem(this.objetoSeleccionado) : null }
    ];
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  preguntarImprimir(texto: string) {
    const modalRef = this.modalService.open(ImprimirComponent, { backdrop: 'static' });
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    //Imprimir contable
    let listaPk = [];
    let pk = new ConContablePK();
    pk = this.conContable.conContablePK;
    listaPk.push(pk);
    modalRef.componentInstance.parametrosImprimir = { listadoPK: listaPk };
    modalRef.componentInstance.nombreRutaImprimir = "todocompuWS/contabilidadWebController/generarReporteContableIndividual";
    modalRef.componentInstance.nombreArchivoPDFImprimir = "ContableAnticipo";
    //Imprimir combo
    modalRef.componentInstance.parametrosImprimirCombo = { listaRhAnticipo: this.listadoRhAnticipo, contable: this.conContable };
    modalRef.componentInstance.nombrerutaImprimirCombo = "todocompuWS/rrhhWebController/generarReporteComprobanteAnticipo";
    modalRef.componentInstance.nombreArchivoPDFImprimirCombo = "ReporteComprobanteAnticipo";
    modalRef.componentInstance.textoImprimirCombo = LS.LABEL_IMPRIMIR_COMPROBANTE_ANTICIPO;
    //Ambos
    modalRef.componentInstance.mensaje = texto;
    modalRef.componentInstance.mostrarCombo = true;

    modalRef.result.then((result) => {
      if (result) {

      } else {
      }
    }, () => {
      this.cargando = false;
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    });
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.anticipoService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.pinnedBottomRowData = this.anticipoService.generarPinnedBottonRowData();
    this.rowSelection = "single";
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
    this.esContable ? this.actualizarPinned() : null;
    this.extraerValoresIniciales();
  }

  //validaciones antes de guardar anticipos
  validarAntesDeEnviar(): boolean {
    let cantidad: number = 0;
    let listadoRhAnticipo: Array<RhAnticipo> = new Array();
    for (let i = 0; i < this.listadoAnticipos.length; i++) {
      if (this.matRound2(this.listadoAnticipos[i].prValor) > 0) {
        if (this.validarRegistro(this.listadoAnticipos[i])) {
          let rhAnticipo = this.construirAnticipo(this.listadoAnticipos[i]);
          listadoRhAnticipo.push(rhAnticipo);
          cantidad++;
        } else {
          this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.TAG_AVISO);
          return false;
        }
      }
    }
    if (cantidad > 0) {
      this.listadoRhAnticipo = listadoRhAnticipo;
      return true;
    }
    this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.TAG_AVISO);
    return false;
  }

  construirAnticipo(data: RhListaEmpleadoLoteTO): RhAnticipo {
    let rhAnticipo: RhAnticipo = new RhAnticipo();
    rhAnticipo.antDocumento = data['documento'];
    rhAnticipo.antObservaciones = data['observacion'];
    rhAnticipo.antValor = data['prValor'];
    rhAnticipo.conContable = null;
    if (this.esContable) {
      rhAnticipo.antSecuencial = data.id;
      rhAnticipo.antAuxiliar = true;
    }
    //empleado
    let empleado: RhEmpleado = new RhEmpleado();
    empleado.rhEmpleadoPK.empEmpresa = LS.KEY_EMPRESA_SELECT;
    empleado.rhEmpleadoPK.empId = data.prId;
    empleado.empNombres = data.prNombres;
    rhAnticipo.rhEmpleado = empleado;
    //sector
    if (data.prSector) {
      let sector: PrdSector = new PrdSector();
      sector.prdSectorPK.secCodigo = data.prSector;
      sector.prdSectorPK.secEmpresa = LS.KEY_EMPRESA_SELECT;
      rhAnticipo.prdSector = sector;
    } else {
      rhAnticipo.prdSector = null;
    }
    //cuenta
    let cuenta: ConCuentas = new ConCuentas();
    cuenta.conCuentasPK.ctaCodigo = data['fpSeleccionada']['ctaCodigo'];
    cuenta.conCuentasPK.ctaEmpresa = LS.KEY_EMPRESA_SELECT;
    rhAnticipo.conCuentas = cuenta;
    return rhAnticipo;
  }

  validarRegistro(data) {
    if (data['fpSeleccionada'] && data['fpSeleccionada']['fpDetalle'] && !data['documentoRepetido'] && !data['errorEnDocumento']) {
      let ingresos = this.matRound2(data.prIngresos);
      let anticipado = this.matRound2(data.prSaldoAnticipos);
      let loquePuedeAnticipar = this.matRound2(ingresos - anticipado);
      let valor = this.matRound2(data.prValor);
      if (valor > loquePuedeAnticipar) {
        return false;
      }
      return true;
    }
    return false;
  }

  actualizarPinned() {
    let total: number = 0;
    let cantidad: number = 0;
    for (let i = 0; i < this.listadoAnticipos.length; i++) {
      if (this.matRound2(this.listadoAnticipos[i].prValor) > 0 && this.validarRegistro(this.listadoAnticipos[i])) {
        total = this.matRound2(total + this.matRound2(this.listadoAnticipos[i].prValor));
        cantidad++;
      }
    }
    this.pinnedBottomRowData[0]['prValor'] = total;
    this.pinnedBottomRowData[0]['documento'] = cantidad;
    this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
  }

  matRound2(number) {
    number = this.utilService.quitarComasNumero(number);
    return Math.round(number * 100) / 100;
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

  terminadoEditar(params) {
    var colId = params.column.getId();
    if (colId === "documento" || colId === "prValor" || colId === "fpSeleccionada") {
      this.verificarDocumentoBanco(params.data);
    }
  }

  //DOCUMENTO 
  verificarDocumentoBanco(data) {
    data.errorEnDocumento = true;//lo inicialiso en falso porque debo asegurarme q no lo marque como verdadero antes de validarlo bien
    this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
    if (data.prValor > 0 && data.documento && data.fpSeleccionada && data.fpSeleccionada.validar) {//si hay valor de anticipo, valor en documento y se tiene q valirdar cuenta
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        documento: data.documento,//documento ingresado en el input
        cuenta: data.fpSeleccionada.ctaCodigo,//cuanta contable de la forma de pago
        data: data //registro cambiado de la tabla, si hay un seleccionado: usar el seleccionado
      }
      this.contableService.verificarDocumentoBanco(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      data.errorEnDocumento = false;//docuemnto valido
      this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
      this.validarDocumentosRepetido();//ver si hay repetidos enla tabla
    }
  }

  despuesDeVerificarDocumento(data, registro) {
    registro.errorEnDocumento = !data;//documento erroneo desde la base de datos
    this.gridApi ? this.gridApi.updateRowData({ update: [registro] }) : null;
    this.validarDocumentosRepetido();//ver si hay repetidos en la tabla
  }

  validarDocumentosRepetido() {
    this.listadoAnticipos.forEach(item => {
      let itemNecesitaVerificacion = item['documento'] && item['prValor'] > 0 && item['fpSeleccionada'] && item['fpSeleccionada']['validar'];//cumple los requisitos para validar registro
      let arrayRepetidos = this.listadoAnticipos.filter(value =>
        (itemNecesitaVerificacion && value['prValor'] > 0 && value['fpSeleccionada'] && value['fpSeleccionada']['validar'] && value['documento'] && value !== item && value['documento'].trim() === item['documento'].trim())
      );
      item['documentoRepetido'] = (arrayRepetidos.length > 0);
    });
    this.actualizarPinned();
    this.refreshGrid();
  }

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

}
