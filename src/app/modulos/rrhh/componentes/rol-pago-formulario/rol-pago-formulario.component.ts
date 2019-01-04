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
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { RhRol } from '../../../../entidades/rrhh/RhRol';
import { ConCuentas } from '../../../../entidades/contabilidad/ConCuentas';
import { PrdSector } from '../../../../entidades/produccion/PrdSector';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import { ToastrService } from 'ngx-toastr';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { RolPagoService } from '../../transacciones/rol-pago/rol-pago.service';
import { ImprimirComponent } from '../../../../componentesgenerales/imprimir/imprimir.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContableListadoService } from '../../../contabilidad/transacciones/contable-listado/contable-listado.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { ComprobanteRolComponent } from '../comprobante-rol/comprobante-rol.component';
import { ConsultarValoresComponent } from './consultar-valores/consultar-valores.component';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { ContextMenu } from 'primeng/contextmenu';
import { ContableRrhhFormularioService } from '../contable-rrhh-formulario/contable-rrhh-formulario.service';

@Component({
  selector: 'app-rol-pago-formulario',
  templateUrl: './rol-pago-formulario.component.html'
})
export class RolPagoFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() parametrosFormulario: any = {};
  @Input() formasDePago: Array<RhComboFormaPagoTO> = new Array();
  @Input() listadoEmpleadosLote: Array<RhListaEmpleadoLoteTO> = new Array();
  @Input() esContable: boolean = false;
  @Input() conContable: ConContable = new ConContable();
  @Input() tipoSeleccionado: ConTipoTO = new ConTipoTO();
  @Input() data: any = {};
  @Input() titulo: string = LS.TALENTO_HUMANO_ROL_DE_PAGOS;
  @Output() enviarAccion = new EventEmitter();
  //contable
  public fechaContableValido: boolean = true;
  public conContableCopia: any;

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  public autonumeric92: AppAutonumeric;
  public autonumeric30: AppAutonumeric;

  public estilos: any = {};
  public estadoContableAMayorizar: boolean = false;
  public puedeEditarTabla: boolean = false;

  public constantes: any = LS;
  public cargando: boolean = false;
  public listadoRhRol: Array<RhRol> = new Array();
  public objetoSeleccionado: RhListaEmpleadoLoteTO = new RhListaEmpleadoLoteTO();
  public fpSeleccionada: RhComboFormaPagoTO;
  public filtroGlobal: string = "";
  public observacionesContable: string = "";
  public activar: boolean = true;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public accion: string = LS.ACCION_CREAR;

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
    private rolPagoService: RolPagoService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private modalService: NgbModal,
    private contableService: ContableListadoService,
    private contableRRHHService: ContableRrhhFormularioService
  ) {
    this.autonumeric92 = this.rolPagoService.autonumeric92();
    this.autonumeric30 = this.rolPagoService.autonumeric30();
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - 220px)'
    }
  }

  ngOnInit() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.fpSeleccionada = this.parametrosFormulario.fpSeleccionada;
    this.periodoSeleccionado = this.parametrosFormulario.periodoSeleccionado;
    this.esContable ? this.activar = this.data.activar : null;
    this.esContable ? this.estilos.height = 'calc(100vh - 355px)' : null;
    this.conContableCopia = this.esContable ? { ...this.conContable } : new ConContable();
    this.puedeEditarTabla = !this.esContable || this.data.accion === LS.ACCION_MAYORIZAR;
    this.accion = this.esContable ? this.data.accion : LS.ACCION_CREAR;
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    !this.esContable ? this.listadoEmpleadosLote = new Array() : null;
    this.listadoRhRol = new Array();
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
          this.cargando = false;
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
      this.detalleInicial = JSON.parse(JSON.stringify(this.listadoEmpleadosLote ? this.listadoEmpleadosLote : null));
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
    let listaValida = this.utilService.compararObjetos(this.listadoEmpleadosLote, this.detalleInicial);
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
      this.listadoEmpleadosLote = this.rolPagoService.establecerPrestamos(data);
      this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: true });
    } else {
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    }
    this.filasTiempo.finalizarContador();
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
        listaRhRol: this.listadoRhRol,
        perHasta: this.parametrosFormulario.perHasta
      }
      this.rolPagoService.insertarRhRol(parametro, this, LS.KEY_EMPRESA_SELECT);
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
        listaRhRol: this.listadoRhRol
      }
      this.rolPagoService.modificarRhRol(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
    }
  }

  despuesDeInsertarRhRol(data) {
    this.conContable = data.extraInfo.conContable;
    this.preguntarImprimir(data.operacionMensaje);
  }

  despuesDeModificarRhRol(data) {
    this.conContable.conFecha = this.conContableCopia.conFecha;
    this.conContable.conObservaciones = this.conContableCopia.conObservaciones;
    this.conContable.conPendiente = this.estadoContableAMayorizar;
    this.estadoContableAMayorizar ? this.mensajeOk(data.operacionMensaje) : this.preguntarImprimir(data.operacionMensaje);
  }

  mensajeOk(mensaje: string) {
    this.utilService.generarSwal(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, mensaje);
    this.cargando = false;
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
  }

  eliminarItem() {
    if (this.listadoEmpleadosLote && this.listadoEmpleadosLote.length > 1 && this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      var indexPais = this.listadoEmpleadosLote.findIndex(item => item.prId === this.objetoSeleccionado.prId);
      this.listadoEmpleadosLote.splice(indexPais, 1);
      this.gridApi ? this.gridApi.updateRowData({ remove: [this.objetoSeleccionado] }) : null;
      this.actualizarPinned();
    }
  }

  ejecutarAccion() {
    this.consultarComprobante();
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
    modalRef.componentInstance.nombreArchivoPDFImprimir = "ContableRol";
    //Imprimir combo
    modalRef.componentInstance.parametrosImprimirCombo = { contablePK: this.conContable.conContablePK };
    modalRef.componentInstance.nombrerutaImprimirCombo = "todocompuWS/rrhhWebController/generarReporteComprobanteRol";
    modalRef.componentInstance.nombreArchivoPDFImprimirCombo = "ReporteComprobanteRol";
    modalRef.componentInstance.textoImprimirCombo = LS.LABEL_IMPRIMIR_COMPROBANTE_ROL;
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
    this.columnDefs = this.rolPagoService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.pinnedBottomRowData = this.rolPagoService.generarPinnedBottonRowData();
    this.rowSelection = "single";
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
    this.actualizarPinned();
    this.extraerValoresIniciales();
  }

  validarAntesDeEnviar(): boolean {
    let cantidad: number = 0;
    let listadoRhRol: Array<RhRol> = new Array();
    for (let i = 0; i < this.listadoEmpleadosLote.length; i++) {
      if (this.esContable && !(this.listadoEmpleadosLote[i]['fpSeleccionada'] && this.listadoEmpleadosLote[i]['fpSeleccionada']['fpDetalle'])) {
        this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.TAG_AVISO);
        return false;
      };
      if (this.validarRegistro(this.listadoEmpleadosLote[i])) {
        let RhRol = this.construirRol(this.listadoEmpleadosLote[i]);
        listadoRhRol.push(RhRol);
        cantidad++;
      } else {
        if (this.esContable) {
          this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.TAG_AVISO);
          return false;
        }
      }
    }
    if (cantidad > 0) {
      this.listadoRhRol = listadoRhRol;
      return true;
    }
    this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.TAG_AVISO);
    return false;
  }

  construirRol(data: RhListaEmpleadoLoteTO): RhRol {
    let rhRol: RhRol = new RhRol();
    rhRol.rolFechaUltimoSueldo = data.prFechaUltimoSueldo;
    rhRol.rolAnticipos = data.prSaldoAnticipos;
    rhRol.rolHorasExtras = data['horas50'] ? this.utilService.quitarComasNumero(data['horas50']) : 0;
    rhRol.rolHorasExtras100 = data['horas100'] ? this.utilService.quitarComasNumero(data['horas100']) : 0;
    rhRol.rolDiasFaltasReales = data['diasFalta'] ? this.utilService.quitarComasNumero(data['diasFalta']) : 0;
    rhRol.rolDescuentoPermisoMedico = data['rolDescuentoPermisoMedico'] ? this.utilService.quitarComasNumero(data['rolDescuentoPermisoMedico']) : 0;
    rhRol.rolPrestamos = data['prestamos'] ? this.utilService.quitarComasNumero(data['prestamos']) : 0;
    rhRol.rolPrestamoQuirografario = data['prestamosQ'] ? this.utilService.quitarComasNumero(data['prestamosQ']) : 0;
    rhRol.rolPrestamoHipotecario = data['prestamosH'] ? this.utilService.quitarComasNumero(data['prestamosH']) : 0;
    rhRol.rolFormaPago = data['fpSeleccionada']['fpDetalle'];
    rhRol.rolDocumento = data['documento'] ? data['documento'] : null;
    rhRol.rolObservaciones = data['observacion'] ? data['observacion'] : null;
    rhRol.empCargo = data.prCargo;
    rhRol.empSueldo = data.prSueldo;
    rhRol.conContable = null;
    if (this.esContable) {
      rhRol.rolDesde = data['desde'];
      rhRol.rolHasta = data['hasta'];
      rhRol.rolAuxiliar = true;
      rhRol.rolSecuencial = data.id;
      rhRol.rolDiasPermisoMedico = data['diasPermiso'];
      rhRol.rolDiasExtrasReales = data['rolDiasExtrasReales'];
      rhRol.rolLiqFondoReserva = data['rolLiqFondoReserva'];
      rhRol.rolLiqXiii = data['rolLiqXiii'];
      rhRol.rolLiqXiv = data['rolLiqXiv'];
      rhRol.rolLiqVacaciones = data['rolLiqVacaciones'];
      rhRol.rolLiqSalarioDigno = data['rolLiqSalarioDigno'];
      rhRol.rolLiqBonificacion = data['rolLiqBonificacion'];
      rhRol.rolLiqDesahucio = data['rolLiqDesahucio'];
      rhRol.rolLiqDesahucioIntempestivo = data['rolLiqDesahucioIntempestivo'];
      rhRol.rolBonos = data['rolBono'];
      rhRol.rolAnticipos = data['rolAnticipo'];
      rhRol.rolSaldoAnterior = data.prSaldoAnterior;
      rhRol.conContableProvision = data['contableProvision'];
      //completar lo demas
    } else {
      rhRol.conContableProvision = null;
      rhRol.rolDesde = data.prFechaIngreso && data.prFechaIngreso > this.periodoSeleccionado.perDesde ? data.prFechaIngreso : this.periodoSeleccionado.perDesde;
      rhRol.rolHasta = data['hasta'] ? this.utilService.formatoDateSinZonaHorariaYYYMMDD(data['hasta']).getTime() : this.periodoSeleccionado.perHasta;
    }
    //empleado
    let empleado: RhEmpleado = new RhEmpleado();
    empleado.rhEmpleadoPK.empEmpresa = LS.KEY_EMPRESA_SELECT;
    empleado.rhEmpleadoPK.empId = data.prId;
    empleado.empNombres = data.prNombres;
    rhRol.rhEmpleado = empleado;
    //sector
    if (data.prSector) {
      let sector: PrdSector = new PrdSector();
      sector.prdSectorPK.secCodigo = data.prSector;
      sector.prdSectorPK.secEmpresa = LS.KEY_EMPRESA_SELECT;
      rhRol.prdSector = sector;
    } else {
      rhRol.prdSector = null;
    }
    //cuenta
    let cuenta: ConCuentas = new ConCuentas();
    cuenta.conCuentasPK.ctaCodigo = data['fpSeleccionada']['ctaCodigo'];
    cuenta.conCuentasPK.ctaEmpresa = LS.KEY_EMPRESA_SELECT;
    rhRol.conCuentas = cuenta;
    return rhRol;
  }

  validarRegistro(data) {
    if (data['fpSeleccionada'] && data['fpSeleccionada']['fpDetalle']
      && !data['documentoRepetido'] && !data['errorEnDocumento']
      && this.rolPagoService.validarDias(data)
      && this.rolPagoService.validarPermiso(data)
      && data.prestamos <= data.prSaldoPrestamos) {
      return true;
    }
    return false;
  }

  actualizarPinned() {
    //this.fpSeleccionada = null;
    let cantidad: number = 0;
    for (let i = 0; i < this.listadoEmpleadosLote.length; i++) {
      if (this.validarRegistro(this.listadoEmpleadosLote[i])) {
        cantidad++;
      }
    }
    this.pinnedBottomRowData[0]['documento'] = cantidad;
    this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
  }

  matRound2(number) {
    number = this.utilService.quitarComasNumero(number);
    return Math.round(number * 100) / 100;
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

  generarOpciones() {
    let consultarComprobante = true;
    let eliminar = this.esContable && this.puedeEditarTabla;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !consultarComprobante, command: () => consultarComprobante ? this.consultarComprobante() : null }
    ];
    if (eliminar) {
      this.opciones.push(
        { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !eliminar, command: () => eliminar ? this.eliminarItem() : null }
      );
    }
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
    if (colId === "prestamos" || colId === "rolDescuentoPermisoMedico" || colId === "diasFalta") {
      this.actualizarPinned();
    }
    if (colId === "documento" || colId === "fpSeleccionada") {
      if (colId === "fpSeleccionada") {
        this.fpSeleccionada = null;
      }
      this.verificarDocumentoBanco(params.data);
    }
  }

  //DOCUMENTO 
  verificarDocumentoBanco(data) {
    data.errorEnDocumento = true;//docuemnto valido
    this.gridApi ? this.gridApi.updateRowData({ update: [data] }) : null;
    if (data.documento && data.fpSeleccionada && data.fpSeleccionada.validar) {//si hay valor de anticipo, valor en documento y se tiene q valirdar cuenta
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
    this.listadoEmpleadosLote.forEach(item => {
      let itemNecesitaVerificacion = item['documento'] && item['fpSeleccionada'] && item['fpSeleccionada']['validar'];//cumple los requisitos para validar registro
      let arrayRepetidos = this.listadoEmpleadosLote.filter(value =>
        (itemNecesitaVerificacion && value['fpSeleccionada'] && value['fpSeleccionada']['validar'] && value['documento'] && value !== item && value['documento'].trim() === item['documento'].trim())
      );
      item['documentoRepetido'] = (arrayRepetidos.length > 0);
    });
    this.actualizarPinned();
    this.refreshGrid();
  }

  //COMPROBANTE
  consultarComprobante() {
    if (this.validarRegistro(this.objetoSeleccionado)) {
      let parametros = {
        empresa: this.empresaSeleccionada.empCodigo,
        idEmpleado: this.objetoSeleccionado.prId,
        rol: this.construirRol(this.objetoSeleccionado)
      };
      const modalRef = this.modalService.open(ComprobanteRolComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.parametros = parametros;
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.componentInstance.accion = LS.ACCION_CONSULTAR;
      modalRef.componentInstance.titulo = LS.TAG_VISTA_PRELIMINAR_ROL;
      modalRef.componentInstance.vistaPreliminar = true;
      modalRef.componentInstance.puedeEditar = this.puedeEditarTabla;
      modalRef.componentInstance.rutaImprimir = 'todocompuWS/rrhhWebController/imprimirComprobanteRolListado';
      modalRef.result.then((result) => {
        if (result && result.isFechaValido) {
          this.objetoSeleccionado['hasta'] = this.utilService.formatoDateSinZonaHorariaYYYMMDD(result.rolHastaTexto).getTime();
          let rol: RhRol = this.construirRol(this.objetoSeleccionado);
          this.cargando = true;
          let parametros = {
            rol: rol
          }
          this.rolPagoService.completarDatosDelRolDePago(parametros, this, LS.KEY_EMPRESA_SELECT);
        }
      }, () => {
      });
    } else {
      this.toastr.warning(LS.MSJ_INGRESE_DATOS_VALIDOS, LS.TAG_AVISO);
    }
  }

  despuesDeCompletarDatosDelRolDePago(data) {
    let objetoSeleccionado = this.contableRRHHService.construirEmpleadosPorLoteAPartirDeUnRol(data, this.formasDePago);
    if (this.listadoEmpleadosLote && this.listadoEmpleadosLote.length > 1) {
      var index = this.listadoEmpleadosLote.findIndex(item => item.prId === objetoSeleccionado.prId);
      this.listadoEmpleadosLote[index] = objetoSeleccionado;
      if (this.gridApi) {
        var rowNode = this.gridApi.getRowNode("" + index);
        rowNode.setData(objetoSeleccionado);
      }
      this.actualizarPinned();
    }
    this.cargando = false;
  }

  //CALCULOS EN MODAL
  calcularValores() {
    if (this.validarAntesDeEnviar()) {
      this.cargando = true;
      let parametro = {
        listado: this.listadoRhRol,
        empresa: this.empresaSeleccionada.empCodigo
      }
      this.rolPagoService.calcularValoresRolesPago(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
    }
  }

  despuesDeCalcularValoresRolesPago(data) {
    this.cargando = false;
    const modalRef = this.modalService.open(ConsultarValoresComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.parametros = data;
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    modalRef.componentInstance.titulo = LS.TAG_VALORES_CALCULADOS;
    modalRef.result.then((result) => {
    }, () => {
    });
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

}
