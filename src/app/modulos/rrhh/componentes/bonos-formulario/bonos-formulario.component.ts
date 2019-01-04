import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhListaBonoConceptoTO } from '../../../../entidadesTO/rrhh/RhListaBonoConceptoTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { GridApi } from 'ag-grid';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { BonosService } from '../../transacciones/bonos/bonos.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { RhListaBonosLoteTO } from '../../../../entidadesTO/rrhh/RhListaBonosLoteTO';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { NumericCellComponent } from '../../../componentes/numeric-cell/numeric-cell.component';
import { CheckboxHeaderComponent } from '../../../componentes/checkbox-header/checkbox-header.component';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-bonos-formulario',
  templateUrl: './bonos-formulario.component.html',
  styleUrls: ['./bonos-formulario.component.css']
})
export class BonosFormularioComponent implements OnInit, OnChanges {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  @Input() parametrosFormulario;
  @Input() parametrosBusqueda;
  @Input() esContable: boolean = false;//identifica si es de la vista contable
  @Input() conContable: ConContable = new ConContable();//contable traido del listado de contables
  @Input() tipoSeleccionado: ConTipoTO = new ConTipoTO();//tipo de contable seleccionado
  @Input() data: any = {};
  @Input() titulo: string = LS.RRHH_BONOS_LISTADO;
  @Output() enviarAccion = new EventEmitter();
  //Contable
  public fechaContableValido: boolean = true;
  public conContableCopia: any;

  public constantes: any = LS;
  public activarBonos: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public configAutonumeric: AppAutonumeric;
  public estilos: any = {};
  public total: number = 0;
  public fechaFin: any;
  public accion: string = LS.ACCION_CREAR;
  public inicializandoPiscinas: boolean = true;

  /**Listados */
  @Input() listaResultadoBonos: Array<RhListaBonosLoteTO> = [];
  public listaResultadoEnviarBonos: Array<RhListaBonosLoteTO> = [];
  @Input() listadoConceptos: Array<RhListaBonoConceptoTO> = [];
  @Input() listadoPiscinas: Array<PrdListaPiscinaTO> = [];

  /**Objetos seleccionados */
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO()
  public objetoSeleccionado: RhListaBonosLoteTO = new RhListaBonosLoteTO();
  public conceptoSeleccionado: RhListaBonoConceptoTO = new RhListaBonoConceptoTO();
  public piscinaSeleccionada: PrdListaPiscinaTO = new PrdListaPiscinaTO();

  //Observacion de contable
  public observacionAdicional: string = "";

  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public frameworkComponents;
  public components: any = {};
  public context;
  public screamXS: boolean = true;
  public filtroGlobal = "";
  public pinnedBottomRowData;

  public estadoContableAMayorizar: boolean = false;
  public puedeEditarTabla: boolean = false;

  //Valores para cancelar
  public valoresIniciales: any;
  public listaInicial: any;

