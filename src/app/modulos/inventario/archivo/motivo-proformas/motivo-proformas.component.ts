import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { InvProformaMotivoTO } from '../../../../entidadesTO/inventario/InvProformaMotivoTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { MotivoProformasService } from './motivo-proformas.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-motivo-proformas',
  templateUrl: './motivo-proformas.component.html',
  styleUrls: ['./motivo-proformas.component.css']
})
export class MotivoProformasComponent implements OnInit {
  public listaResultadoMotivoProforma: Array<InvProformaMotivoTO> = [];
  public proformaMotivoSeleccionado: InvProformaMotivoTO = new InvProformaMotivoTO();
  public invProformaMotivoTO: InvProformaMotivoTO = new InvProformaMotivoTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = LS;
  public accion: String = null;
  public tituloForm: String = LS.TITULO_FILTROS;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  //
  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};
  public classIcon: any = "";

  constructor(
    private auth: AuthService,
    private api: ApiRequestService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private proformaMotivoService: MotivoProformasService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['motivoProformas'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajos();
    this.iniciarAgGrid();
  }

  //OPERACIONES
  buscarInvProformaMotivo(inactivos) {
    this.limpiarResultado();
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivos: inactivos };
    this.filasTiempo.iniciarContador();
    this.proformaMotivoService.listarInvProformaMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProformaMotivoTO(data) {
    this.listaResultadoMotivoProforma = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  actualizarEstadoProformaMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let invProformaMotivoCopia = JSON.parse(JSON.stringify(this.invProformaMotivoTO));
      let parametros = {
        title: invProformaMotivoCopia.pmInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (invProformaMotivoCopia.pmInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Motivo de proforma: " + invProformaMotivoCopia.pmDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          invProformaMotivoCopia.pmInactivo = !invProformaMotivoCopia.pmInactivo;
          let invProformasMotivoPK = { pmEmpresa: invProformaMotivoCopia.pmEmpresa, pmCodigo: invProformaMotivoCopia.pmCodigo };
          this.api.post("todocompuWS/inventarioWebController/modificarEstadoInvProformaMotivoTO", { invProformasMotivoPK: invProformasMotivoPK, estado: invProformaMotivoCopia.pmInactivo }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(invProformaMotivoCopia, 'U');
                this.toastr.success(respuesta.operacionMensaje, 'Aviso');
              } else {
                this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
              }
              this.resetearFormulario();
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.resetearFormulario();
        }
      });
    } else {
      this.resetearFormulario();
    }
  }

  eliminarProformaMotivo(objetoSeleccionado: InvProformaMotivoTO) {
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
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { invProformaMotivoTO: objetoSeleccionado };
          this.api.post("todocompuWS/inventarioWebController/eliminarInvProformaMotivoTO", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                this.refrescarTabla(objetoSeleccionado, 'D');
              } else {
                this.toastr.warning(respuesta.operacionMensaje);
              }
              this.resetearFormulario();
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.resetearFormulario();
        }
      });
    }
  }

  imprimirMotivoProforma() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoMotivo: this.listaResultadoMotivoProforma };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/imprimirReporteMotivoProforma", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoMotivoProforma.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarMotivoProforma() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoMotivo: this.listaResultadoMotivoProforma };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteMotivoProforma", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoMotivoProforma_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  operacionesProformaMotivo(accion) {
    switch (accion) {
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.eliminarProformaMotivo(this.proformaMotivoSeleccionado);
        }
        break;
      }
      case LS.ACCION_CONSULTAR: {
        this.vistaFormulario = true;
        this.parametrosFormulario = {
          accion: LS.ACCION_CONSULTAR,
          invProformaMotivoTO: new InvProformaMotivoTO(this.proformaMotivoSeleccionado),
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            invProformaMotivoTO: new InvProformaMotivoTO(),
            accion: LS.ACCION_CREAR
          }
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.invProformaMotivoTO = new InvProformaMotivoTO(this.proformaMotivoSeleccionado);
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            invProformaMotivoTO: new InvProformaMotivoTO(this.proformaMotivoSeleccionado),
            accion: LS.ACCION_EDITAR
          }
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR_ESTADO, this, true)) {
          this.invProformaMotivoTO = new InvProformaMotivoTO(this.proformaMotivoSeleccionado);
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.tituloForm = LS.TITULO_FILTROS;
          this.actualizarEstadoProformaMotivo();
        }
        break;
      }
    }
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listaResultadoMotivoProforma = [];
    this.filasService.actualizarFilas("0", "0");
  }

  generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this);
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this);
    let perInactivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.proformaMotivoSeleccionado.pmInactivo;
    let perActivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && this.proformaMotivoSeleccionado.pmInactivo
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionesProformaMotivo(LS.ACCION_CONSULTAR) },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.operacionesProformaMotivo(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.operacionesProformaMotivo(LS.ACCION_ELIMINAR) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionesProformaMotivo(LS.ACCION_EDITAR_ESTADO) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionesProformaMotivo(LS.ACCION_EDITAR_ESTADO) : null }
    ];
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarMotivoProforma') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarMotivoProforma') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirMotivoProforma') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarMotivoProforma') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoMotivoProforma') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (!this.accion && this.listaResultadoMotivoProforma.length > 0) {
        this.operacionesProformaMotivo(LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (!this.accion && this.listaResultadoMotivoProforma.length > 0) {
        this.operacionesProformaMotivo(LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarMotivoProforma') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarMotivoProforma') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }


  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_CREAR:
        this.refrescarTabla(event.invProformaMotivoCopia, 'I');
        this.vistaFormulario = false;
        break;
      case LS.ACCION_EDITAR:
        this.refrescarTabla(event.invProformaMotivoCopia, 'U');
        this.vistaFormulario = false;
    }
  }

  refrescarTabla(motivoTO: InvProformaMotivoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultadoMotivoProforma.length > 0) {
          let listaTemporal = [... this.listaResultadoMotivoProforma];
          listaTemporal.unshift(motivoTO);
          this.listaResultadoMotivoProforma = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultadoMotivoProforma.findIndex(item => item.pmCodigo === motivoTO.pmCodigo);
        let listaTemporal = [... this.listaResultadoMotivoProforma];
        listaTemporal[indexTemp] = motivoTO;
        this.listaResultadoMotivoProforma = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultadoMotivoProforma.findIndex(item => item.pmCodigo === motivoTO.pmCodigo);
        let listaTemporal = [...this.listaResultadoMotivoProforma];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultadoMotivoProforma = listaTemporal;
        (this.listaResultadoMotivoProforma.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  resetearFormulario() {
    this.tituloForm = LS.TITULO_FILTROS;
    this.invProformaMotivoTO = new InvProformaMotivoTO();
    this.accion = null;
    this.refreshGrid();
  }

  cancelar(event) {
    this.vistaFormulario = false;
    this.activar = false;
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.proformaMotivoService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarFila(0);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.proformaMotivoSeleccionado = fila ? fila.data : null;
  }

  redimencionarColumnas() {
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.proformaMotivoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
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
