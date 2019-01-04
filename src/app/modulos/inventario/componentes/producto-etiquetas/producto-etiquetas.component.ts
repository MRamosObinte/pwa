import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { InvProductoEtiquetas } from '../../../../entidades/inventario/InvProductoEtiquetas';
import { ProductoEtiquetasService } from './producto-etiquetas.service';
import { ActivatedRoute } from '@angular/router';
import { ContextMenu } from 'primeng/contextmenu';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { EmpresaService } from '../../../sistema/archivo/empresa/empresa.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-producto-etiquetas',
  templateUrl: './producto-etiquetas.component.html',
  styleUrls: ['./producto-etiquetas.component.css']
})
export class ProductoEtiquetasComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() accion: string = null;
  @Input() pedidos: boolean = false;
  public vistaFormulario: boolean = false;
  public cargando: boolean = false;
  public constantes: any = {};
  public invProductoEtiquetas: InvProductoEtiquetas = new InvProductoEtiquetas();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public isScreamMd: boolean;//Identifica si la pantalla es tamaño MD

  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[] = []; //Listado de opciones que apareceran en la lista
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
  public rowClassRules: any = {};
  //formulario validar cancelar
  @ViewChild("frmProductoEtiquetas") frmProductoEtiquetas: NgForm;
  public valoresIniciales: any;

  constructor(
    private utilService: UtilService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private filasService: FilasResolve,
    private empresaService: EmpresaService,
    private etiquetasService: ProductoEtiquetasService
  ) {
    this.constantes = LS;
  }

  ngOnInit() {
    if (!this.pedidos) {
      this.listaEmpresas = this.route.snapshot.data['configuracionPrecios'];
    }
    if (this.empresaSeleccionada && this.accion) {
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      switch (this.accion) {
        case LS.ACCION_CREAR: {
          break;
        }
        case LS.ACCION_EDITAR: {
          this.obtenerEtiquetas();
          break;
        }
        case LS.ACCION_CONSULTAR: {
          this.obtenerEtiquetas();
          break;
        }
      }
    }
    this.iniciarAtajos();
    this.iniciarAgGrid();
  }

  cancelar() {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_CREAR:
        if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmProductoEtiquetas)) {
          this.vistaFormulario = false;
        } else {
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI_ACEPTAR,
            cancelButtonText: LS.MSJ_NO_CANCELAR
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.vistaFormulario = false;
            }
          });
        }
        break;
      default:
        this.vistaFormulario = false;
    }
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmProductoEtiquetas ? this.frmProductoEtiquetas.value : null));
    }, 50);
  }

  consultar() {
    this.accion = LS.ACCION_CONSULTAR;
    this.obtenerEtiquetas();
  }

  editar() {
    this.accion = LS.ACCION_EDITAR;
    this.obtenerEtiquetas();
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  obtenerEtiquetas() {
    this.cargando = true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.etiquetasService.obtenerEtiquetas(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerEtiquetas(data) {
    this.cargando = false;
    this.vistaFormulario = true;
    if (this.pedidos) {
      data ? this.invProductoEtiquetas = new InvProductoEtiquetas(data) : this.activeModal.dismiss('Close');
    } else {
      if (this.accion == LS.ACCION_EDITAR) {
        if (data) {
          this.invProductoEtiquetas = new InvProductoEtiquetas(data);
        } else {
          this.invProductoEtiquetas = new InvProductoEtiquetas();
          this.accion == LS.ACCION_CREAR;
        }
      } else {
        data ? this.invProductoEtiquetas = new InvProductoEtiquetas(data) : this.vistaFormulario = false;
      }
    }
    this.extraerValoresIniciales();
  }

  insertarProductoEtiquetas(form: NgForm) {
    if (this.utilService.verificarPermiso(this.accion, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (formularioTocado && form && form.valid) {
        this.invProductoEtiquetas = this.formatearInvProductoEtiquetas(this.invProductoEtiquetas);
        let parametro = { 'invProductoEtiquetas': this.invProductoEtiquetas };
        this.api.post("todocompuWS/inventarioWebController/insertarInvProductoEtiquetas", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
              this.vistaFormulario = false;
              this.cerrarModal(respuesta.extraInfo);
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ERROR);
            }
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  cerrarModal(invProductoEtiquetas: InvProductoEtiquetas) {
    this.activeModal.close(invProductoEtiquetas);
  }

  minimizarModal() {
    this.activeModal.dismiss('Cerrar');
  }

  formatearInvProductoEtiquetas(invProductoEtiquetas: InvProductoEtiquetas): InvProductoEtiquetas {
    let invProductoEtiquetasCopia = new InvProductoEtiquetas(invProductoEtiquetas);
    invProductoEtiquetasCopia.eempresa = LS.KEY_EMPRESA_SELECT;
    invProductoEtiquetasCopia.ecosto01 = invProductoEtiquetasCopia.ecosto01 ? invProductoEtiquetasCopia.ecosto01 : null;
    invProductoEtiquetasCopia.ecosto02 = invProductoEtiquetasCopia.ecosto02 ? invProductoEtiquetasCopia.ecosto02 : null;
    invProductoEtiquetasCopia.ecosto03 = invProductoEtiquetasCopia.ecosto03 ? invProductoEtiquetasCopia.ecosto03 : null;
    invProductoEtiquetasCopia.ecosto04 = invProductoEtiquetasCopia.ecosto04 ? invProductoEtiquetasCopia.ecosto04 : null;
    invProductoEtiquetasCopia.ecosto05 = invProductoEtiquetasCopia.ecosto05 ? invProductoEtiquetasCopia.ecosto05 : null;
    invProductoEtiquetasCopia.eprecio01 = invProductoEtiquetasCopia.eprecio01 ? invProductoEtiquetasCopia.eprecio01 : 'PVP';
    invProductoEtiquetasCopia.eprecio02 = invProductoEtiquetasCopia.eprecio02 ? invProductoEtiquetasCopia.eprecio02 : null;
    invProductoEtiquetasCopia.eprecio03 = invProductoEtiquetasCopia.eprecio03 ? invProductoEtiquetasCopia.eprecio03 : null;
    invProductoEtiquetasCopia.eprecio04 = invProductoEtiquetasCopia.eprecio04 ? invProductoEtiquetasCopia.eprecio04 : null;
    invProductoEtiquetasCopia.eprecio05 = invProductoEtiquetasCopia.eprecio05 ? invProductoEtiquetasCopia.eprecio05 : null;
    invProductoEtiquetasCopia.eprecio06 = invProductoEtiquetasCopia.eprecio06 ? invProductoEtiquetasCopia.eprecio06 : null;
    invProductoEtiquetasCopia.eprecio07 = invProductoEtiquetasCopia.eprecio07 ? invProductoEtiquetasCopia.eprecio07 : null;
    invProductoEtiquetasCopia.eprecio08 = invProductoEtiquetasCopia.eprecio08 ? invProductoEtiquetasCopia.eprecio08 : null;
    invProductoEtiquetasCopia.eprecio09 = invProductoEtiquetasCopia.eprecio09 ? invProductoEtiquetasCopia.eprecio09 : null;
    invProductoEtiquetasCopia.eprecio10 = invProductoEtiquetasCopia.eprecio10 ? invProductoEtiquetasCopia.eprecio10 : null;
    invProductoEtiquetasCopia.eprecio11 = invProductoEtiquetasCopia.eprecio11 ? invProductoEtiquetasCopia.eprecio11 : null;
    invProductoEtiquetasCopia.eprecio12 = invProductoEtiquetasCopia.eprecio12 ? invProductoEtiquetasCopia.eprecio12 : null;
    invProductoEtiquetasCopia.eprecio13 = invProductoEtiquetasCopia.eprecio13 ? invProductoEtiquetasCopia.eprecio13 : null;
    invProductoEtiquetasCopia.eprecio14 = invProductoEtiquetasCopia.eprecio14 ? invProductoEtiquetasCopia.eprecio14 : null;
    invProductoEtiquetasCopia.eprecio15 = invProductoEtiquetasCopia.eprecio15 ? invProductoEtiquetasCopia.eprecio15 : null;
    invProductoEtiquetasCopia.eprecio16 = invProductoEtiquetasCopia.eprecio16 ? invProductoEtiquetasCopia.eprecio16 : null;
    return invProductoEtiquetasCopia;
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.empresaService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent
    };
    this.components = {};
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.empresaSeleccionada = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  generarOpciones() {
    let perEditar = this.empresaSeleccionada ? this.empresaSeleccionada.listaSisPermisoTO.gruModificar : false;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, command: (event) => this.consultar() },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editar() : null }
    ];
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

}
