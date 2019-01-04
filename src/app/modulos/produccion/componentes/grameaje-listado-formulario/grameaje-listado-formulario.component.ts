import { Component, OnInit, Input, HostListener, EventEmitter, Output, ViewChild, OnChanges } from '@angular/core';
import { GridApi } from 'ag-grid';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { LS } from '../../../../constantes/app-constants';
import { GrameajeService } from '../../transacciones/grameaje/grameaje.service';
import { PiscinaGrameajeTO } from '../../../../entidadesTO/Produccion/PiscinaGrameajeTO';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PrdGrameaje } from '../../../../entidades/produccion/PrdGrameaje';
import { PrdPiscina } from '../../../../entidades/produccion/PrdPiscina';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { PrdGrameajeTO } from '../../../../entidadesTO/Produccion/PrdGrameajeTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';

@Component({
  selector: 'app-grameaje-listado-formulario',
  templateUrl: './grameaje-listado-formulario.component.html',
  styleUrls: ['./grameaje-listado-formulario.component.css']
})
export class GrameajeListadoFormularioComponent implements OnInit, OnChanges {
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public sectorSeleccionado: PrdListaSectorTO;
  public fechaHasta: any;

  @Input() parametrosGramaje;
  @Output() enviarAccion = new EventEmitter();

  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public rowClassRules: any = {};
  //
  public filtroGlobal: string = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filaSeleccionada: PiscinaGrameajeTO;
  public activarGramaje: boolean = false;
  //
  public isScreamMd: boolean = true;
  public constantes: any = {};
  public cargando: boolean = false;
  //PARAMETROS LISTA
  public autonumeric92: AppAutonumeric;
  public puedeEditar: boolean = false;
  //Listado
  public listaResultado: Array<PiscinaGrameajeTO> = [];
  public listaInicial: Array<PiscinaGrameajeTO> = [];
  public listaGramajeEnviar: Array<PrdGrameaje> = new Array();
  //Advertencias
  public sobrevivenciaActualAdvertencia: boolean = false;

