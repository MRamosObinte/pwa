import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { LS } from '../../../../constantes/app-constants';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { PrdContabilizarCorridaTO } from '../../../../entidadesTO/Produccion/PrdContabilizarCorridaTO';
import { ContabilizarIppCierreCorridasService } from '../../transacciones/contabilizar-ipp-cierre-corridas/contabilizar-ipp-cierre-corridas.service';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';

@Component({
  selector: 'app-contabilizar-ipp-cierre-corridas-listado',
  templateUrl: './contabilizar-ipp-cierre-corridas-listado.component.html',
  styleUrls: ['./contabilizar-ipp-cierre-corridas-listado.component.css']
})
export class ContabilizarIppCierreCorridasListadoComponent implements OnInit, OnChanges {

  @Input() parametrosBusqueda: any;//Objeto que puede tener los parametros {empresa, sector, fechaInicio, fechaFin}
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public constantes: any;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public listadoResultado: Array<PrdContabilizarCorridaTO> = [];
  public tamanioEstructura: number = 0;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public tamanio: string = "207px";
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;

  constructor(
    private contabilizarIppCierreCorridasService: ContabilizarIppCierreCorridasService,
    private atajoService: HotkeysService,
    public utilService: UtilService,
    public toastr: ToastrService
  ) {
    this.constantes = LS;
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.inicializarAtajos();
    this.iniciarAgGrid();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.parametrosBusqueda) {
      this.reiniciarValoresGenerales();
    }
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      if (this.listadoResultado.length > 0) {
        let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
        element ? element.click() : null;
        return false;
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONTABILIZAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnContabilizar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      if (!this.cargando) {
        this.limpiarResultado();
      }
      return false;
    }));
  }

  reiniciarValoresGenerales() {
    if (this.parametrosBusqueda.empCodigo) {
      this.activar = true;
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.limpiarResultado();
      this.listaContabilizarCorridaTO();
    } else {
      this.toastr.info(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TOAST_ADVERTENCIA);
    }
  }

  listaContabilizarCorridaTO() {
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    this.contabilizarIppCierreCorridasService.listaContabilizarCorridaTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListaContabilizarCorridaTO(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultado = data;
    this.cargando = false;
    this.cambiarActivar(this.activar);
  }

  limpiarResultado() {
    this.listadoResultado = [];
    this.enviarActivar.emit(false);
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(this.activar);
  }

  contabilizar() {
    this.cargando = true;
    this.parametrosBusqueda['listaContabilizarCorrida'] = this.listadoResultado;
    this.contabilizarIppCierreCorridasService.insertarModificarContabilizarCorrida(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.contabilizarIppCierreCorridasService.generarColumnas();
    this.frameworkComponents = {
      toolTip: TooltipReaderComponent
    };
  }
  //#endregion

}
