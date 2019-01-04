import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { EmpleadosService } from '../../archivo/empleados/empleados.service';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ToastrService } from 'ngx-toastr';
import { EmpleadosListadoService } from './empleados-listado.service';
import { RhFunListadoEmpleadosTO } from '../../../../entidadesTO/rrhh/RhFunListadoEmpleadosTO';

@Component({
  selector: 'app-empleados-listado',
  templateUrl: './empleados-listado.component.html'
})
export class EmpleadosListadoComponent implements OnInit {

  @Input() parametrosBusqueda: any = null;//parametros de busqueda 
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Input() tipoVista: string = "A";
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  //archivo y modal
  public objetoSeleccionado: RhEmpleado = new RhEmpleado();
  public listadoEmpleados: Array<RhEmpleado> = new Array();
  //consulta
  public empleadosBusqueda: Array<RhFunListadoEmpleadosTO> = new Array();

  constantes: any = LS;
  innerWidth: number;
  public enterKey: number = 0;//Suma el numero de enter
  filtroGlobal: string = "";
  accion: string = "";
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
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    private empleadosService: EmpleadosService,
    public activeModal: NgbActiveModal,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
    private empleadoListadoService: EmpleadosListadoService
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    if (this.isModal) {
      this.buscarEmpleados();
    }
    this.empleadoListadoService.definirAtajosDeTeclado();
    this.iniciarAgGrid();
  }

  buscarEmpleados() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    if (this.tipoVista == 'C') {
      this.empleadosBusqueda = new Array();
      this.empleadosService.listarFunEmpleados(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.listadoEmpleados = new Array();
      this.empleadosService.listarEmpleados(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeListarEmpleados(data) {
    this.filasTiempo.finalizarContador();
    if (data.length === 0) {
      this.activeModal.dismiss();
    } else {
      if (data.length === 1 && this.isModal) {
        this.activeModal.close(data[0]);
      } else {
        this.listadoEmpleados = data;
      }
    }
    this.cargando = false;
  }

  despuesDeListarFunEmpleados(data) {
    this.filasTiempo.finalizarContador();
    if (data.length === 0) {
      this.activeModal.dismiss();
    } else {
      if (data.length === 1 && this.isModal) {
        this.activeModal.close(data[0]);
      } else {
        this.empleadosBusqueda = data;
      }
    }
    this.cargando = false;
  }

  imprimirEmpleados() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        tipoVista: this.tipoVista,
        lista: this.tipoVista === 'A' ? this.listadoEmpleados : this.empleadosBusqueda
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteRhEmpleado", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data && data._body && data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF("ListadoEmpleados_" + this.utilService.obtenerHorayFechaActual() + ".pdf", data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  imprimiEmpleado() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      let empleados: Array<RhEmpleado> = new Array();
      empleados.push(this.objetoSeleccionado);
      this.cargando = true;
      let parametros = {
        tipoVista: "I",
        lista: empleados
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteRhEmpleado", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data && data._body && data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF("Empleado_" + this.utilService.obtenerHorayFechaActual() + ".pdf", data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarEmpleados() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        tipoVista: this.tipoVista,
        lista: this.tipoVista === 'A' ? this.listadoEmpleados : this.empleadosBusqueda
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarEmpleado", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data && data._body && data._body.byteLength > 0) {
            this.utilService.descargarArchivoExcel(data._body, "ListadoEmpleados_");
          } else {
            this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  consultar() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado);
  }

  generarOpciones() {
    let perConsultar = true;
    let perModificar = this.empresaSeleccionada.listaSisPermisoTO.gruModificarEmpleados;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    let perInactivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificarEmpleados && !this.objetoSeleccionado.empInactivo;
    let perActivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificarEmpleados && this.objetoSeleccionado.empInactivo;
    let perImprimir = this.empresaSeleccionada.listaSisPermisoTO.gruImprimir;
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
        disabled: !perModificar,
        command: () => perModificar ? this.emitirAccion(LS.ACCION_EDITAR, this.objetoSeleccionado) : null
      },
      {
        label: LS.ACCION_INACTIVAR,
        icon: LS.ICON_INACTIVAR,
        disabled: !perInactivar,
        command: () => perModificar ? this.inactivar(true) : null
      },
      {
        label: LS.ACCION_ACTIVAR,
        icon: LS.ICON_ACTIVAR,
        disabled: !perActivar,
        command: () => perActivar ? this.inactivar(false) : null
      },
      {
        label: LS.ACCION_ELIMINAR,
        icon: LS.ICON_ELIMINAR,
        disabled: !perEliminar,
        command: () => perEliminar ? this.eliminarEmpleado() : null
      },
      {
        label: LS.ACCION_IMPRIMIR,
        icon: LS.ICON_IMPRIMIR,
        disabled: !perImprimir,
        command: () => perImprimir ? this.imprimiEmpleado() : null
      },
    ];
  }

  inactivar(estado) {
    let parametros;
    if (!estado) {
      this.accion = LS.ACCION_ACTIVAR;
      parametros = {
        title: LS.ACCION_ACTIVAR,
        texto: LS.MSJ_PREGUNTA_ACTIVAR + "<br> " + LS.TAG_TRABAJADOR + ": " + this.objetoSeleccionado.empApellidos + " " + this.objetoSeleccionado.empNombres,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    } else {
      this.accion = LS.ACCION_INACTIVAR;
      parametros = {
        title: LS.ACCION_INACTIVAR,
        texto: LS.MSJ_PREGUNTA_INACTIVAR + "<br> " + LS.TAG_TRABAJADOR + ": " + this.objetoSeleccionado.empApellidos + " " + this.objetoSeleccionado.empNombres,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        this.objetoSeleccionado.empInactivo = estado;
        let parametro = {
          pk: this.objetoSeleccionado.rhEmpleadoPK,
          activar: !estado
        }
        this.empleadosService.cambiarEstadoRhEmpleado(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeCambiarEstadoRhEmpleado(data) {
    switch (this.accion) {
      case LS.ACCION_ACTIVAR:
        this.objetoSeleccionado.empInactivo = false;
        break;
      case LS.ACCION_INACTIVAR:
        this.objetoSeleccionado.empInactivo = true;
        break;
    }
    var indexTemp = this.listadoEmpleados.findIndex(item => item.rhEmpleadoPK.empId === this.objetoSeleccionado.rhEmpleadoPK.empId);
    this.listadoEmpleados[indexTemp] = this.objetoSeleccionado;
    this.gridApi.updateRowData({ update: [this.objetoSeleccionado] });
    this.toastr.success(data.operacionMensaje, LS.TOAST_CORRECTO);
    this.cargando = false;
  }

  eliminarEmpleado() {
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
        this.cargando = true;
        let parametro = {
          rhEmpleadoPK: this.objetoSeleccionado.rhEmpleadoPK
        }
        this.empleadosService.eliminarRhEmpleado(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeEliminarRhEmpleado(data) {
    this.cargando = false;
    this.gridApi ? this.gridApi.updateRowData({ remove: [this.objetoSeleccionado] }) : null;
  }

  /**Modal */
  filaSeleccionar() {
    this.enviarItem(this.objetoSeleccionado);
  }

  ejecutarSpanAccion(event, data) {
    this.enviarItem(data);
  }

  enviarItem(item) {
    this.activeModal.close(item);
  }

  emitirAccion(accion, seleccionado: RhEmpleado) {
    let parametros = {
      accion: accion,
      objetoSeleccionado: seleccionado
    }
    this.enviarAccion.emit(parametros);
  }

  ngOnChanges(changes) {
    this.empleadoListadoService.definirAtajosDeTeclado();
    if (changes.parametrosBusqueda) {
      if (changes.parametrosBusqueda.currentValue && changes.parametrosBusqueda.currentValue.listar) {//puede listar
        this.buscarEmpleados();
      } else if (changes.parametrosBusqueda.currentValue && changes.parametrosBusqueda.currentValue.objetoSeleccionado) {//es entrante por guardado o edicion de objeto
        this.actualizarTabla(changes.parametrosBusqueda.currentValue.objetoSeleccionado);
      } else { //toca limpiar la lista
        this.listadoEmpleados = new Array();
      }
    }
  }

  actualizarTabla(consResultante) {
    let consumoEnLista: RhEmpleado = consResultante;
    let index = this.listadoEmpleados.findIndex(item => item.rhEmpleadoPK.empId == consumoEnLista.rhEmpleadoPK.empId);
    if (index >= 0) {
      this.listadoEmpleados[index] = consumoEnLista;
      if (this.gridApi) {
        var rowNode = this.gridApi.getRowNode("" + index);
        rowNode.setData(consumoEnLista);
      }
    } else {
      this.listadoEmpleados.unshift(consumoEnLista);
      this.gridApi ? this.gridApi.updateRowData({ add: [consumoEnLista] }) : null;
    }
  }

  cambiarActivar(estado) {
    this.activar = !estado;
    this.enviarActivar.emit(estado);
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.tipoVista === 'C' ? this.empleadosService.generarColumnasConsulta(this.isModal) : this.empleadosService.generarColumnas(this.isModal);
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
    if (this.tipoVista == 'A') {
      this.mostrarContextMenu(dataSelected, event);
    }
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (!this.isModal && this.tipoVista == 'A') {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
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

  /*Metodos para seleccionar producto con ENTER O DOBLECLICK */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isModal) {
      if (event.keyCode === 13) {
        if (this.enterKey > 0) {
          this.enviarItem(this.objetoSeleccionado);
        }
        this.enterKey = this.enterKey + 1;
      }
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

}
