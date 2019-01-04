import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvConsumosMotivoTO } from '../../../../entidadesTO/inventario/InvConsumosMotivoTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MotivoConsumosService } from './motivo-consumos.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-motivo-consumos',
  templateUrl: './motivo-consumos.component.html',
  styleUrls: ['./motivo-consumos.component.css']
})
export class MotivoConsumosComponent implements OnInit {
  public listaFormaContabilizar: Array<string> = LS.LISTA_MOTIVOS_CONSUMOS_FORMA_CONTABILIZAR;
  public listaResultadoConsumosMotivo: Array<InvConsumosMotivoTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public consumoMotivoSeleccionado: InvConsumosMotivoTO = new InvConsumosMotivoTO();
  public invConsumosMotivoTO: InvConsumosMotivoTO = new InvConsumosMotivoTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  //
  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};

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

  constructor(
    private auth: AuthService,
    private api: ApiRequestService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private motivoConsumoService: MotivoConsumosService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['motivoConsumos'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajos();
    this.iniciarAgGrid();
  }

  //Operaciones
  buscarInvConsumoMotivo(inactivos) {
    this.limpiarResultado();
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivos: inactivos };
    this.filasTiempo.iniciarContador();
    this.motivoConsumoService.listarInvConsumosMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvConsumosMotivoTO(data) {
    this.listaResultadoConsumosMotivo = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  operacionesConsumosMotivo(accion) {
    switch (accion) {
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.invConsumosMotivoTO = new InvConsumosMotivoTO(this.consumoMotivoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.eliminarInvConsumoMotivo();
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            invConsumosMotivoTO: new InvConsumosMotivoTO(),
            accion: LS.ACCION_CREAR
          }
        }
        break;
      }
      case LS.ACCION_CONSULTAR:
        if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            accion: LS.ACCION_CONSULTAR,
            invConsumosMotivoTO: new InvConsumosMotivoTO(this.consumoMotivoSeleccionado)
          }
        }
        break;
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            accion: LS.ACCION_EDITAR,
            invConsumosMotivoTO: new InvConsumosMotivoTO(this.consumoMotivoSeleccionado)
          }
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR_ESTADO, this, true)) {
          this.invConsumosMotivoTO = new InvConsumosMotivoTO(this.consumoMotivoSeleccionado);
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.tituloForm = LS.TITULO_FILTROS;
          this.actualizarEstadoInvConsumoMotivo();
        }
        break;
      }
    }
  }

  actualizarEstadoInvConsumoMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let invConsumoMotivoCopia = JSON.parse(JSON.stringify(this.invConsumosMotivoTO));
      let parametros = {
        title: invConsumoMotivoCopia.cmInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (invConsumoMotivoCopia.cmInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Motivo de consumo: " + invConsumoMotivoCopia.cmDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          invConsumoMotivoCopia.cmInactivo = !invConsumoMotivoCopia.cmInactivo;
          this.setearValoresInvConsumoMotivo(invConsumoMotivoCopia);
          this.api.post("todocompuWS/inventarioWebController/modificarEstadoInvConsumosMotivoTO", { invConsumosMotivoTO: invConsumoMotivoCopia }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(invConsumoMotivoCopia, 'U');
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
    }
  }

  eliminarInvConsumoMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let item = JSON.parse(JSON.stringify(this.invConsumosMotivoTO));
      item.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
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
          this.accionInvConsumoMotivo(item, 'E');
        } else {
          this.resetearFormulario();
        }
      });
    }
  }

  imprimirMotivoConsumo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoMotivo: this.listaResultadoConsumosMotivo };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/imprimirReporteMotivoConsumo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoMotivoConsumo.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarMotivoConsumo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoMotivo: this.listaResultadoConsumosMotivo };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteMotivoConsumo", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoMotivoConsumo_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  ejecutarAccion(event) {
    switch (event.accionChar) {
      case 'I':
        this.accionInvConsumoMotivo(event.invConsumoMotivoCopia, 'I');
        this.accion = LS.ACCION_CREAR;
        break;
      case 'M':
        this.accionInvConsumoMotivo(event.invConsumoMotivoCopia, 'M');
        this.accion = LS.ACCION_EDITAR;
        break;
    }
  }

  accionInvConsumoMotivo(invConsumosMotivoTO, accionChar) {
    this.api.post("todocompuWS/inventarioWebController/accionInvConsumosMotivo", { invConsumosMotivoTO: invConsumosMotivoTO, accion: accionChar }, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        this.cargando = false;
        if (respuesta && respuesta.extraInfo) {
          switch (this.accion) {
            case LS.ACCION_CREAR: {
              this.refrescarTabla(invConsumosMotivoTO, 'I');
              this.vistaFormulario = false;
              break;
            }
            case LS.ACCION_EDITAR: {
              this.refrescarTabla(invConsumosMotivoTO, 'U');
              this.vistaFormulario = false;
              break;
            }
            case LS.ACCION_EDITAR_ESTADO: {
              this.refrescarTabla(invConsumosMotivoTO, 'U');
              break;
            }
            case LS.ACCION_ELIMINAR: {
              this.refrescarTabla(invConsumosMotivoTO, 'D');
              break;
            }
          }
          this.toastr.success(respuesta.operacionMensaje, 'Aviso');
          this.resetearFormulario();
        } else {
          if (this.accion === LS.ACCION_ELIMINAR) {
            this.resetearFormulario();
          }
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  //Otros metodos
  setearValoresInvConsumoMotivo(invConsumosMotivoTO: InvConsumosMotivoTO) {
    invConsumosMotivoTO.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
    invConsumosMotivoTO.usrCodigo = this.auth.getCodigoUser().trim();
  }

  cancelar(event) {
    this.vistaFormulario = false;
    this.activar = false;
  }

  resetearFormulario() {
    this.accion = null;
    this.tituloForm = LS.TITULO_FILTROS;
    this.invConsumosMotivoTO = new InvConsumosMotivoTO();
    this.refreshGrid();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listaResultadoConsumosMotivo = [];
    this.filasService.actualizarFilas("0", "0");
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarMotivoConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarMotivoconsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirMotivoConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarMotivoConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoMotivoConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (!this.accion && this.listaResultadoConsumosMotivo.length > 0) {
        this.operacionesConsumosMotivo(LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (!this.accion && this.listaResultadoConsumosMotivo.length > 0) {
        this.operacionesConsumosMotivo(LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarMotivoConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarMotivoConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true);
    let perInactivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true) && !this.consumoMotivoSeleccionado.cmInactivo;
    let perActivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true) && this.consumoMotivoSeleccionado.cmInactivo;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true);
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionesConsumosMotivo(LS.ACCION_CONSULTAR) },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesConsumosMotivo(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesConsumosMotivo(LS.ACCION_ELIMINAR) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionesConsumosMotivo(LS.ACCION_EDITAR_ESTADO) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionesConsumosMotivo(LS.ACCION_EDITAR_ESTADO) : null }
    ];
  }

  refrescarTabla(motivoTO: InvConsumosMotivoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultadoConsumosMotivo.length > 0) {
          let listaTemporal = [... this.listaResultadoConsumosMotivo];
          listaTemporal.unshift(motivoTO);
          this.listaResultadoConsumosMotivo = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultadoConsumosMotivo.findIndex(item => item.cmCodigo === motivoTO.cmCodigo);
        let listaTemporal = [... this.listaResultadoConsumosMotivo];
        listaTemporal[indexTemp] = motivoTO;
        this.listaResultadoConsumosMotivo = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        var indexTemp = this.listaResultadoConsumosMotivo.findIndex(item => item.cmCodigo === motivoTO.cmCodigo);
        let listaTemporal = [...this.listaResultadoConsumosMotivo];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultadoConsumosMotivo = listaTemporal;
        (this.listaResultadoConsumosMotivo.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.motivoConsumoService.generarColumnas();
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
    this.consumoMotivoSeleccionado = fila ? fila.data : null;
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
    this.consumoMotivoSeleccionado = data;
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
  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth > LS.WINDOW_WIDTH_XS ? true : false;
  }
}
