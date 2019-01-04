import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { HotkeysService, Hotkey } from '../../../../../../node_modules/angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { LS } from '../../../../constantes/app-constants';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { ToastrService } from 'ngx-toastr';
import { ContabilizarMaterialDirectoService } from '../contabilizar-material-directo/contabilizar-material-directo.service';
import { ConFunIPPTO } from '../../../../entidadesTO/contabilidad/ConFunIPPTO';
import { ContabilizarIppCierreCorridasService } from '../contabilizar-ipp-cierre-corridas/contabilizar-ipp-cierre-corridas.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';

@Component({
  selector: 'app-contabilizar-todo-proceso',
  templateUrl: './contabilizar-todo-proceso.component.html',
  styleUrls: ['./contabilizar-todo-proceso.component.css']
})
export class ContabilizarTodoProcesoComponent implements OnInit {

  /* Generales */
  public constantes: any;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public frmTitulo: string;
  public classTitulo: string;
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public es: any;
  public vistaFormulario: boolean = false;//Es true siempre que es listado tambien sea true
  public vistaListado: boolean = false;
  public parametroBusquedaListado: any = {};
  //Formulario
  public mostrarDialogo: boolean = false;
  public listaMensajes: Array<string> = [];
  public tituloDialogo: string = "";
  public tamanio: string = "255px";
  //tablas
  public columnasDirectoIndirecto: any = [];
  public columnasCorrida: any = [];
  public listadoDirecto: any = [];
  public listadoIndirecto: any = [];
  public listadoCorrida: any = [];
  public mensajeDirecto: string = "";
  public mensajeIndirecto: string = "";
  public mensajeCorrida: string = "";
  @Output() enviarActivar: EventEmitter<any> = new EventEmitter();
  public filasTiempo: FilasTiempo = new FilasTiempo();

