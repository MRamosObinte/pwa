import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConsumoService } from '../../transacciones/consumo/consumo.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ConsumoListadoService } from './consumo-listado.service';
import { InvListaConsultaConsumosTO } from '../../../../entidadesTO/inventario/InvListaConsultaConsumosTO';
import { ConsumoFormularioService } from '../consumo-formulario/consumo-formulario.service';
import { InvConsumosTO } from '../../../../entidadesTO/inventario/InvConsumosTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consumo-listado',
  templateUrl: './consumo-listado.component.html'
})
export class ConsumoListadoComponent implements OnInit {

  @Input() parametrosBusqueda: any = null;//parametros de busqueda 
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  listadoConsumos: Array<InvListaConsultaConsumosTO> = [];
  columnasSeleccionadas: Array<any> = [];//listado total de columnas 
  objetoSeleccionado: InvListaConsultaConsumosTO;//Objeto seleccionado
  constantes: any = LS;
  innerWidth: number;
  veces: number = 0;

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
  public rowClassRules;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    public activeModal: NgbActiveModal,
    private consumoService: ConsumoService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private consumoListadoService: ConsumoListadoService,
    private consumoFormularioService: ConsumoFormularioService,
    private archivoService: ArchivoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.consumoListadoService.definirAtajosDeTeclado();
    this.iniciarAgGrid();
  }

  buscarConsumos() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.listadoConsumos = new Array();
    this.consumoService.listarConsumos(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarConsumos(data) {
    this.filasTiempo.finalizarContador();
    this.listadoConsumos = data;
    this.cargando = false;
  }

  consultar() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado);
  }

  generarOpciones() {
    let perConsultar = true;
    let perDesmayorizar = this.consumoService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada) && (!this.objetoSeleccionado.consStatus || this.objetoSeleccionado.consStatus === " ");
    let perMayorizar = this.consumoService.verificarPermiso(LS.ACCION_MAYORIZAR, this.empresaSeleccionada) && this.objetoSeleccionado.consStatus === 'PENDIENTE';
    let perAnular = this.consumoService.verificarPermiso(LS.ACCION_ANULAR, this.empresaSeleccionada) && this.objetoSeleccionado.consStatus !== 'ANULADO' && this.objetoSeleccionado.consStatus !== 'PENDIENTE';
    let perRestaurar = this.consumoService.verificarPermiso(LS.ACCION_RESTAURAR, this.empresaSeleccionada) && this.objetoSeleccionado.consStatus === 'ANULADO';
    let perImprimir = this.consumoService.verificarPermiso(LS.ACCION_IMPRIMIR, this.empresaSeleccionada);
    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado) : null
      },
      {
        label: LS.ACCION_DESMAYORIZAR,
        icon: LS.ICON_DESMAYORIZAR,
        disabled: !perDesmayorizar,
        command: () => perDesmayorizar ? this.desmayorizar() : null
      },
      {
        label: LS.ACCION_MAYORIZAR,
        icon: LS.ICON_MAYORIZAR,
        disabled: !perMayorizar,
        command: () => perMayorizar ? this.emitirAccion(LS.ACCION_MAYORIZAR, this.objetoSeleccionado) : null
      },
      {
        label: LS.ACCION_ANULAR,
        icon: LS.ICON_ANULAR,
        disabled: !perAnular,
        command: () => perAnular ? this.emitirAccion(LS.ACCION_ANULAR, this.objetoSeleccionado) : null
      },
      {
        label: LS.ACCION_RESTAURAR,
        icon: LS.ICON_RESTAURAR,
        disabled: !perRestaurar,
        command: () => perRestaurar ? this.emitirAccion(LS.ACCION_RESTAURAR, this.objetoSeleccionado) : null
      },
      {
        label: LS.ACCION_IMPRIMIR,
        icon: LS.ICON_IMPRIMIR,
        disabled: !perImprimir,
        command: () => perImprimir ? this.imprimirSolito() : null
      }
    ];
  }

  emitirAccion(accion, seleccionado: InvListaConsultaConsumosTO) {
    let parametros = {
      accion: accion,
      objetoSeleccionado: seleccionado
    }
    this.enviarAccion.emit(parametros);
  }

  desmayorizar() {
    let comprobante: Array<string> = this.objetoSeleccionado.consNumero.split("|");
    let periodo = comprobante[0];
    let motivo = comprobante[1];
    let numero = comprobante[2];
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      periodo: periodo,
      motivo: motivo,
      numero: numero
    }
    this.cargando = true;
    this.consumoService.desmayorizarConsumo(parametro, this, LS.KEY_EMPRESA_SELECT);
  };

  despuesDeDesmayorizarConsumo(data) {
    this.objetoSeleccionado.consStatus = "PENDIENTE";
    let parametros = {
      title: LS.TOAST_CORRECTO,
      texto: data.operacionMensaje + '<br>' + LS.MSJ_PREGUNTA_MAYORIZAR,
      type: LS.SWAL_SUCCESS,
      confirmButtonText: "<i class='" + LS.ICON_MAYORIZAR + "'></i>  " + LS.ACCION_MAYORIZAR,
      cancelButtonText: LS.LABEL_SALIR
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = false;
        this.actualizarTabla(this.objetoSeleccionado);
        this.emitirAccion(LS.ACCION_MAYORIZAR, this.objetoSeleccionado);
      } else {//Cierra el formulario
        this.actualizarTabla(this.objetoSeleccionado);
        this.cargando = false;
      }
    });
  };

  demayorizarLote() {
    if (this.consumoService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada, false)) {
      this.cargando = true;
      let consultaconsumo = this.utilService.getAGSelectedData(this.gridApi);
      if (consultaconsumo && consultaconsumo.length === 0) {
        this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let parametro = {
          listadoConsumos: consultaconsumo,
          empresa: LS.KEY_EMPRESA_SELECT
        }
        this.consumoService.desmayorizarConsumosPorLote(parametro, this, LS.KEY_EMPRESA_SELECT);

      };
    }
  }

  despuesDeDesmayorizarConsumosPorLote(data) {
    this.utilService.generarSwal(LS.ACCION_DESMAYORIZAR + " " + LS.TAG_CONSUMO, LS.SWAL_SUCCESS, data.extraInfo);
    this.buscarConsumos();
  }

  ngOnChanges(changes) {
    this.consumoListadoService.definirAtajosDeTeclado();
    if (changes.parametrosBusqueda) {
      if (changes.parametrosBusqueda.currentValue && changes.parametrosBusqueda.currentValue.listar) {//puede listar
        this.buscarConsumos();
      } else if (changes.parametrosBusqueda.currentValue && changes.parametrosBusqueda.currentValue.consResultante) {//es entrante por guardado o edicion de objeto
        this.actualizarTabla(changes.parametrosBusqueda.currentValue.consResultante);
      } else { //toca limpiar la lista
        this.listadoConsumos = new Array();
      }
    }
  }

  actualizarTabla(consResultante) {
    let consumoEnLista: InvListaConsultaConsumosTO = consResultante;
    let index = this.listadoConsumos.findIndex(item => item.consNumero == consumoEnLista.consNumero);
    if (index >= 0) {
      consumoEnLista.id = index;
      this.listadoConsumos[index] = consumoEnLista;
      if (this.gridApi) {
        var rowNode = this.gridApi.getRowNode("" + index);
        rowNode.setData(consumoEnLista);
      }
    } else {
      consumoEnLista.id = this.listadoConsumos.length + 1;
      this.listadoConsumos.unshift(consumoEnLista);
      this.gridApi ? this.gridApi.updateRowData({ add: [consumoEnLista], addIndex: 0 }) : null;
    }
  }

  seleccionarBodega(listadoBodegas, caja) {
    return listadoBodegas.find(item => item.bodCodigo == caja.permisoBodegaPermitida);
  }

  cambiarActivar(estado) {
    this.activar = !estado;
    this.enviarActivar.emit(estado);
  }

  imprimirSolito() {
    if (this.consumoService.verificarPermiso(LS.ACCION_IMPRIMIR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let consultaconsumo: Array<InvListaConsultaConsumosTO> = new Array();
      consultaconsumo.push(this.objetoSeleccionado);
      let invConsumosTOs: Array<InvConsumosTO> = this.consumoFormularioService.formatearResporteConsumos(consultaconsumo, LS.KEY_EMPRESA_SELECT);
      let parametro = {
        invConsumosTOs: invConsumosTOs,
        ordenado: false
      }
      this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteConsumoDetalle", parametro, this.empresaSeleccionada)
        .then(respuesta => {
          if (respuesta && respuesta._body && respuesta._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('consumo' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  imprimirConsumosLote(ordenado) {
    if (this.consumoService.verificarPermiso(LS.ACCION_IMPRIMIR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let consultaconsumo = this.utilService.getAGSelectedData(this.gridApi);
      if (consultaconsumo && consultaconsumo.length === 0) {
        this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TOAST_INFORMACION);
        this.cargando = false;
      } else {
        let invConsumosTOs: Array<InvConsumosTO> = this.consumoFormularioService.formatearResporteConsumos(consultaconsumo, LS.KEY_EMPRESA_SELECT);
        if (invConsumosTOs) {
          let parametro = {
            invConsumosTOs: invConsumosTOs,
            ordenado: ordenado
          }
          this.archivoService.postPDF("todocompuWS/inventarioWebController/generarReporteConsumoDetalle", parametro, this.empresaSeleccionada)
            .then(respuesta => {
              if (respuesta && respuesta._body && respuesta._body.byteLength > 0) {
                this.utilService.descargarArchivoPDF('consumos' + this.utilService.obtenerHorayFechaActual() + '.pdf', respuesta);
              } else {
                this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
              }
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.cargando = false;
          this.toastr.warning(LS.MSJ_HAY_CONSUMOS_PENDIENTES_SELECCIONADOS, LS.TAG_AVISO);
        }
      }
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.consumoListadoService.generarColumnasConsulta();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.context = { componentParent: this };
    this.rowClassRules = {
      "fila-pendiente": function (params) {
        if (params.data.consStatus === "PENDIENTE") {
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
