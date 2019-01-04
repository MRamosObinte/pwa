import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { HotkeysService, Hotkey } from '../../../../../../node_modules/angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { ContabilizarMaterialDirectoService } from '../../transacciones/contabilizar-material-directo/contabilizar-material-directo.service';
import { ConFunIPPTO } from '../../../../entidadesTO/contabilidad/ConFunIPPTO';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contabilizar-ipp-listado',
  templateUrl: './contabilizar-ipp-listado.component.html',
  styleUrls: ['./contabilizar-ipp-listado.component.css']
})
export class ContabilizarIppListadoComponent implements OnInit, OnChanges {

  @Input() parametrosBusqueda: any;//Objeto que puede tener los parametros {empresa, sector, fechaInicio, fechaFin}
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() titulo: string = "";
  
  public constantes: any;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public listadoResultado: Array<ConFunIPPTO> = [];
  public tamanioEstructura: number = 0;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public tamanio: string = "207px";

  //AG-GRID
  public columnDefs: Array<object> = [];

  constructor(
    private contabilizarMeterialDirectoService: ContabilizarMaterialDirectoService,
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
      if(!this.cargando){
        this.limpiarResultado();
      }
      return false;
    }));
  }

  reiniciarValoresGenerales() {
    if (this.parametrosBusqueda.empresa) {
      this.activar = true;
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.limpiarResultado();
      this.listarIPP();
    } else {
      this.toastr.info(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TOAST_ADVERTENCIA);
    }
  }

  listarIPP() {
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    this.contabilizarMeterialDirectoService.listarIPP(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarIPP(data) {
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
    if (this.listadoResultado && this.listadoResultado.length > 1) {
      this.listadoResultado.pop();
    }
    if (this.validarListadoIPP(this.listadoResultado)) {
      this.parametrosBusqueda['tipo'] = this.parametrosBusqueda.parametro;
      this.contabilizarMeterialDirectoService.insertarModificarIPP(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  validarListadoIPP(listado: Array<ConFunIPPTO>): boolean {
    if (listado && listado.length > 0) {
      for (let objeto of listado) {
        if (!objeto.costoCuentaOrigen) {
          this.cargando = false;
          this.contabilizarMeterialDirectoService.mostrarSwalError(LS.MSJ_NO_CUENTA_ORIGEN + objeto.costoPiscina + LS.MSJ_DEL_SECTOR + objeto.costoSector);
          return false;
        }
        if (!objeto.costoCuentaDestino) {
          this.cargando = false;
          this.contabilizarMeterialDirectoService.mostrarSwalError(LS.MSJ_NO_CUENTA_DESTINO + objeto.costoPiscina + LS.MSJ_DEL_SECTOR + objeto.costoSector);
          return false;
        }
      }
    }
    return true;
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.contabilizarMeterialDirectoService.generarColumnas();
  }
  //#endregion

}
