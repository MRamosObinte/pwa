import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, OnChanges, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { RhListaProvisionesTO } from '../../../../entidadesTO/rrhh/RhListaProvisionesTO';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ProvisionesService } from '../../transacciones/provisiones/provisiones.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';
import { ConContable } from '../../../../entidades/contabilidad/ConContable';
import { ImprimirComponent } from '../../../../componentesgenerales/imprimir/imprimir.component';
import { ComprobanteRolComponent } from '../comprobante-rol/comprobante-rol.component';

@Component({
  selector: 'app-provisiones-listado',
  templateUrl: './provisiones-listado.component.html',
  styleUrls: ['./provisiones-listado.component.css']
})
export class ProvisionesListadoComponent implements OnInit, OnChanges {

  @Input() parametrosBusqueda: any = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Input() isModal: boolean;
  @Output() enviarActivar = new EventEmitter();
  @Output() estadoformulario = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();

  public listaProvisiones: Array<RhListaProvisionesTO> = [];
  public listaProvisionesImprimir: Array<RhListaProvisionesTO> = [];
  public objetoSeleccionado: RhListaProvisionesTO = new RhListaProvisionesTO();
  public constantes: any = LS;
  public innerWidth: number;
  public enterKey: number = 0;//Suma el numero de enter
  public filtroGlobal: string = "";
  public accion: string = "";
  public isScreamMd: boolean;//Identifica si la pantalla es tamaño MD
  public activar: boolean = false;
  public cargando: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public objetoContableEnviar: any = {};
  public mostrarAccionesContabilidad: boolean = false; //flag para ocultar o mostrar formulario contabilidad
  public disableGuardar: boolean = true;
  //
  public conContable: ConContable = new ConContable();
  public contablePk: ConContablePK = new ConContablePK();
  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public frameworkComponents;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private provisionesService: ProvisionesService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;//Obtiene el tamaño de la pantalla
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.generarAtajos();
    this.iniciarAgGrid();
  }

  ngOnChanges(changes) {
    if (changes.parametrosBusqueda) {
      this.buscarProvisiones();
      this.generarAtajos();
    } else {
      this.listaProvisiones = new Array();
    }
  }

  // metodo para regresar la vista anterior (regresar)
  regresar() {
    let parametros = null
    this.enviarAccion.emit(parametros);
  }

  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  buscarProvisiones() {
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    this.listaProvisiones = new Array();
    let parametros = {
      provisionesListadoTransTO: this.parametrosBusqueda.provisionesListadoTransTO
    }
    this.provisionesService.listarProvisiones(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarProvisiones(data) {
    if (data.length > 1) {
      this.filasTiempo.finalizarContador();
      this.listaProvisiones = data;
      this.verificarProvisionesAntesGuardar();
      this.cargando = false;
    } else {
      this.toastr.warning(LS.MSJ_NO_SE_ENCONTRARON_RESULTADOS, 'Aviso');
      this.cargando = false;
    }
  }

  verificarProvisionesAntesGuardar() {
    let valor = this.listaProvisiones.find(item => item.provContableProvision !== null) ? true : false;
    this.disableGuardar = valor;
  }

  guardarProvision() {
    this.cargando = true;
    let parametros = {
      listaProvisionesTO: this.listaProvisiones,
      provisionesListadoTransTO: this.parametrosBusqueda.provisionesListadoTransTO,
      contableProvision: this.parametrosBusqueda.contableProvision
    }
    this.provisionesService.insertarProvision(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeInsertarProvison(data) {
    if (data) {
      this.contablePk = data.extraInfo.contablePk;
      this.listaProvisionesImprimir = data.extraInfo.listaProvisionesImprimir;
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
      this.preguntarImprimir(data.operacionMensaje);
    }
    this.cargando = false;
  }

  preguntarImprimir(texto: string) {
    const modalRef = this.modalService.open(ImprimirComponent, { backdrop: 'static' });
    modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
    //Imprimir contable
    let listaPk = [];
    listaPk.push(this.contablePk);
    modalRef.componentInstance.parametrosImprimir = { listadoPK: listaPk };
    modalRef.componentInstance.nombreRutaImprimir = "todocompuWS/contabilidadWebController/generarReporteContableIndividual";
    modalRef.componentInstance.nombreArchivoPDFImprimir = "reportComprobanteContable";
    //Imprimir combo
    modalRef.componentInstance.parametrosImprimirCombo = {
      listaProvisionesTO: this.listaProvisionesImprimir,
      contablePK: this.contablePk,
      periodo: this.parametrosBusqueda.provisionesListadoTransTO.periodo
    };
    modalRef.componentInstance.nombrerutaImprimirCombo = "todocompuWS/rrhhWebController/generarReporteProvisionesComprobanteContableProvision";
    modalRef.componentInstance.nombreArchivoPDFImprimirCombo = "reportComprobanteProvisiones";
    modalRef.componentInstance.textoImprimirCombo = LS.LABEL_IMPRIMIR_COMPROBANTE_PROVISION;
    //Ambos
    modalRef.componentInstance.mensaje = texto;
    modalRef.componentInstance.mostrarCombo = true;

    modalRef.result.then((result) => {
      if (result) {
      } else {
      }
    }, () => {
      this.cargando = false;
      this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    });
  }

  consultar() {
    this.emitirAccion(LS.ACCION_CONSULTAR, this.objetoSeleccionado);
  }

  /**Modal */
  filaSeleccionar() {
    this.enviarItem(this.objetoSeleccionado);
  }

  enviarItem(item) {
    this.activeModal.close(item);
  }

  emitirAccion(accion, seleccionado: RhListaProvisionesTO) {
    let parametros = {
      accion: accion,
      objetoSeleccionado: seleccionado
    }
    this.enviarAccion.emit(parametros);
  }

  cambiarActivar() {
    this.activar = !this.activar;
    this.enviarActivar.emit(this.activar);
  }

  cambiarActivarPaContable() {
    this.enviarActivar.emit(this.activar);
  }

  cambiarEstadoFormulario(estado) {
    this.estadoformulario.emit(estado);
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarAnticipos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarProvision') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      if (this.parametrosBusqueda.accion === LS.ACCION_CONSULTAR) {
        let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
        element ? element.click() : null;
      }
      return false;
    }))
  }

  generarOpciones() {
    let contable: boolean = this.objetoSeleccionado.provContableProvision ? false : true;
    this.opciones = [
      { label: LS.TAG_CONTABLE_ROL, icon: LS.ICON_BUSCAR, disabled: false, command: () => this.visualizarVista(LS.TAG_CONTABLE_ROL) },
      { label: LS.TAG_CONTABLE_PROVISION, icon: LS.ICON_BUSCAR, disabled: contable, command: () => this.visualizarVista(LS.TAG_CONTABLE_PROVISION) },
      { label: LS.TAG_COMPROBANTE_ROL, icon: LS.ICON_BUSCAR, disabled: false, command: () => this.visualizarVista(LS.TAG_COMPROBANTE_ROL) }
    ];
  }

  visualizarVista(vista) {
    if (this.objetoSeleccionado.provId) {
      switch (vista) {
        case LS.TAG_CONTABLE_ROL: {
          this.verContable(this.objetoSeleccionado.provContableRol);
          break;
        }
        case LS.TAG_CONTABLE_PROVISION: {
          this.verContable(this.objetoSeleccionado.provContableProvision);
          break;
        }
        case LS.TAG_COMPROBANTE_ROL: {
          this.consultarComprobante();
          break;
        }
      }
    }
  }

  // contable
  verContable(contable) {
    if (contable) {
      this.mostrarAccionesContabilidad = true;
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: contable,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: null,
        listaPeriodos: [],
        volverACargar: true
      };
      this.cdRef.detectChanges();
    } else {
      this.toastr.warning(LS.MSJ_NO_SE_ENCONTRARON_RESULTADOS, 'Aviso');
    }
  }

  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : false;
    this.cambiarActivarPaContable();
    this.cambiarEstadoFormulario(event.mostrarContilidadAcciones);
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarAccionesContabilidad = event.mostrarContilidadAcciones;
    this.generarAtajos();
    this.cdRef.detectChanges();
  }

  cambiarEstadoActivarContable(event) {
    this.activar = event;
    this.cdRef.detectChanges();
    this.cambiarActivarPaContable();
  }

  //COMPROBANTE
  consultarComprobante() {
    if (this.objetoSeleccionado.provContableRol) {
      let contable = new ConContablePK();
      contable.conEmpresa = this.empresaSeleccionada.empCodigo;
      contable.conNumero = this.objetoSeleccionado.provContableRol.split('|')[2].trim();
      contable.conPeriodo = this.objetoSeleccionado.provContableRol.split('|')[0].trim();
      contable.conTipo = this.objetoSeleccionado.provContableRol.split('|')[1].trim();

      let parametros = {
        empresa: this.empresaSeleccionada.empCodigo,
        idEmpleado: this.objetoSeleccionado.provId,
        conContablePK: contable
      };
      const modalRef = this.modalService.open(ComprobanteRolComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.parametros = parametros;
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.componentInstance.accion = LS.ACCION_CONSULTAR;
      modalRef.componentInstance.rutaImprimir = 'todocompuWS/rrhhWebController/imprimirComprobanteRolListado';
      modalRef.result.then(() => {
        this.generarAtajos();
      }, () => {
        this.generarAtajos();
      });
    }
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.provisionesService.generarColumnas(this.isModal);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
    };
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
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

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    if (this.objetoSeleccionado.provId) {
      this.generarOpciones();
      this.menuOpciones.show(event);
      event.stopPropagation();
    }
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
}
