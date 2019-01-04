import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { CorridaService } from '../../archivos/corrida/corrida.service';
import { PrdCorrida } from '../../../../entidades/produccion/PrdCorrida';
import { CorridaListadoService } from './corrida-listado.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Component({
  selector: 'app-corrida-listado',
  templateUrl: './corrida-listado.component.html'
})
export class CorridaListadoComponent implements OnInit {

  @Input() parametrosBusqueda: any = null;//parametros de busqueda 
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  listadoCorridas: Array<PrdCorrida> = [];
  columnasSeleccionadas: Array<any> = [];//listado total de columnas 
  objetoSeleccionado: PrdCorrida;//Objeto seleccionado
  constantes: any = LS;
  innerWidth: number;
  corNumero2: string = "";

  isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
  activar: boolean = false;
  cargando: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();

  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public frameworkComponents;
  public pinnedBottomRowData;
  public rowClassRules;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    public activeModal: NgbActiveModal,
    private corridaService: CorridaService,
    private filasService: FilasResolve,
    private corridaListadoService: CorridaListadoService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private archivoService: ArchivoService
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.corridaListadoService.definirAtajosDeTeclado();
    this.iniciarAgGrid();
  }

  buscarCorridas() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.listadoCorridas = new Array();
    this.corridaService.listarCorridas(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarCorridas(data) {
    this.filasTiempo.finalizarContador();
    this.listadoCorridas = data;
    this.cargando = false;
  }

  consultar() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado);
  }

  generarOpciones() {
    let perConsultar = true;
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, false);
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, false);
    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado) : null
      },
      {
        label: LS.ACCION_EDITAR,
        icon: LS.ICON_EDITAR,
        disabled: !perEditar,
        command: () => perEditar ? this.emitirAccion(LS.ACCION_EDITAR, this.objetoSeleccionado) : null
      },
      {
        label: LS.ACCION_CAMBIAR_CODIGO,
        icon: LS.ICON_EDITAR,
        disabled: !perEditar,
        command: () => perEditar ? this.cambiarCodigo() : null
      },
      {
        label: LS.ACCION_ELIMINAR,
        icon: LS.ICON_ELIMINAR,
        disabled: !perEliminar,
        command: () => perEliminar ? this.eliminar() : null
      }
    ];
  }

  cambiarCodigo() {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_CAMBIAR_CODIGO + this.objetoSeleccionado.prdCorridaPK.corNumero,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ACEPTAR,
      cancelButtonText: LS.MSJ_CANCELAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;

        let parametros = {
          message: LS.TAG_NUEVO_NUMERO_PARA_CORRIDA,
          showCancelButton: true,
          confirmButtonText: LS.MSJ_ACEPTAR,
          cancelButtonText: LS.MSJ_CANCELAR,
          input: 'text',
          inputValue: this.corNumero2
        };
        this.utilService.generarSwallInputText(parametros).then((result) => {
          if (result.value) {
            this.corNumero2 = result.value;
            this.cargando = true;
            let parametro = {
              prdCorridaPK: this.objetoSeleccionado.prdCorridaPK,
              nuevoCodigoPrdCorrida: this.corNumero2
            }
            this.corridaService.cambiarCodigoCorrida(parametro, this, LS.KEY_EMPRESA_SELECT);
          } else {//Cierra el formulario
            this.cargando = false;
          }
        });
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeCambiarCodigoCorrida(data) {
    this.toastr.success(data.operacionMensaje, LS.TOAST_CORRECTO);
    this.objetoSeleccionado.prdCorridaPK.corNumero = this.corNumero2;
    this.gridApi ? this.gridApi.updateRowData({ update: [this.objetoSeleccionado] }) : null;
    this.cargando = false;
  }

  eliminar() {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        let parametro = {
          prdCorrida: this.objetoSeleccionado
        }
        this.corridaService.eliminarCorrida(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeEliminaCorrida(data) {
    this.toastr.success(data.operacionMensaje, LS.TOAST_CORRECTO);
    var indexTemp = this.listadoCorridas.findIndex(item => item.prdCorridaPK.corNumero === this.objetoSeleccionado.prdCorridaPK.corNumero);
    this.listadoCorridas.splice(indexTemp, 1);
    this.gridApi ? this.gridApi.updateRowData({ remove: [this.objetoSeleccionado] }) : null;
    this.cargando = false;
  }

  emitirAccion(accion, seleccionado: PrdCorrida) {
    let parametros = {
      accion: accion,
      objetoSeleccionado: seleccionado
    }
    this.enviarAccion.emit(parametros);
  }

  ngOnChanges(changes) {
    this.corridaListadoService.definirAtajosDeTeclado();
    if (changes.parametrosBusqueda) {
      if (changes.parametrosBusqueda.currentValue && changes.parametrosBusqueda.currentValue.listar) {//puede listar
        this.buscarCorridas();
      } else if (changes.parametrosBusqueda.currentValue && changes.parametrosBusqueda.currentValue.corResultante) {//es entrante por guardado o edicion de objeto
        this.actualizarTabla(changes.parametrosBusqueda.currentValue.corResultante);
      } else { //toca limpiar la lista
        this.listadoCorridas = new Array();
      }
    }
  }

  actualizarTabla(corResultante) {
    let corridaEnLista: PrdCorrida = corResultante;
    let index = corridaEnLista ? this.listadoCorridas.findIndex(item => item.prdCorridaPK.corNumero == corridaEnLista.prdCorridaPK.corNumero) : -1;
    if (index >= 0) {
      this.listadoCorridas[index] = corridaEnLista;
      if (this.gridApi) {
        var rowNode = this.gridApi.getRowNode("" + index);
        rowNode.setData(corridaEnLista);
      }
    } else {
      this.listadoCorridas.unshift(corridaEnLista);
      this.gridApi ? this.gridApi.updateRowData({ add: [corridaEnLista] }) : null;
    }
  }

  cambiarActivar(estado) {
    this.activar = !estado;
    this.enviarActivar.emit(estado);
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        listado: this.listadoCorridas,
        sector: this.parametrosBusqueda.sector,
        piscina: this.parametrosBusqueda.piscina
      };
      this.archivoService.postPDF("todocompuWS/produccionWebController/generarReportePrdCorrida", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data && data._body && data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF("ListadoCorridas_" + this.utilService.obtenerHorayFechaActual() + ".pdf", data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        listado: this.listadoCorridas,
        sector: this.parametrosBusqueda.sector,
        piscina: this.parametrosBusqueda.piscina
      };
      this.archivoService.postExcel("todocompuWS/produccionWebController/exportarPrdCorrida", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data && data._body && data._body.byteLength > 0) {
            this.utilService.descargarArchivoExcel(data._body, "ListadoCorridas_");
          } else {
            this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.corridaListadoService.generarColumnasConsulta();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
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
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

}
