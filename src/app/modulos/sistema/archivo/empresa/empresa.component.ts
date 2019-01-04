import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { EmpresaService } from './empresa.service';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../serviciosgenerales/auth.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {
  //[ELEMENTOS GENERALES]
  public cargando: boolean = false;
  public accion: string = null;
  public vistaFormulario: boolean = false;
  public constantes: any = LS; //Referencia a las constantes
  public opciones: MenuItem[] = []; //Listado de opciones que apareceran en la lista
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public isScreamMd: boolean; //Bandera para indicar el tamaño de la pantalla
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listadoResultado: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO(); //Objeto actualmente seleccionado
  public titulo: string = "";
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
  //tipoVista
  public configuracionCorreo: boolean = false;
  public administracionEmpresa: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private utilService: UtilService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private empresaService: EmpresaService,
    private auth: AuthService
  ) {
    if (this.route.snapshot.data['administracionEmpresa']) {
      this.listarEmpresasParaAdministracion();
      this.administracionEmpresa = true;
      this.titulo = LS.ADMINISTRACION_EMPRESAS;
    } else {
      this.listaEmpresas = this.route.snapshot.data['configuracionCorreo'];
      this.configuracionCorreo = true;
      this.titulo = LS.PEDIDOS_CONFIGURACION_CORREO;
      this.listadoResultado = this.listaEmpresas;
    }
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.iniciarAtajos();
    this.iniciarAgGrid();
  }

  listarEmpresasParaAdministracion() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      usrCodigo: this.auth.getCodigoUser()
    }
    this.empresaService.listarEmpresasParaAdministracion(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarEmpresasParaAdministracion(data) {
    this.listaEmpresas = data;
    this.listadoResultado = this.listaEmpresas;
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  generarOpciones() {
    let perEditar = this.configuracionCorreo ? this.empresaSeleccionada.listaSisPermisoTO.gruModificar : true;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, command: (event) => this.consultarEmpresa() },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editarEmpresa() : null }
    ];
  }

  editarEmpresa() {
    this.vistaFormulario = true;
    this.accion = LS.ACCION_EDITAR;
  }

  consultarEmpresa() {
    this.vistaFormulario = true;
    this.accion = LS.ACCION_CONSULTAR;
  }

  cancelar() {
    this.vistaFormulario = false;
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

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  getDataSelected(): Array<any> {
    return this.utilService.getAGSelectedData(this.gridApi);
  }

  refrescarTabla(empresa: PermisosEmpresaMenuTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          listaTemporal.unshift(empresa);
          this.listadoResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.empCodigo === empresa.empCodigo);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = empresa;
        this.listadoResultado = listaTemporal;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoResultado.findIndex(item => item.empCodigo === empresa.empCodigo);
        this.listadoResultado = this.listadoResultado.filter((val, i) => i != indexTemp);
        break;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }
  //#endregion

}
