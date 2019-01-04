import { Component, OnInit, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { CategoriaService } from './categoria.service';
import { RhCategoriaTO } from '../../../../entidadesTO/rrhh/RhCategoriaTO';
import { ToastrService } from 'ngx-toastr';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { TipoContableService } from '../../../contabilidad/archivo/tipo-contable/tipo-contable.service';
import { ConTipo } from '../../../../entidades/contabilidad/ConTipo';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html'
})
export class CategoriaComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public parametrosFormulario: any = {};
  public constantes: any = LS;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public cargando: boolean = false;
  public vistaFormulario: boolean = false;
  public activar: boolean = false;
  public accion: string = null;
  public objetoSeleccionado: RhCategoriaTO = new RhCategoriaTO(null);
  public listadoCategorias: Array<RhCategoriaTO> = new Array();
  public tiposContables: Array<ConTipo> = new Array();

  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private categoriaService: CategoriaService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
    private tipoContableService: TipoContableService,
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['categoria'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.definirAtajosDeTeclado();
    this.iniciarAgGrid();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.buscarCategorias();
    this.listarConTipo();
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.filasService.actualizarFilas("0", "0");
    this.filasTiempo.iniciarContador();
    this.vistaFormulario = false;
    this.listadoCategorias = new Array();
  }

  listarConTipo() {
    this.tiposContables = [];
    this.cargando = true;
    this.tipoContableService.listarConTipo({
      empresa: LS.KEY_EMPRESA_SELECT,
      activo: true
    }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarConTipo(data) {
    this.cargando = false;
    this.tiposContables = data;
  }

  verificarPermiso(accion, mostraMensaje): Boolean {
    return this.utilService.verificarPermiso(accion, this, mostraMensaje);
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element = document.getElementById("btnActivar");
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element = document.getElementById("btnBuscarCategoria");
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element = document.getElementById("btnNuevaCategoria");
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element = document.getElementById("btnimprimirCategorias");
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element = document.getElementById("btnexportarCategorías");
      element ? element.click() : null;
      return false;
    }))
  }

  generarOpciones() {
    let perConsultar = true;
    let perModificar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.consultarCategoria() : null
      },
      {
        label: LS.ACCION_EDITAR,
        icon: LS.ICON_EDITAR,
        disabled: !perModificar,
        command: () => perModificar ? this.modificarCategoria() : null
      },
      {
        label: LS.ACCION_ELIMINAR,
        icon: LS.ICON_ELIMINAR,
        disabled: !perEliminar,
        command: () => perEliminar ? this.eliminarCategoria() : null
      }
    ];
  }

  consultarCategoria() {
    this.vistaFormulario = true;
    this.accion = LS.ACCION_CONSULTAR;
  }

  /**
   * event contiene la empresa seleccionada, la accion que se envia y otro parametro que se ajuste a la accion
   * @param {*} event
   */
  ejecutarAccion(event) {
    this.definirAtajosDeTeclado();
    switch (event.accion) {
      case LS.ACCION_CREADO://Se creo un objeto nuevo desde el hijo
        this.actualizarTabla(event);
        break;
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      default:
        this.vistaFormulario = false;
        this.cargando = false;
        this.listadoCategorias.length === 0 ? this.activar = false : null;
    }
  }

  actualizarTabla(event) {
    let objetoEnLista: RhCategoriaTO = event.objetoSeleccionado;
    let index = this.listadoCategorias.findIndex(item => item.catNombre == objetoEnLista.catNombre);
    if (index >= 0) {
      this.listadoCategorias[index] = objetoEnLista;
      if (this.gridApi) {
        var rowNode = this.gridApi.getRowNode("" + index);
        rowNode.setData(objetoEnLista);
      }
    } else {
      this.listadoCategorias.unshift(objetoEnLista);
      this.gridApi ? this.gridApi.updateRowData({ add: [objetoEnLista] }) : null;
    }
    this.vistaFormulario = false;
    this.cargando = false;
    this.listadoCategorias.length === 0 ? this.activar = false : null;
    this.definirAtajosDeTeclado();
  }

  //Operaciones
  buscarCategorias() {
    this.listadoCategorias = [];
    this.limpiarResultado();
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    };
    this.categoriaService.listarCategorias(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarCategorias(data) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listadoCategorias = data;
  }

  modificarCategoria() {
    this.vistaFormulario = true;
    this.accion = LS.ACCION_EDITAR;
  }

  eliminarCategoria() {
    this.cargando = true;
    this.accion = LS.ACCION_ELIMINAR;
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
        let parametro = {
          rhCategoriaTO: this.objetoSeleccionado,
          accion: 'E'
        }
        this.categoriaService.accionCategorias(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeAccionCategorias(data) {
    this.toastr.info(data.operacionMensaje, LS.TAG_AVISO);
    var indexTemp = this.listadoCategorias.findIndex(item => item.catNombre === this.objetoSeleccionado.catNombre);
    this.listadoCategorias.splice(indexTemp, 1);
    this.gridApi.updateRowData({ remove: [this.objetoSeleccionado] });
    this.cargando = false;
  }

  nuevaCategoria() {
    this.objetoSeleccionado = new RhCategoriaTO(null);
    this.vistaFormulario = true;
    this.accion = LS.ACCION_CREAR;
  }

  imprimirCategorias() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { lista: this.listadoCategorias };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteRhCategoriaTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data && data._body && data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF("ListadoCategorías_" + this.utilService.obtenerHorayFechaActual() + ".pdf", data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarCategorias() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { lista: this.listadoCategorias };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarRhCategoriaTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data && data._body && data._body.byteLength > 0) {
            this.utilService.descargarArchivoExcel(data._body, "ListadoCategorías_");
          } else {
            this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.categoriaService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion
}
