import { Component, OnInit, HostListener } from '@angular/core';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AnxTipoIdentificacionTO } from '../../../../entidadesTO/anexos/AnxTipoIdentificacionTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { GridApi } from 'ag-grid';
import { TipoIdentificacionService } from './tipo-identificacion.service';
import { NgForm } from '@angular/forms';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-tipo-identificacion',
  templateUrl: './tipo-identificacion.component.html',
  styleUrls: ['./tipo-identificacion.component.css']
})
export class TipoIdentificacionComponent implements OnInit {
  
  public constantes: any;
  public cargando: boolean = false;
  public listaResultado: Array<AnxTipoIdentificacionTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public filasTiempo: FilasTiempo = new FilasTiempo();
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
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private tipoIdentificacion: TipoIdentificacionService,
    private filasService: FilasResolve,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['tipoIdentificacion'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.iniciarAgGrid();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
  }

  listaTipoIdentificacion(form?: NgForm) {
    this.filtrarRapido();
    if (form && form.valid) {
      this.cargando = true;
      this.tipoIdentificacion.obtenerAnexoTipoIdentificacionTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarAnexoTipoIdentificacion(lista) {
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
    this.columnDefs = this.tipoIdentificacion.generarColumnas();
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