  constructor(
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private bonosService: BonosService,
    private archivoService: ArchivoService
  ) {
    this.screamXS = window.innerWidth <= LS.WINDOW_WIDTH_XS ? true : false;
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '99999.99',
      minimumValue: '0',
    };
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - 220px)'
    };
  }

  ngOnChanges(changes) {
    if (changes.parametrosBusqueda || changes.parametrosFormulario) {
      this.inicializar();
    }
  }

  ngOnInit() {
    if (!this.parametrosBusqueda && !this.parametrosFormulario) {
      this.inicializar();
    }
    this.accion = this.esContable ? this.data.accion : LS.ACCION_CREAR;
    this.conContableCopia = this.esContable ? { ...this.conContable } : new ConContable();
    this.esContable ? this.activarBonos = this.data.activar : null;
    this.esContable ? this.estilos.height = 'calc(100vh - 360px)' : null;
    this.esContable ? this.piscinaSeleccionada = null : null;
    this.esContable ? this.conceptoSeleccionado = null : null;
    this.puedeEditarTabla = !this.esContable || this.data.accion === LS.ACCION_MAYORIZAR;
    this.esContable ? this.iniciarAgGrid() : null;
    this.generarAtajosTeclado();
  }

  inicializar() {
    if (this.parametrosBusqueda && this.parametrosFormulario) {
      this.empresaSeleccionada = this.parametrosFormulario.empresaSeleccionada;
      this.listadoConceptos = this.parametrosFormulario.listadoConceptos;
      this.listadoPiscinas = this.parametrosFormulario.listadoPiscinas;
      this.conceptoSeleccionado = this.parametrosFormulario.conceptoSeleccionado;
      this.piscinaSeleccionada = this.parametrosFormulario.piscinaSeleccionada;
      this.fechaFin = this.parametrosFormulario.fechaFin;
      this.activarBonos = this.parametrosBusqueda.activarBonos;
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.buscarBonos();
    }
  }

  inicializarFormulario() {
    setTimeout(() => {
      this.valoresIniciales = this.accion === LS.ACCION_CREAR ?
        JSON.parse(JSON.stringify(this.observacionAdicional)) :
        JSON.parse(JSON.stringify(this.conContable ? this.conContable : null));
      this.listaInicial = JSON.parse(JSON.stringify(this.listaResultadoBonos ? this.listaResultadoBonos : null));
    }, 50);
  }


  accionesBotones(event) {//recepcion de metodos
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.cambiarActivar();
        break;
      case LS.ACCION_CANCELAR:
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

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarBonos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarBonos') as HTMLElement;
      this.gridApi ? this.gridApi.stopEditing() : null;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarActivar() {
    this.activarBonos = !this.activarBonos;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: this.activarBonos });
  }

  //Operaciones
  buscarBonos() {
    if (this.listadoConceptos.length > 0) {
      this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: true });
      this.filasTiempo.iniciarContador();
      this.bonosService.listarBonos(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.warning(LS.MSJ_POR_LO_MENOS_1_CONCEPTO, LS.TAG_AVISO);
      this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
    }
  }

  despuesDeListarBonos(data) {
    this.listaResultadoBonos = data;
    this.filasTiempo.finalizarContador();
    this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
    this.iniciarAgGrid();
    if (this.listaResultadoBonos.length === 0) {
      this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
    }
  }

  guardarBonos() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: true });
      if (this.verificarSiSePuedeEnviar()) {
        let parametro = {
          observaciones: this.observacionAdicional,
          empresa: this.empresaSeleccionada.empCodigo,
          fechaHasta: this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaFin).getTime(),
          listaRhListaBonosLoteTO: this.listaResultadoEnviarBonos
        };
        this.bonosService.insertarBonos(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
      }
    }
  }

  mayorizar() {
    if (this.utilService.verificarPermiso(LS.ACCION_MAYORIZAR, this, true)) {
      this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: true });
      let contable = { ...this.conContableCopia };
      contable.conPendiente = this.estadoContableAMayorizar;
      if (this.verificarSiSePuedeEnviar()) {
        let parametro = {
          conContable: contable,
          listaRhListaBonosLoteTO: this.listaResultadoEnviarBonos
        };
        this.bonosService.modificarRhBono(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
      }
    }
  }

  despuesDeInsertarBonos(data) {
    this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
    if (data) {
      this.preguntarImprimir(data);
    }
  }

  despuesDeModificarBonos(data) {
    this.conContable.conFecha = this.conContableCopia.conFecha;
    this.conContable.conObservaciones = this.conContableCopia.conObservaciones;
    this.conContable.conPendiente = this.estadoContableAMayorizar;
    this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
    if (this.data) {
      if (this.estadoContableAMayorizar) {
        this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, data.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
        this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
      } else {
        this.preguntarImprimir(data);
      }
    }
  }

  preguntarImprimir(data) {
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: data.operacionMensaje + '<br>' + LS.MSJ_PREGUNTA_IMPRIMIR,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_IMPRIMIR + "'></i>  " + LS.LABEL_IMPRIMIR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona Imprimir
        this.imprimirContable(data.extraInfo);
      }
    });
    this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
  }

  ejecutarAccion(data, accion) {
    this.eliminarItem(data);
  }

  eliminarItem(data) {
    if (this.listaResultadoBonos && this.listaResultadoBonos.length > 1) {
      var indexPais = this.listaResultadoBonos.findIndex(item => item.rhListaEmpleadoLoteTO.prId === data.rhListaEmpleadoLoteTO.prId);
      this.listaResultadoBonos.splice(indexPais, 1);
      this.gridApi ? this.gridApi.updateRowData({ remove: [data] }) : null;
      this.calcularTotal();
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

  imprimirContable(data) {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: true });
      let listaPk = [];
      let pk = new ConContablePK();
      pk = data.conContable.conContablePK;
      listaPk.push(pk);
      let parametros = { listadoPK: listaPk };
      this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableIndividual", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('Contable.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.enviarAccion.emit({ accion: LS.ACCION_CARGANDO, estado: false });
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  verificarSiSePuedeEnviar(): boolean {
    let valido = false;
    let cantidadError = 0;
    this.listaResultadoEnviarBonos = [];
    this.gridApi.forEachNode((rowNode) => {
      var data = rowNode.data;
      if (!data.isConceptoValido || !data.isValorValido) {
        cantidadError++;
      }
      if (data.isConceptoValido && data.isValorValido && data.rhListaEmpleadoLoteTO.prValor > 0) {
        data.piscina = data.piscina === "" ? null : data.piscina;
        this.listaResultadoEnviarBonos.push(data);
      }
    });
    if (cantidadError === 0 && this.listaResultadoEnviarBonos.length > 0) {
      valido = true;
    }
    if (this.listaResultadoEnviarBonos.length === 0) {
      let fila = this.gridApi.getRowNode("0");
      let data = fila.data;
      data.isConceptoValido = false;
      data.isValorValido = false;
      this.refreshGrid();
    }
    return valido;
  }

  cancelar() {
    switch (this.accion) {
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_CREAR:
        if (this.sePuedeCancelar()) {
          this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
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
              this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
            }
          });
        }
        break;
      case LS.ACCION_CONSULTAR:
        this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
        break;
      default:
        this.enviarAccion.emit({ accion: LS.ACCION_LIMPIAR_RESULTADO, estado: true });
        break;
    }
  }

  sePuedeCancelar(): boolean {
    let contableValido = false;
    if (this.accion === LS.ACCION_CREAR) {
      contableValido = this.valoresIniciales === this.observacionAdicional;
    } else {
      contableValido = this.utilService.compararObjetos(this.valoresIniciales, this.conContableCopia);
    }
    let listaValida = this.utilService.compararObjetos(this.listaResultadoBonos, this.listaInicial);
    return contableValido && listaValida;
  }

  //Calulos
  calcularTotal() {
    this.total = 0;
    let cantidad = 0;
    this.gridApi.forEachNode((rowNode) => {
      var data = rowNode.data;
      if (data.rhListaEmpleadoLoteTO.prValor === undefined || data.rhListaEmpleadoLoteTO.prValor === null) {
        data.rhListaEmpleadoLoteTO.prValor = 0;
      }
      if (data.rhListaEmpleadoLoteTO.prValor > 0) {
        if (data.concepto) {
          this.total += data.rhListaEmpleadoLoteTO.prValor;
          cantidad++;
          data.isConceptoValido = true;
          data.isValorValido = true;
        } else {
          data.isConceptoValido = false;
          data.isValorValido = true;
        }
      } else {
        data.isConceptoValido = true;
        data.isValorValido = true;
      }
    });
    this.pinnedBottomRowData[0]['observacion'] = cantidad;
    this.refreshGrid();
  }

  alCambiarValorDeCelda(event) {
    if (event.colDef.field === "rhListaEmpleadoLoteTO.prValor" || event.colDef.field === "concepto") {
      this.calcularTotal();
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.bonosService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent,
      numericCell: NumericCellComponent,
      checkHeader: CheckboxHeaderComponent
    };
    this.pinnedBottomRowData = [ //creacion del objeto footer
      {
        prId: '',
        prNombres: '',
        concepto: LS.TAG_TOTAL_PUNTOS,
        prValor: '',
        piscina: LS.TAG_N_BONOS,
        observacion: 0,
        deducible: null
      }
    ];
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimensionarColumnas();
    this.seleccionarFila(0);
    this.inicializandoPiscinas = false;
    this.gridApi ? this.calcularTotal() : null;
    this.inicializarFormulario();
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  seleccionarFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
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
    this.screamXS = window.innerWidth <= LS.WINDOW_WIDTH_XS ? true : false;
  }
}
