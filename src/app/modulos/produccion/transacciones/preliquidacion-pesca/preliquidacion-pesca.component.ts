import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { LS } from '../../../../constantes/app-constants';
import { ListaPreLiquidacionTO } from '../../../../entidadesTO/Produccion/ListaPreLiquidacionTO';
import { PrdPiscinaTO } from '../../../../entidadesTO/Produccion/PrdPiscinaTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdLiquidacionMotivoTO } from '../../../../entidadesTO/Produccion/PrdLiquidacionMotivoTO';
import { ContextMenu } from 'primeng/contextmenu';
import { SectorService } from '../../archivos/sector/sector.service';
import { PiscinaService } from '../../archivos/piscina/piscina.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { LiquidacionMotivoService } from '../../archivos/liquidacion-motivo/liquidacion-motivo.service';
import { PreliquidacionPescaService } from './preliquidacion-pesca.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { NgForm } from '@angular/forms';
import { PrdPreLiquidacionPK } from '../../../../entidades/produccion/PrdPreLiquidacionPK';
import swal from 'sweetalert2';
import { PrdPreLiquidacion } from '../../../../entidades/produccion/PrdPreLiquidacion';
import { PrdPreLiquidacionMotivoTO } from '../../../../entidadesTO/Produccion/PrdPreLiquidacionMotivoTO';
import { PreLiquidacionMotivoService } from '../../archivos/pre-liquidacion-motivo/pre-liquidacion-motivo.service';

