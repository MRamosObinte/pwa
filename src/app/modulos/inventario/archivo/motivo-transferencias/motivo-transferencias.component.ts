import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { MotivoTransferenciasService } from './motivo-transferencias.service';
import { InvTransferenciaMotivoTO } from '../../../../entidadesTO/inventario/InvTransferenciaMotivoTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-motivo-transferencias',
  templateUrl: './motivo-transferencias.component.html',
  styleUrls: ['./motivo-transferencias.component.css']
})
export class MotivoTransferenciasComponent implements OnInit {
  public listaResultadoMotivoTransferencia: Array<InvTransferenciaMotivoTO> = [];
  public transferenciaMotivoSeleccionado: InvTransferenciaMotivoTO = new InvTransferenciaMotivoTO();
  public invTransferenciaMotivoTO: InvTransferenciaMotivoTO = new InvTransferenciaMotivoTO();
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

  constructor(
    private auth: AuthService,
    private api: ApiRequestService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private motivoTransferenciaService: MotivoTransferenciasService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['motivoTransferencias'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajos();
    this.iniciarAgGrid();
  }

  //OPERACIONES
  buscarInvTransferenciaMotivo(inactivos) {
    this.limpiarResultado();
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivos: inactivos };
    this.filasTiempo.iniciarContador();
    this.motivoTransferenciaService.listarInvTransferenciaMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvTransferenciaMotivoTO(data) {
    this.listaResultadoMotivoTransferencia = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  actualizarMotivoTransferencia(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(form);
      if (formTocado && form && form.valid) {
        let invTransferenciaMotivoCopia = JSON.parse(JSON.stringify(this.invTransferenciaMotivoTO));
        this.motivoTransferenciaService.setearValoresInvTransferenciaMotivo(invTransferenciaMotivoCopia);
        this.accionInvTransferenciaMotivo(invTransferenciaMotivoCopia, 'M');
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  actualizarEstadoMotivoTransferencia() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let invProformaMotivoCopia = JSON.parse(JSON.stringify(this.invTransferenciaMotivoTO));
      let parametros = {
        title: invProformaMotivoCopia.tmInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (invProformaMotivoCopia.tmInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Motivo de transferencia: " + invProformaMotivoCopia.tmDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          invProformaMotivoCopia.tmInactivo = !invProformaMotivoCopia.tmInactivo;
          this.motivoTransferenciaService.setearValoresInvTransferenciaMotivo(invProformaMotivoCopia);
          this.api.post("todocompuWS/inventarioWebController/modificarEstadoInvTransferenciaMotivoTO", { invTransferenciaMotivoTO: invProformaMotivoCopia }, LS.KEY_EMPRESA_SELECT)
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

  eliminarTransferenciaMotivo(objetoSeleccionado: InvTransferenciaMotivoTO) {
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
          this.accionInvTransferenciaMotivo(objetoSeleccionado, 'E');
        } else {
          this.resetearFormulario();
        }
      });
    }
  }

  imprimirMotivoTransferencia() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoMotivo: this.listaResultadoMotivoTransferencia };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/imprimirReporteMotivoTransferencia", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoMotivoTransferencia.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarMotivoTransferencia() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoMotivo: this.listaResultadoMotivoTransferencia };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteMotivoTransferencia", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoMotivoTransferencia_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  ejecutarAccion(event) {
    switch (event.accionChar) {
      case 'I':
        this.accionInvTransferenciaMotivo(event.invTransferenciaMotivoCopia, 'I');
        this.accion = LS.ACCION_CREAR;
        this.vistaFormulario = false;
        break;
      case 'M':
        this.accionInvTransferenciaMotivo(event.invTransferenciaMotivoCopia, 'M');
        this.accion = LS.ACCION_EDITAR;
        this.vistaFormulario = false;
        break;
    }
  }

  accionInvTransferenciaMotivo(invTransferenciaMotivoTO, accionChar) {
    this.api.post("todocompuWS/inventarioWebController/accionInvTransferenciaMotivo", { invTransferenciaMotivoTO: invTransferenciaMotivoTO, accion: accionChar }, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        this.cargando = false;
        if (respuesta && respuesta.extraInfo) {
          switch (this.accion) {
            case LS.ACCION_CREAR: {
              this.refrescarTabla(invTransferenciaMotivoTO, 'I');
              break;
            }
            case LS.ACCION_EDITAR: {
              this.refrescarTabla(invTransferenciaMotivoTO, 'U');
              break;
            }
            case LS.ACCION_EDITAR_ESTADO: {
              this.refrescarTabla(invTransferenciaMotivoTO, 'U');
              break;
            }
            case LS.ACCION_ELIMINAR: {
              this.refrescarTabla(invTransferenciaMotivoTO, 'D');
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

  operacionesTransferenciaMotivo(accion) {
    switch (accion) {
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.eliminarTransferenciaMotivo(this.transferenciaMotivoSeleccionado);
        }
        break;
      }
      case LS.ACCION_CONSULTAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            accion: LS.ACCION_CONSULTAR,
            invTransferenciaMotivoTO: new InvTransferenciaMotivoTO(this.transferenciaMotivoSeleccionado)
          }
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            accion: LS.ACCION_CREAR,
            invTransferenciaMotivoTO: new InvTransferenciaMotivoTO()
          }
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            accion: LS.ACCION_EDITAR,
            invTransferenciaMotivoTO: new InvTransferenciaMotivoTO(this.transferenciaMotivoSeleccionado)
          }
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR_ESTADO, this, true)) {
          this.invTransferenciaMotivoTO = new InvTransferenciaMotivoTO(this.transferenciaMotivoSeleccionado);
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.tituloForm = LS.TITULO_FILTROS;
          this.actualizarEstadoMotivoTransferencia();
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
    this.listaResultadoMotivoTransferencia = [];
    this.filasService.actualizarFilas("0", "0");
  }

  generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this);
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this);
    let perInactivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.transferenciaMotivoSeleccionado.tmInactivo;
    let perActivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && this.transferenciaMotivoSeleccionado.tmInactivo
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionesTransferenciaMotivo(LS.ACCION_CONSULTAR) },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesTransferenciaMotivo(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesTransferenciaMotivo(LS.ACCION_ELIMINAR) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionesTransferenciaMotivo(LS.ACCION_EDITAR_ESTADO) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionesTransferenciaMotivo(LS.ACCION_EDITAR_ESTADO) : null }
    ];
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarMotivoTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarMotivoTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirMotivoTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarMotivoTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoMotivoTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (!this.accion && this.listaResultadoMotivoTransferencia.length > 0) {
        this.operacionesTransferenciaMotivo(LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (!this.accion && this.listaResultadoMotivoTransferencia.length > 0) {
        this.operacionesTransferenciaMotivo(LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarMotivoTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarMotivoTransferencia') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  refrescarTabla(motivoTO: InvTransferenciaMotivoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultadoMotivoTransferencia.length > 0) {
          let listaTemporal = [... this.listaResultadoMotivoTransferencia];
          listaTemporal.unshift(motivoTO);
          this.listaResultadoMotivoTransferencia = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        var indexTemp = this.listaResultadoMotivoTransferencia.findIndex(item => item.tmCodigo === motivoTO.tmCodigo);
        let listaTemporal = [... this.listaResultadoMotivoTransferencia];
        listaTemporal[indexTemp] = motivoTO;
        this.listaResultadoMotivoTransferencia = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultadoMotivoTransferencia.findIndex(item => item.tmCodigo === motivoTO.tmCodigo);
        let listaTemporal = [...this.listaResultadoMotivoTransferencia];
        listaTemporal.splice(indexTemp, 1);
        this.listaResultadoMotivoTransferencia = listaTemporal;
        (this.listaResultadoMotivoTransferencia.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  resetearFormulario() {
    this.tituloForm = LS.TITULO_FILTROS;
    this.invTransferenciaMotivoTO = new InvTransferenciaMotivoTO();
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
    this.columnDefs = this.motivoTransferenciaService.generarColumnas();
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
    this.transferenciaMotivoSeleccionado = fila ? fila.data : null;
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
    this.transferenciaMotivoSeleccionado = data;
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
