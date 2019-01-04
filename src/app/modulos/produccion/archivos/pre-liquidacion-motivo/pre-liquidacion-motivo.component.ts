import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ActivatedRoute } from '@angular/router';
import { LS } from '../../../../constantes/app-constants';
import { PrdPreLiquidacionMotivoTO } from '../../../../entidadesTO/Produccion/PrdPreLiquidacionMotivoTO';
import { NgForm } from '@angular/forms';
import { PreLiquidacionMotivoService } from './pre-liquidacion-motivo.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-pre-liquidacion-motivo',
  templateUrl: './pre-liquidacion-motivo.component.html',
  styleUrls: ['./pre-liquidacion-motivo.component.css']
})
export class PreLiquidacionMotivoComponent implements OnInit {

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[];
  //
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public constantes: any;
  public activar: boolean = false;
  //
  public cargando: boolean = false;
  //
  public accion: String = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public classIcon: string = LS.ICON_FILTRAR;
  //
  public listaResultado: Array<PrdPreLiquidacionMotivoTO> = [];
  public listaResultadoTodo: Array<PrdPreLiquidacionMotivoTO> = [];
  public filaSeleccionada: PrdPreLiquidacionMotivoTO;
  public preliquidacionMotivoTO: PrdPreLiquidacionMotivoTO = new PrdPreLiquidacionMotivoTO();
  //
  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};
  //
  @ViewChild("frmPreLiquidacionMotivo") frmPreLiquidacionMotivo: NgForm;
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public isScreamMd: boolean = true;
  public innerWidth: number;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private api: ApiRequestService,
    private preLiquidacionService: PreLiquidacionMotivoService,
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['preLiquidacionMotivo'];
    this.constantes = LS;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.listaEmpresas ? this.cambiarEmpresaSelect() : null;
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    }
    this.generarAtajosTeclado();
    this.iniciarAgGrid();
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.parametrosFormulario = null;
    this.vistaFormulario = false;
    this.filasService.actualizarFilas("0", "0");
  }

  listarPreLiquidacionMotivo(form: NgForm, estado) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          inactivo: estado
        };
        this.filasTiempo.iniciarContador();
        this.preLiquidacionService.listarPreLiquidacionMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeListarPreLiquidacionMotivo(lista) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultado = lista;
  }

  nuevaPreLiquidacionMotivo() {
    this.vistaFormulario = true;
    this.parametrosFormulario = {
      accion: LS.ACCION_CREAR,
      preliquidacionMotivoTO: new PrdPreLiquidacionMotivoTO(),
    };
  }

  eliminarPreLiquidacionMotivo(itemSeleccionado) {
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
        this.api.post("todocompuWS/produccionWebController/eliminarPrdPreLiquidacionMotivo", { prdPreLiquidacionMotivo: itemSeleccionado }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              this.refrescarTabla(itemSeleccionado, 'D');
              this.toastr.success(respuesta.operacionMensaje, 'Aviso');
            } else {
              this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
            }
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.cargando = false;
      }
    });
  }

  actualizarEstadoPreLiquidacionMotivo(item) {
    let itemCopy = JSON.parse(JSON.stringify(item));
    let parametros = {
      title: itemCopy.plmInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
      texto: (itemCopy.plmInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Liquidación de motivo: " + itemCopy.plmDetalle,
      type: LS.SWAL_QUESTION,
      confirmButtonText: LS.MSJ_SI_ACEPTAR,
      cancelButtonText: LS.MSJ_NO_CANCELAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.cargando = true;
        itemCopy.plmInactivo = !itemCopy.plmInactivo;
        itemCopy.usrEmpresa = '';
        this.api.post("todocompuWS/produccionWebController/modificarEstadoPrdPreLiquidacionMotivo", { prdPreLiquidacionMotivo: itemCopy, estado: itemCopy.plmInactivo }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              if (itemCopy.plmInactivo === true) {
                this.refrescarTabla(itemCopy, 'U');
                this.toastr.success(respuesta.operacionMensaje + LS.MSJ_ESTADO_INACTIVAR, 'Aviso');
                this.listarPreLiquidacionMotivo(this.frmPreLiquidacionMotivo, 'false');
              } else {
                this.refrescarTabla(itemCopy, 'U');
                this.toastr.success(respuesta.operacionMensaje + LS.MSJ_ESTADO_ACTIVAR, 'Aviso');
              }
            } else {
              this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
            }
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.cargando = false;
      }
    });
  }

  cancelar(event) {
    this.vistaFormulario = false;
    this.activar = false;
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        prdPreLiquidacionMotivo: this.listaResultado,
      };
      this.preLiquidacionService.imprimirPreLiquidacionMotivo(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        prdPreLiquidacionMotivo: this.listaResultado,
      };
      this.preLiquidacionService.exportarPreLiquidacionMotivo(parametros, this, this.empresaSeleccionada);
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionPreLiquidacionMotivo(LS.ATAJO_CONSULTAR, true);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionPreLiquidacionMotivo(LS.ACCION_EDITAR, true);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionPreLiquidacionMotivo(LS.ACCION_ELIMINAR, true);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.accion;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.accion;
    let perInactivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.filaSeleccionada.plmInactivo && !this.accion;
    let perActivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && this.filaSeleccionada.plmInactivo && !this.accion;

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionPreLiquidacionMotivo(LS.ACCION_CONSULTAR, true) },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionPreLiquidacionMotivo(LS.ACCION_EDITAR, perEditar) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionPreLiquidacionMotivo(LS.ACCION_ELIMINAR, perEliminar) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionPreLiquidacionMotivo(LS.ACCION_EDITAR_ESTADO, perActivar) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionPreLiquidacionMotivo(LS.ACCION_EDITAR_ESTADO, perInactivar) : null }
    ];
  }

  operacionPreLiquidacionMotivo(accion, tienePermiso) {
    if (tienePermiso) {
      switch (accion) {
        case LS.ACCION_CONSULTAR:
        case LS.ACCION_EDITAR:
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            accion: accion,
            preliquidacionMotivoTO: this.filaSeleccionada,
          }
          break;
        case LS.ACCION_ELIMINAR:
          this.eliminarPreLiquidacionMotivo(this.filaSeleccionada)
          break;
        case LS.ACCION_EDITAR_ESTADO:
          this.actualizarEstadoPreLiquidacionMotivo(this.filaSeleccionada)
          break;
      }
    }
  }

  ejecutarAccion(event) {
    switch (event.operacion || event.accion) {
      case LS.ACCION_CREAR:
        this.refrescarTabla(event, 'I');
        break;
      case LS.ACCION_EDITAR:
        this.refrescarTabla(event, 'U');
    }
  }

  refrescarTabla(prliquidacionTO, operacion: string) {
    let consumoEnLista: PrdPreLiquidacionMotivoTO = prliquidacionTO.liquidacionCopia || prliquidacionTO;
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(consumoEnLista);
          this.listaResultado = listaTemporal;
          this.actualizarFilas();
          this.listaResultadoTodo.unshift(consumoEnLista);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        var indexTemp = this.listaResultado.findIndex(item => item.prdPreLiquidacionMotivoPK.plmCodigo === consumoEnLista.prdPreLiquidacionMotivoPK.plmCodigo);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = consumoEnLista;
        this.listaResultado = listaTemporal;
        var indexTemp = this.listaResultadoTodo.findIndex(item => item.prdPreLiquidacionMotivoPK.plmCodigo === consumoEnLista.prdPreLiquidacionMotivoPK.plmCodigo);
        this.listaResultadoTodo[indexTemp] = consumoEnLista;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        var indexTemp = this.listaResultado.findIndex(item => item.prdPreLiquidacionMotivoPK.plmCodigo === consumoEnLista.prdPreLiquidacionMotivoPK.plmCodigo);
        this.listaResultado.splice(indexTemp, 1);
        var indexTemp = this.listaResultadoTodo.findIndex(item => item.prdPreLiquidacionMotivoPK.plmCodigo === consumoEnLista.prdPreLiquidacionMotivoPK.plmCodigo);
        this.listaResultadoTodo.splice(indexTemp, 1);
        this.gridApi ? this.gridApi.updateRowData({ remove: [consumoEnLista] }) : null;
        break;
      }
    }
    this.vistaFormulario = false;
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.preLiquidacionService.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.filaSeleccionada = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.filaSeleccionada = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = this.innerWidth <= 576 ? false : true; this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }
}
