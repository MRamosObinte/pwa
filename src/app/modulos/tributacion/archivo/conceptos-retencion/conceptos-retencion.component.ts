import { Component, OnInit, HostListener, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConceptosRetencionService } from './conceptos-retencion.service';
import { LS } from '../../../../constantes/app-constants';
import { ToastrService } from 'ngx-toastr';
import { GridApi } from 'ag-grid';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ActivatedRoute } from '@angular/router';
import { AnxConceptoTO } from '../../../../entidadesTO/anexos/AnxConceptoTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-conceptos-retencion',
  templateUrl: './conceptos-retencion.component.html',
  styleUrls: ['./conceptos-retencion.component.css']
})
export class ConceptosRetencionComponent implements OnInit {
  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public enterKey: number = 0;//Suma el numero de enter
  public cargando: boolean = false;
  public listaResultado: Array<AnxConceptoTO> = [];
  public objetoSeleccionado: AnxConceptoTO;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public constantes: any;
  public accion: String = null;
  public activar: boolean = false;
  public classIcon: string = LS.ICON_FILTRAR;
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public screamXS: boolean = true;
  public filtroGlobal = "";

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private conceptoRetencion: ConceptosRetencionService,
    private filasService: FilasResolve,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    if (this.isModal) {
      this.listarconceptos();
    } else {
      this.listaEmpresas = this.route.snapshot.data['conceptosRetencion'];
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
      this.iniciarAgGrid();
    }
  }

  listarconceptos() {
    this.filtroGlobal = "";
    this.cargando = true;
    this.conceptoRetencion.listarAnxConceptoTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAnxConceptoTO(data) {
    this.listaResultado = data;
    this.iniciarAgGrid();
    this.cargando = false;
    if (this.isModal && data.length == 1) {
      this.activeModal.close(data[0]);
    }
  }

  enviarItem(item) {
    this.activeModal.close(item);
  }

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

  listarConceptoRetencion(form?: NgForm) {
    this.filtrarRapido();
    if (form && form.valid) {
      this.cargando = true;
      this.conceptoRetencion.obtenerAnexoConceptoTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarAnexoConcepto(lista) {
    this.cargando = false;
    this.listaResultado = lista;
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listaResultado = [];
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.isModal ? this.conceptoRetencion.generarColumnasModal() : this.conceptoRetencion.generarColumnas();
    this.columnDefsSelected = this.columnDefs;
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
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

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }
}