  constructor(
    private contabilizarMeterialDirectoService: ContabilizarMaterialDirectoService,
    private contabilizarIppCierreCorridasService: ContabilizarIppCierreCorridasService,
    private sectorService: SectorService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private sistemaService: AppSistemaService
  ) {
    this.constantes = LS; //Hace referncia a los constantes
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['contabilizarIPPTodoProceso'];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.cambiarEmpresaSelect();
    }
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.inicializarAtajos();
    this.inicializarColumnas();
    this.obtenerFechaInicioActualMes();
  }

  inicializarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CONTABILIZAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnContabilizar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      if (!this.cargando) {
        this.limpiarLista();
      }
      return false;
    }));
  }

  inicializarColumnas() {
    this.columnasDirectoIndirecto = this.contabilizarMeterialDirectoService.generarColumnas();
    this.columnasCorrida = this.contabilizarIppCierreCorridasService.generarColumnas();
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarLista();
    this.activar = false;
    this.listarSectores();
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarLista() {
    this.vistaListado = false;
    this.activar = false;
    this.filasService.actualizarFilas(0);
  }

  listarSectores() {
    this.cargando = true;
    this.listaSectores = [];
    this.sectorSeleccionado = null;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.listaSectores = data;
    if (this.listaSectores.length > 0)
      this.sectorSeleccionado = this.listaSectores[0];
    this.cargando = false;
  }

  listaContabilizarTodoProceso() {
    this.cargando = true;
    this.limpiarResultado();
    let fechaInicio = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde);
    let fechaFin = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta);
    if (this.fechaDesde && this.fechaHasta && fechaInicio.split('-')[0] === fechaFin.split('-')[0]) {
      let parametros = {
        empresa: LS.KEY_EMPRESA_SELECT,
        fechaDesde: fechaInicio,
        fechaHasta: fechaFin
      }
      this.parametroBusquedaListado = parametros;
      this.filasTiempo.iniciarContador();
      this.contabilizarMeterialDirectoService.listarTodoProceso(parametros, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
      this.toastr.warning(LS.MSJ_FECHAS_DIFERENTES, LS.TOAST_ADVERTENCIA)
    }
  }

  modificarActivar(event) {
    this.activar = event;
  }

  limpiarResultado() {
    this.listadoDirecto = [];
    this.listadoIndirecto = [];
    this.listadoCorrida = [];
    this.mensajeDirecto = "";
    this.mensajeIndirecto = "";
    this.mensajeCorrida = "";
    this.vistaListado = false;
  }

  despuesDeListarTodoProceso(data) {
    this.filasTiempo.finalizarContador();
    this.listadoDirecto = data.listadoDirecto;
    this.listadoIndirecto = data.listadoIndirecto;
    this.listadoCorrida = data.listadoCorrida;
    this.mensajeDirecto = data.mensajeDirecto;
    this.mensajeIndirecto = data.mensajeIndirecto;
    this.mensajeCorrida = data.mensajeCorrida;
    if (this.mensajeDirecto === LS.MSJ_CONTABILIZAR_TODO_PROCESO_DIRECTO && this.mensajeIndirecto === LS.MSJ_CONTABILIZAR_TODO_PROCESO_INDIRECTO && this.mensajeCorrida === LS.MSJ_CONTABILIZAR_TODO_PROCESO_CORRIDA) {
      this.vistaListado = false;
      this.toastr.warning(LS.MSJ_NO_RESULTADOS, LS.TOAST_ADVERTENCIA)
    } else if (this.mensajeDirecto === LS.MSJ_COSNSUMOS_PENDIENTES && this.mensajeIndirecto === LS.MSJ_COSNSUMOS_PENDIENTES && this.mensajeCorrida === LS.MSJ_CONTABILIZAR_TODO_PROCESO_CORRIDA) {
      this.vistaListado = false;
      this.toastr.warning(LS.MSJ_COSNSUMOS_PENDIENTES, LS.TOAST_ADVERTENCIA)
    } else {
      this.vistaListado = true;
    }
    this.cargando = false;
  }

  contabilizar() {
    this.cargando = true;
    if (this.listadoDirecto && this.listadoDirecto.length > 1) {
      this.listadoDirecto.pop();
    }
    if (this.listadoIndirecto && this.listadoIndirecto.length > 1) {
      this.listadoIndirecto.pop();
    }
    if (this.validarListadoIPP(this.listadoDirecto) && this.validarListadoIPP(this.listadoIndirecto)) {
      let fechaInicio = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde);
      let fechaFin = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta);

      if ((this.listadoDirecto) && (this.listadoDirecto.length >= 1) && (this.listadoIndirecto) && (this.listadoIndirecto.length >= 1) && (this.listadoCorrida) && (this.listadoCorrida.length >= 1)) {
        this.parametroBusquedaListado['listaContabilizarCorrida'] = this.listadoCorrida;
        this.contabilizarMeterialDirectoService.contabilizarTodoProceso(this.parametroBusquedaListado, this, LS.KEY_EMPRESA_SELECT);
      } else {
        if (this.listadoDirecto && this.listadoDirecto.length >= 1) {
          let parametro = {
            empresa: LS.KEY_EMPRESA_SELECT,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            tipo: 'DIRECTO'
          }
          this.contabilizarMeterialDirectoService.insertarModificarIPP(parametro, this, LS.KEY_EMPRESA_SELECT);
        }
        if (this.listadoIndirecto && this.listadoIndirecto.length >= 1) {
          let parametro = {
            empresa: LS.KEY_EMPRESA_SELECT,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            tipo: 'INDIRECTO'
          }
          this.contabilizarMeterialDirectoService.insertarModificarIPP(parametro, this, LS.KEY_EMPRESA_SELECT);
        }
        if (this.listadoCorrida && this.listadoCorrida.length >= 1) {
          let parametro = {
            empresa: LS.KEY_EMPRESA_SELECT,
            fechaDesde: fechaInicio,
            fechaHasta: fechaFin,
            listaContabilizarCorrida: this.listadoCorrida
          }
          this.contabilizarIppCierreCorridasService.insertarModificarContabilizarCorrida(parametro, this, LS.KEY_EMPRESA_SELECT);
        }
      }
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
}