@Component({
  selector: 'app-preliquidacion-pesca',
  templateUrl: './preliquidacion-pesca.component.html',
  styleUrls: ['./preliquidacion-pesca.component.css']
})
export class PreliquidacionPescaComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaPiscinas: Array<PrdPiscinaTO> = [];
  public listaMotivos: Array<PrdPreLiquidacionMotivoTO> = [];
  public listaResultado: Array<ListaPreLiquidacionTO> = [];

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public piscinaSeleccionada: PrdPiscinaTO = new PrdPiscinaTO();
  public preLiquidacionSeleccionada: ListaPreLiquidacionTO = new ListaPreLiquidacionTO();

  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public opciones: MenuItem[];
  //Form
  public parametrosFormulario = null;
  public mostrarFormulario: boolean = false;
  public fechaActual: Date;
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public frameworkComponents;
  public components: any = {};
  public context;
  public screamXS: boolean = true;
  public filtroGlobal = "";

  constructor(
    private sectorService: SectorService,
    private piscinaService: PiscinaService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
    private preLiquidacionService: PreLiquidacionMotivoService,
    private preLiquidacionPescaService: PreliquidacionPescaService,
    private archivoService: ArchivoService,
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data["preLiquidacionPescaListado"];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaActual();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarLiquidacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevaPreLiquidacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarPreLiquidacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirPreLiquidacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarPreLiquidacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.piscinaSeleccionada = null;
    this.limpiarResultado();
    this.listarSectores();
    this.listarLiquidacionMotivoTO();
  }

  limpiarResultado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.listaResultado = [];
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  generarOpciones() {
    let perConsultar = true;
    let perDesmayorizar = this.preLiquidacionPescaService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada) && ((!this.preLiquidacionSeleccionada.plPendiente || this.preLiquidacionSeleccionada.plPendiente === " ")
      && (!this.preLiquidacionSeleccionada.plAnulado || this.preLiquidacionSeleccionada.plAnulado === " "));
    let perMayorizar = this.preLiquidacionPescaService.verificarPermiso(LS.ACCION_MAYORIZAR, this.empresaSeleccionada) && this.preLiquidacionSeleccionada.plPendiente === LS.ETIQUETA_PENDIENTE;
    let perAnular = this.preLiquidacionPescaService.verificarPermiso(LS.ACCION_ANULAR, this.empresaSeleccionada) && this.preLiquidacionSeleccionada.plPendiente !== LS.ETIQUETA_PENDIENTE && this.preLiquidacionSeleccionada.plAnulado !== LS.ETIQUETA_ANULADO;
    let perRestaurar = this.preLiquidacionPescaService.verificarPermiso(LS.ACCION_RESTAURAR, this.empresaSeleccionada) && this.preLiquidacionSeleccionada.plAnulado === LS.ETIQUETA_ANULADO;

    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.operacionesPreLiquidacion(LS.ACCION_CONSULTAR, perConsultar) : null
      },
      {
        label: LS.ACCION_DESMAYORIZAR,
        icon: LS.ICON_DESMAYORIZAR,
        disabled: !perDesmayorizar,
        command: () => perDesmayorizar ? this.desmayorizarPreLiquidacion() : null
      },
      {
        label: LS.ACCION_MAYORIZAR,
        icon: LS.ICON_MAYORIZAR,
        disabled: !perMayorizar,
        command: () => perMayorizar ? this.operacionesPreLiquidacion(LS.ACCION_MAYORIZAR, perMayorizar) : null
      },
      {
        label: LS.ACCION_ANULAR,
        icon: LS.ICON_ANULAR,
        disabled: !perAnular,
        command: () => perAnular ? this.operacionesPreLiquidacion(LS.ACCION_ANULAR, perAnular) : null
      },
      {
        label: LS.ACCION_RESTAURAR,
        icon: LS.ICON_RESTAURAR,
        disabled: !perRestaurar,
        command: () => perRestaurar ? this.operacionesPreLiquidacion(LS.ACCION_RESTAURAR, perRestaurar) : null
      }
    ];
  }

  //Listar sectores
  listarSectores() {
    this.limpiarResultado();
    this.listaSectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.piscinaSeleccionada = null;
    this.listarPiscinas();
    this.cargando = false;
  }

  //Listar piscinas
  listarPiscinas() {
    this.limpiarResultado();
    this.cargando = true;
    this.listaPiscinas = [];
    let parametros = {
      empresa: LS.KEY_EMPRESA_SELECT,
      sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
      mostrarInactivo: false
    }
    this.piscinaService.listarPrdListaPiscinaTO(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPiscina(data) {
    this.listaPiscinas = data;
    if (this.listaPiscinas.length > 0) {
      this.piscinaSeleccionada = this.piscinaSeleccionada && this.piscinaSeleccionada.pisNumero ? this.listaPiscinas.find(item => item.pisNumero === this.piscinaSeleccionada.pisNumero) : this.listaPiscinas[0];
    } else {
      this.piscinaSeleccionada = null;
    }
    this.cargando = false;
  }

  //Listar Motivos
  listarLiquidacionMotivoTO() {
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: false };
    this.preLiquidacionService.listarPreLiquidacionMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPreLiquidacionMotivo(lista) {
    this.listaMotivos = lista;
  }

  obtenerFechaActual() {
    this.sistemaService.getFechaActual(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaActual = data;
      }).catch(err => this.utilService.handleError(err, this));
  }

  //Operaciones
  buscarPreLiquidaciones(form: NgForm, limite) {
    this.cargando = true;
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    this.filasTiempo.iniciarContador();
    if (formularioTocado && form && form.valid) {
      this.buscar(limite);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  buscar(limite) {
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
      piscina: this.piscinaSeleccionada ? this.piscinaSeleccionada.pisNumero : null,
      busqueda: '',
      nRegistros: limite
    };
    this.preLiquidacionPescaService.listarPreLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarPreLiquidacion(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  operacionesPreLiquidacion(accion, permiso) {
    if (permiso) {
      switch (accion) {
        case LS.ACCION_CONSULTAR: {
          this.consultarPreLiquidacion(accion, LS.TITULO_FORM_CONSULTA_PRE_LIQUIDACION_PESCA);
          break;
        }
        case LS.ACCION_MAYORIZAR: {
          this.consultarPreLiquidacion(accion, LS.TITULO_FORM_MAYORIZAR_PRE_LIQUIDACION_PESCA);
          break;
        }
        case LS.ACCION_ANULAR: {
          this.consultarPreLiquidacion(accion, LS.TITULO_FORM_ANULAR_PRE_LIQUIDACION_PESCA);
          break;
        }
        case LS.ACCION_RESTAURAR: {
          this.consultarPreLiquidacion(accion, LS.TITULO_FORM_RESTAURAR_PRE_LIQUIDACION_PESCA);
          break;
        }
      }
    }
  }

  nuevaPreLiquidacion(form: NgForm) {
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      this.parametrosFormulario = {
        pk: null,
        accion: LS.ACCION_CREAR,
        listaMotivos: this.listaMotivos,
        fechaActual: this.fechaActual,
        listaSectores: this.listaSectores,
        listaPiscinas: this.listaPiscinas,
        titulo: LS.TITULO_FORM_NUEVO_PRE_LIQUIDACION_PESCA,
        piscinaSeleccionada: this.piscinaSeleccionada,
        sectorSeleccionado: this.sectorSeleccionado
      }
      this.cargando = false;
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  consultarPreLiquidacion(accion, titulo) {
    this.cargando = true;
    let pk = new PrdPreLiquidacionPK();
    pk.plEmpresa = this.empresaSeleccionada.empCodigo;
    pk.plMotivo = this.preLiquidacionSeleccionada.plMotivo;
    pk.plNumero = this.preLiquidacionSeleccionada.plNumero;
    this.parametrosFormulario = {
      pk: pk,
      accion: accion,
      listaMotivos: this.listaMotivos,
      fechaActual: this.fechaActual,
      listaSectores: [],
      listaPiscinas: [],
      titulo: titulo,
      piscinaSeleccionada: this.piscinaSeleccionada,
      sectorSeleccionado: this.sectorSeleccionado,
      seleccionado: this.preLiquidacionSeleccionada
    }
    this.cargando = false;
  }

  //Desmayorizar liquidacion pesca
  desmayorizarPreLiquidacion() {
    if (this.preLiquidacionPescaService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let pk = new PrdPreLiquidacionPK();
      pk.plEmpresa = this.empresaSeleccionada.empCodigo;
      pk.plMotivo = this.preLiquidacionSeleccionada.plMotivo;
      pk.plNumero = this.preLiquidacionSeleccionada.plNumero;
      this.preLiquidacionPescaService.desmayorizarPreLiquidacion({ pk: pk }, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeDesmayorizarPreLiquidacion(data) {
    this.cargando = false;
    if (data) {
      this.preLiquidacionSeleccionada.plPendiente = "PENDIENTE";
      let index = this.listaResultado.findIndex(item => item.id == this.preLiquidacionSeleccionada.id);
      if (this.preLiquidacionPescaService.verificarPermiso(LS.ACCION_MAYORIZAR, this.empresaSeleccionada, true)) {
        swal(this.utilService.generarSwalConfirmationOption(LS.MSJ_TITULO_MAYORIZAR, LS.MSJ_PREGUNTA_MAYORIZAR, LS.SWAL_QUESTION))
          .then((result) => {
            if (result.value) {
              this.refrescarTabla(index, this.preLiquidacionSeleccionada);
              this.operacionesPreLiquidacion(LS.ACCION_MAYORIZAR, true)
            } else {
              this.refrescarTabla(index, this.preLiquidacionSeleccionada);
            }
          });
      } else {
        this.refrescarTabla(index, this.preLiquidacionSeleccionada);
      }
    }
  }

  //Demayorizar por lote 
  desmayorizarPreLiquidacionLote() {
    if (this.preLiquidacionPescaService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada, true)) {
      let listaSeleccionados = this.utilService.getAGSelectedData(this.gridApi);
      this.cargando = true;
      if (listaSeleccionados.length === 1) {
        let seleccionado = listaSeleccionados[0];
        if (seleccionado.planulado === "ANULADO" || seleccionado.plPendiente === "PENDIENTE") {
          this.toastr.warning(LS.MSJ_HAY_LIQUIDACION_PESCA_PENDIENTES_SELECCIONADOS, LS.TAG_AVISO)
          this.cargando = false;
        } else {
          this.cargando = true;
          this.preLiquidacionSeleccionada = seleccionado;
          let pk = new PrdPreLiquidacionPK();
          pk.plEmpresa = this.empresaSeleccionada.empCodigo;
          pk.plMotivo = seleccionado.plMotivo;
          pk.plNumero = seleccionado.plNumero;
          this.preLiquidacionPescaService.desmayorizarPreLiquidacion({ pk: pk }, this, LS.KEY_EMPRESA_SELECT);
        }
      } else {
        if (listaSeleccionados.length > 1) {
          let parametro = { ListaPreLiquidacionTO: listaSeleccionados, empresa: this.empresaSeleccionada.empCodigo };
          this.preLiquidacionPescaService.desmayorizarLotePreLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.cargando = false;
          this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TAG_AVISO)
        }
      }
    }
  }

  despuesDeDesmayorizarLotePreLiquidacion(data) {
    this.cargando = false;
    if (data) {
      this.utilService.generarSwalHTML(LS.TAG_PRE_LIQUIDACION_PESCA, LS.SWAL_INFO, data.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
      this.buscar('20');
    }
  }

  //Imprimir liquidacion pesca
  imprimirPreLiquidacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListaPreLiquidacionTO: this.listaResultado, empresa: this.empresaSeleccionada.empCodigo };
      this.archivoService.postPDF("todocompuWS/produccionWebController/generarReportePreLiquidacionPescaListado", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoPreLiquidacionPescaListado.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //Imprimir liquidacion pesca por lote
  imprimirPreLiquidacionLote() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaSeleccionados = this.utilService.getAGSelectedData(this.gridApi);
      let algunaFilaPendienteOAnulada = this.preLiquidacionPescaService.algunaFilaPendienteOAnulada(listaSeleccionados.slice());
      if (algunaFilaPendienteOAnulada) {
        this.cargando = false;
        this.toastr.warning(LS.MSJ_HAY_LIQUIDACION_PESCA_PENDIENTES_SELECCIONADOS, LS.TAG_AVISO);
      } else {
        if (listaSeleccionados.length > 0) {
          let parametros = { ListaPreLiquidacionTO: listaSeleccionados, empresa: this.empresaSeleccionada.empCodigo };
          this.archivoService.postPDF("todocompuWS/produccionWebController/generarReportePreLiquidacionPescaPorLote", parametros, this.empresaSeleccionada)
            .then(data => {
              (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoPreLiquidacionPesca.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.cargando = false;
          this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TAG_AVISO);
        }
      }
    }
  }

  //Exportar liquidacion pesca
  exportarPreLiquidacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListaPreLiquidacionTO: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReportePescaPreLiquidacion", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoPreLiquidacionPesca_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //Formulario
  cerrarFormulario(event) {
    if (event) {
      switch (event.accion) {
        case LS.ACCION_CANCELAR: {
          this.cerrar();
          break;
        }
        case LS.ACCION_CREADO: {
          this.actualizarItem(event.preLiquidacion);
          break;
        }
      }
    }
  }

  actualizarItem(preLiquidacion: PrdPreLiquidacion) {
    let nuevaPreLiquidacionSelec: ListaPreLiquidacionTO = new ListaPreLiquidacionTO();
    nuevaPreLiquidacionSelec.id = this.preLiquidacionSeleccionada.id;
    nuevaPreLiquidacionSelec.plAnulado = preLiquidacion.plAnulado ? "ANULADO" : null;
    nuevaPreLiquidacionSelec.plPendiente = preLiquidacion.plPendiente ? "PENDIENTE" : null;
    nuevaPreLiquidacionSelec.plMotivo = preLiquidacion.prdPreLiquidacionPK.plMotivo;
    nuevaPreLiquidacionSelec.plNumero = preLiquidacion.prdPreLiquidacionPK.plNumero;
    nuevaPreLiquidacionSelec.plLote = preLiquidacion.plLote;
    nuevaPreLiquidacionSelec.plFecha = this.utilService.convertirFechaStringYYYYMMDD(preLiquidacion.plFecha);
    nuevaPreLiquidacionSelec.cliCodigo = preLiquidacion.invCliente.invClientePK.cliCodigo;
    nuevaPreLiquidacionSelec.cliNombre = preLiquidacion.invCliente.cliRazonSocial;
    nuevaPreLiquidacionSelec.plTotalMonto = preLiquidacion.plTotalMonto;

    let index = this.listaResultado.findIndex(item => item.id == this.preLiquidacionSeleccionada.id);
    if (index >= 0) {
      this.listaResultado[index] = nuevaPreLiquidacionSelec;
      this.refrescarTabla(index, nuevaPreLiquidacionSelec);
    }
    this.cerrar();
  }

  refrescarTabla(index, preLiquidacion: ListaPreLiquidacionTO) {
    if (this.gridApi) {
      var rowNode = this.gridApi.getRowNode("" + index);
      rowNode.setData(preLiquidacion);
    }
  }

  cerrar() {
    this.listaResultado.length === 0 ? this.activar = false : null;
    this.parametrosFormulario = null;
    this.mostrarFormulario = false;
    this.actualizarFilas();
    this.cargando = false;
    this.generarAtajosTeclado();
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.preLiquidacionPescaService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
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
    this.redimensionarColumnas();
    this.seleccionarFila(0);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.preLiquidacionSeleccionada = fila ? fila.data : null;
  }

  redimensionarColumnas() {
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
    this.preLiquidacionSeleccionada = data;
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

}
