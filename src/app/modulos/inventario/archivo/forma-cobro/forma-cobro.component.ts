import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { MenuItem } from 'primeng/api';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ActivatedRoute } from '@angular/router';
import { PlanContableService } from '../../../contabilidad/archivo/plan-contable/plan-contable.service';
import { LS } from '../../../../constantes/app-constants';
import { FormaCobroService } from './forma-cobro.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvVentasFormaCobroTO } from '../../../../entidadesTO/inventario/InvVentasFormaCobroTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-forma-cobro',
  templateUrl: './forma-cobro.component.html',
  styleUrls: ['./forma-cobro.component.css']
})
export class FormaCobroComponent implements OnInit {
  public listaResultado: Array<InvVentasFormaCobroTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaTipos: Array<string> = LS.LISTA_TIPOS_FORMA_COBRO;
  public objetoSeleccionado: InvVentasFormaCobroTO = new InvVentasFormaCobroTO();
  public invVentasFormaCobroTO: InvVentasFormaCobroTO = new InvVentasFormaCobroTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = LS;
  public tamanioEstructura: number = 0;
  public indexTablaEditar: number = 0;
  public accion: String = null;
  public codigoCuenta: String = null;
  public tituloForm: String = LS.TITULO_FILTROS;
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

  constructor(
    private planContableService: PlanContableService,
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private sectorService: SectorService,
    private formaCobroService: FormaCobroService,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private utilService: UtilService) {
  }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['formaCobroInv'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  //LISTADOS
  /** Metodo para listar las formas de cobro dependiendo de la empresa*/
  buscarInvVentasFormaCobro(inactivos) {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivos: inactivos };
    this.filasTiempo.iniciarContador();
    this.formaCobroService.listarInvListaInvVentasFormaCobroTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo buscarInvVentasFormaCobro()*/
  despuesDeListarInvListarInvVentasFormaCobroTO(data) {
    this.filasTiempo.finalizarContador();
    this.listaResultado = data ? data : [];
    this.cargando = false;
  }

  /** Metodo para listar los sectores dependiendo de la empresa*/
  listarSectores() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarSectores()*/
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listarSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  //OPERACIONES
  /** Metodo general, este metodo se ejecuta cada vez que se de clic en las opciones (Nuevo,editar o eliminar) para poder setear sus valores correspondientes*/
  operacionesFormaCobro(opcion) {
    switch (opcion) {
      case LS.ACCION_ELIMINAR: {
        if (this.formaCobroService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.invVentasFormaCobroTO = new InvVentasFormaCobroTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.eliminarInvVentasFormaCobro();
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.formaCobroService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            invVentasFormaCobroTO: new InvVentasFormaCobroTO(),
            listaSectores: this.listaSectores,
            accion: LS.ACCION_CREAR,
            tamanioEstructura: this.tamanioEstructura
          }
        }
        break;
      }
      case LS.ACCION_CONSULTAR: {
        this.vistaFormulario = true;
        this.parametrosFormulario = {
          invVentasFormaCobroTO: new InvVentasFormaCobroTO(this.objetoSeleccionado),
          listaSectores: this.listaSectores,
          accion: LS.ACCION_CONSULTAR,
          tamanioEstructura: this.tamanioEstructura,
          indexTablaEditar: this.invVentasFormaCobroTO.fcSecuencial ? this.listaResultado.findIndex(item => item.fcSecuencial === this.invVentasFormaCobroTO.fcSecuencial) :
            this.listaResultado.findIndex(item => item.ctaCodigo === this.invVentasFormaCobroTO.ctaCodigo)
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.formaCobroService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            invVentasFormaCobroTO: new InvVentasFormaCobroTO(this.objetoSeleccionado),
            listaSectores: this.listaSectores,
            accion: LS.ACCION_EDITAR,
            tamanioEstructura: this.tamanioEstructura,
            listaResultado: this.listaResultado,
          }
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.formaCobroService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.invVentasFormaCobroTO = new InvVentasFormaCobroTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.tituloForm = LS.TITULO_FILTROS;
          this.indexTablaEditar = this.invVentasFormaCobroTO.fcSecuencial ? this.listaResultado.findIndex(item => item.fcSecuencial === this.invVentasFormaCobroTO.fcSecuencial) :
            this.listaResultado.findIndex(item => item.ctaCodigo === this.invVentasFormaCobroTO.ctaCodigo);
          this.actualizarEstadoInvVentasFormaCobro();
        }
        break;
      }
    }
  }

  ejecutarAccion(event) {
    switch (event.accionChar) {
      case 'I':
        this.accionInvVentasFormaCobroTO(event.invVentasFormaCobroCopia, 'I');
        this.accion = LS.ACCION_CREAR;
        break;
      case 'M':
        this.accionInvVentasFormaCobroTO(event.invVentasFormaCobroCopia, 'M');
        this.accion = LS.ACCION_EDITAR;
        this.indexTablaEditar = event.indexTablaEditar;
    }
  }

  accionInvVentasFormaCobroTO(invVentasFormaCobroTO, accionChar) {
    this.api.post("todocompuWS/inventarioWebController/accionInvVentasFormaCobro", { invVentasFormaCobroTO: invVentasFormaCobroTO, accion: accionChar }, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        this.cargando = false;
        if (respuesta && respuesta.extraInfo) {
          switch (this.accion) {
            case LS.ACCION_CREAR: {
              invVentasFormaCobroTO.fcSecuencial = respuesta.extraInfo.fcSecuencial;
              this.refrescarTabla(invVentasFormaCobroTO, 'I')
              this.vistaFormulario = false;
              break;
            }
            case LS.ACCION_EDITAR: {
              this.refrescarTabla(invVentasFormaCobroTO, 'U')
              this.vistaFormulario = false;
              break;
            }
            case LS.ACCION_ELIMINAR: {
              this.refrescarTabla(invVentasFormaCobroTO, 'D')
              break;
            }
          }
          this.toastr.success(respuesta.operacionMensaje, 'Aviso');
          this.resetear();
        } else {
          if (this.accion === LS.ACCION_ELIMINAR) {
            this.resetear();
          }
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  actualizarEstadoInvVentasFormaCobro() {
    if (this.formaCobroService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let invVentasFormaCobroCopia = JSON.parse(JSON.stringify(this.invVentasFormaCobroTO));
      let parametros = {
        title: invVentasFormaCobroCopia.fcInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (invVentasFormaCobroCopia.fcInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Forma de cobro: " + invVentasFormaCobroCopia.fcDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          invVentasFormaCobroCopia.fcInactivo = !invVentasFormaCobroCopia.fcInactivo;
          invVentasFormaCobroCopia.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
          this.api.post("todocompuWS/inventarioWebController/modificarEstadoInvVentasFormaCobroTO", { invVentasFormaCobroTO: invVentasFormaCobroCopia, estado: invVentasFormaCobroCopia.fcInactivo }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(invVentasFormaCobroCopia, 'U')
                this.toastr.success(respuesta.operacionMensaje, 'Aviso');
              } else {
                this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
              }
              this.resetear();
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.resetear();
        }
      });
    }
  }

  eliminarInvVentasFormaCobro() {
    if (this.formaCobroService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let item = JSON.parse(JSON.stringify(this.invVentasFormaCobroTO));
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
          this.accionInvVentasFormaCobroTO(item, 'E');
        } else {
          this.resetear();
        }
      });
    }
  }

  imprimirFormaCobro() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoFormaCobro: this.listaResultado };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/imprimirReporteFormaCobro", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoFormacobro.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarFormaCobro() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoFormaCobro: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteFormaCobro", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoFormaCobro_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //OTROS METODOS
  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listaResultado = [];
    this.planContableService.getTamanioListaConEstructura({ empresa: LS.KEY_EMPRESA_SELECT }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
    this.listarSectores();
    this.filasService.actualizarFilas("0", "0");
  }

  /** Metodo que reinicia los valores de las variables accion,filas y los listaEmpresas de opciones de menú*/
  resetear() {
    this.accion = null;
    this.tituloForm = LS.TITULO_FILTROS;
    this.actualizarFilas();
  }

  cancelar(event) {
    this.vistaFormulario = false;
    this.activar = false;
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho*/
  generarOpciones() {
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perInactivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && !this.objetoSeleccionado.fcInactivo;
    let perActivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && this.objetoSeleccionado.fcInactivo;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionesFormaCobro(LS.ACCION_CONSULTAR) },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesFormaCobro(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesFormaCobro(LS.ACCION_ELIMINAR) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionesFormaCobro(LS.ACCION_EDITAR_ESTADO) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionesFormaCobro(LS.ACCION_EDITAR_ESTADO) : null }
    ];
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.activar = !this.activar;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarFormaCobro') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoFormaCobro') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesFormaCobro(LS.ACCION_EDITAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesFormaCobro(LS.ACCION_ELIMINAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarFormaCobro') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirFormaCobro') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarFormaCobro') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarFormaCobro') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  refrescarTabla(invVentasFormaCobroTO: InvVentasFormaCobroTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(invVentasFormaCobroTO);
          this.listaResultado = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        let listaTemporal = [... this.listaResultado];
        listaTemporal[this.indexTablaEditar] = invVentasFormaCobroTO;
        this.listaResultado = listaTemporal;
        this.seleccionarFila(this.indexTablaEditar);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.ctaCodigo === invVentasFormaCobroTO.ctaCodigo);
        let listaTemporal = [...this.listaResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultado = listaTemporal;
        (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.formaCobroService.generarColumnas();
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
    this.objetoSeleccionado = fila ? fila.data : null;
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
    this.objetoSeleccionado = data;
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