  // MENU
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];

  constructor(
    private filasService: FilasResolve,
    private gramajeService: GrameajeService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private atajoService: HotkeysService,
    private api: ApiRequestService,
  ) {
    this.autonumeric92 = this.gramajeService.autonumeric92();
  }

  ngOnChanges(changes) {
    if (changes.parametrosGramaje) {
      this.iniciar();
      this.iniciarAgGrid();
      this.generarAtajos();
    }
  }

  ngOnInit() {
    this.constantes = LS;
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  iniciar() {
    this.listaResultado = this.parametrosGramaje.listaResultado;
    this.fechaHasta = this.parametrosGramaje.fechaHasta;
    this.sectorSeleccionado = this.parametrosGramaje.sectorSeleccionado;
    this.empresaSeleccionada = this.parametrosGramaje.empresaSeleccionada;
  }

  inicializarFormulario() {
    setTimeout(() => {
      this.listaInicial = JSON.parse(JSON.stringify(this.listaResultado ? this.listaResultado : null));
    }, 50);
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.gramajeService.generarColumnas(this);
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent
    };
    this.context = { componentParent: this };
    this.components = {};
    this.rowClassRules = {
      'cell-block': function (params) {
        if (params.data.graPesoActual && params.data.graBiomasa && params.graSobrevivencia) {
          return true;
        }
        return false;
      }
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
    this.inicializarFormulario();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[5];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    let filasFocusedCell = this.gridApi ? this.gridApi.getFocusedCell() : null;
    let columna = filasFocusedCell ? filasFocusedCell.column : null;
    this.gridApi ? columna ? this.gridApi.startEditingCell({ rowIndex: event.rowIndex, colKey: columna.getId() }) : null : null;
    this.filaSeleccionada = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  ejecutarAccion(data) {
    this.filaSeleccionada = data;
    this.eliminarGramaje(this.filaSeleccionada);
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
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
      element ? element.click() : null;
      return false;
    }))
  }

  //Calculos
  /**Método que se ejecuta cuando se termina de ingresar un valor a la tabla*/
  terminadoEditar(params) {
    var colId = params.column.getId();
    if (colId === "graSobrevivencia" || colId === "graPesoActual") {
      if (colId === "graPesoActual") {
        params.data.isMenorQuePesoAnterior = this.gramajeService.verificarPeso(params.data);
        this.refreshGrid();
      }
      if (colId === "graSobrevivencia") {
        params.data.isMayorQueSobrevivenciaAnterior = this.gramajeService.verificarSobrevivencia(params.data);
        this.refreshGrid();
      }
      this.calculoBiomasa(params.data);
      if (params.data.graPesoActual > 0) {
        this.calculosAnimalesM2(params.data);
      }
    }
    if (colId === "graAnimalesM2") {
      this.calculoSobrevivencia(params.data);
    }
  }

  calculoBiomasa(piscina) {
    if (piscina.graSobrevivencia > 100) {
      piscina.graSobrevivencia = 0;
      this.toastr.warning(LS.MSJ_VALOR_SOBREVIVENCIA_MAYOR_CIEN, LS.TOAST_INFORMACION);
    }
    piscina.graBiomasa = this.gramajeService.calculoGramajeBiomasa(piscina);
    this.refreshGrid();
  }

  calculosAnimalesM2(piscina) {
    piscina.graAnimalesM2 = this.gramajeService.calculoGramajeAnimalesM2(piscina);
    this.refreshGrid();
  }

  calculoSobrevivencia(piscina) {
    piscina.graSobrevivencia = this.gramajeService.calculoGramajeAnimalesM2Sobrevivencia(piscina);
    this.refreshGrid();
    if (piscina.graSobrevivencia > 100) {
      piscina.graSobrevivencia = 0;
      piscina.graAnimalesM2 = 0;
      this.toastr.warning(LS.MSJ_VALOR_SOBREVIVENCIA_MAYOR_CIEN, LS.TOAST_INFORMACION);
    }
    this.calculoBiomasa(piscina);
  }

  //Operaciones
  /**Método para insertar gramaje*/
  insertarGrameajeListado() {
    this.cargando = true;
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true) && this.validarAntesDeEnviar()) {
      if (this.sobrevivenciaActualAdvertencia) {
        this.preguntarInsertar();
      } else {
        this.insertar();
      }
    } else {
      this.cargando = false;
    }
  }

  preguntarInsertar() {
    let parametros = {
      title: LS.TOAST_ADVERTENCIA,
      texto: LS.MSJ_SOBREVIVENCIA_ACTUAL_NO_PUEDE_SER_MAYOR_ANTERIOR + '<br>' + LS.MSJ_PREGUNTA_CONTINUAR + "<br>",
      type: LS.SWAL_WARNING,
      confirmButtonText: "<i class='" + LS.ICON_CONTINUAR + "'></i>  " + LS.LABEL_CONTINUAR,
      cancelButtonText: LS.LABEL_CANCELAR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona Imprimir
        this.insertar();
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  insertar() {
    this.cargando = true;
    let parametro = { listaGrameajes: this.listaGramajeEnviar, fecha: this.utilService.convertirFechaStringYYYYMMDD(this.fechaHasta) }
    this.gramajeService.insertarGramajeListado(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeInsertarGramaje(data) {
    this.cargando = false;
    this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, data.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
  }

  /**Método para eliminar gramaje*/
  eliminarGramaje(itemSeleccionado) {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {
          this.cargando = true;
          let gramajeSeleccionado = this.construirGramaje(itemSeleccionado);
          let parametro = { prdGrameaje: gramajeSeleccionado };
          this.gramajeService.eliminarGramaje(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.cargando = false;
        }
      });
    }
  }

  despuesDeEliminarGramaje(respuesta) {
    this.cargando = false;
    this.utilService.generarSwalHTML(LS.SWAL_CORRECTO, LS.SWAL_SUCCESS, respuesta.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
    this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
  }

  /**Método para cancelar operación*/
  cancelar() {
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
  }


  sePuedeCancelar(): boolean {
    return this.utilService.compararObjetos(this.listaInicial, this.listaResultado);
  }


  cambiarActivar() {
    this.activarGramaje = !this.activarGramaje;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: this.activarGramaje });
  }

  //Metodos antes de guardar
  /** Método que construye la fila antes de eliminar de PiscinaGramajeTO a PrdGramajeTO*/
  construirGramaje(data: PiscinaGrameajeTO): PrdGrameaje {
    let gramaje: PrdGrameaje = new PrdGrameaje();
    gramaje.graTpromedio = data['graPesoActual'];
    gramaje.graTgrande = data['graPesoActual'];
    gramaje.graItgrande = data['graPesoActual'];
    gramaje.graIpromedio = data['graPesoActual'];
    gramaje.graBiomasa = data['graBiomasa'];
    gramaje.graSobrevivencia = data['graSobrevivencia'];
    gramaje.graComentario = data['graComentario'];
    gramaje.prdGrameajePK.graEmpresa = this.empresaSeleccionada.empCodigo;
    gramaje.prdGrameajePK.graSector = this.sectorSeleccionado.secCodigo;
    gramaje.prdGrameajePK.graPiscina = data['graPiscinaCodigo'];
    gramaje.prdGrameajePK.graFecha = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaHasta).getTime();
    gramaje.prdPiscina = this.construirPiscina(data);
    return gramaje;
  }

  /** Método que construye el parámetro piscina para la insertación de la fila*/
  construirPiscina(data) {
    let piscina: PrdPiscina = new PrdPiscina();
    piscina.prdPiscinaPK.pisEmpresa = this.empresaSeleccionada.empCodigo;
    piscina.prdPiscinaPK.pisNumero = data['graPiscinaCodigo']
    piscina.prdPiscinaPK.pisSector = this.sectorSeleccionado.secCodigo;
    piscina.pisNombre = data['graPiscinaNombre'];
    return piscina;
  }

  /** Método que recorre la lista y almacena las filas que van insertarse. Retorna un boolean (true) cuando es correcto*/
  validarAntesDeEnviar(): boolean {
    this.listaGramajeEnviar = [];
    this.sobrevivenciaActualAdvertencia = false;
    this.gridApi.forEachNode((rowNode) => {
      var data: PiscinaGrameajeTO = rowNode.data;
      if (data.graBiomasa > 0 && data.graSobrevivencia > 0 && !data.noEditable) {
        let gramaje = this.construirGramaje(data);
        this.listaGramajeEnviar.push(gramaje);
      }
      if (data.graSobrevivencia > data.graSobrevivenciaAnterior) {
        this.sobrevivenciaActualAdvertencia = true;
      }
    });
    if (this.listaGramajeEnviar.length > 0) {
      return true;
    }
    this.toastr.warning(LS.MSJ_INGRESAR_FILA_VALIDA, LS.TAG_AVISO);
    return false;
  }

}
