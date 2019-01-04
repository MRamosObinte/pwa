import { Component, OnInit, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PrdPiscinaTO } from '../../../../entidadesTO/Produccion/PrdPiscinaTO';
import { ListaLiquidacionTO } from '../../../../entidadesTO/Produccion/ListaLiquidacionTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GridApi } from 'ag-grid';
import { SectorService } from '../../archivos/sector/sector.service';
import { PiscinaService } from '../../archivos/piscina/piscina.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { LiquidacionPescaService } from './liquidacion-pesca.service';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { PrdLiquidacionPK } from '../../../../entidades/produccion/PrdLiquidacionPK';
import { PrdLiquidacionMotivoTO } from '../../../../entidadesTO/Produccion/PrdLiquidacionMotivoTO';
import { LiquidacionMotivoService } from '../../archivos/liquidacion-motivo/liquidacion-motivo.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { PrdLiquidacion } from '../../../../entidades/produccion/PrdLiquidacion';
import swal from 'sweetalert2';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Component({
  selector: 'app-liquidacion-pesca',
  templateUrl: './liquidacion-pesca.component.html',
  styleUrls: ['./liquidacion-pesca.component.css']
})
export class LiquidacionPescaComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaPiscinas: Array<PrdPiscinaTO> = [];
  public listaMotivos: Array<PrdLiquidacionMotivoTO> = [];
  public listaResultado: Array<ListaLiquidacionTO> = [];

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public piscinaSeleccionada: PrdPiscinaTO = new PrdPiscinaTO();
  public liquidacionSeleccionada: ListaLiquidacionTO = new ListaLiquidacionTO();

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
    private liquidacionMotivoService: LiquidacionMotivoService,
    private liquidacionPescaService: LiquidacionPescaService,
    private archivoService: ArchivoService,
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data["liquidacionPescaListado"];
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
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarLiquidacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirLiquidacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarLiquidacion') as HTMLElement;
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
    let listaSeleccionado = [];
    listaSeleccionado.push(this.liquidacionSeleccionada);
    let perConsultar = true;
    let perDesmayorizar = this.liquidacionPescaService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada) && ((!this.liquidacionSeleccionada.liqPendiente || this.liquidacionSeleccionada.liqPendiente === " ")
      && (!this.liquidacionSeleccionada.liqAnulado || this.liquidacionSeleccionada.liqAnulado === " "));
    let perMayorizar = this.liquidacionPescaService.verificarPermiso(LS.ACCION_MAYORIZAR, this.empresaSeleccionada) && this.liquidacionSeleccionada.liqPendiente === LS.ETIQUETA_PENDIENTE;
    let perAnular = this.liquidacionPescaService.verificarPermiso(LS.ACCION_ANULAR, this.empresaSeleccionada) && this.liquidacionSeleccionada.liqPendiente !== LS.ETIQUETA_PENDIENTE && this.liquidacionSeleccionada.liqAnulado !== LS.ETIQUETA_ANULADO;
    let perRestaurar = this.liquidacionPescaService.verificarPermiso(LS.ACCION_RESTAURAR, this.empresaSeleccionada) && this.liquidacionSeleccionada.liqAnulado === LS.ETIQUETA_ANULADO;
    let perImprimir = this.liquidacionPescaService.verificarPermiso(LS.ACCION_IMPRIMIR, this.empresaSeleccionada) && this.liquidacionSeleccionada.liqPendiente !== LS.ETIQUETA_PENDIENTE && this.liquidacionSeleccionada.liqAnulado !== LS.ETIQUETA_ANULADO;

    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.operacionesLiquidacion(LS.ACCION_CONSULTAR, perConsultar) : null
      },
      {
        label: LS.ACCION_DESMAYORIZAR,
        icon: LS.ICON_DESMAYORIZAR,
        disabled: !perDesmayorizar,
        command: () => perDesmayorizar ? this.desmayorizarLiquidacion() : null
      },
      {
        label: LS.ACCION_MAYORIZAR,
        icon: LS.ICON_MAYORIZAR,
        disabled: !perMayorizar,
        command: () => perMayorizar ? this.operacionesLiquidacion(LS.ACCION_MAYORIZAR, perMayorizar) : null
      },
      {
        label: LS.ACCION_ANULAR,
        icon: LS.ICON_ANULAR,
        disabled: !perAnular,
        command: () => perAnular ? this.operacionesLiquidacion(LS.ACCION_ANULAR, perAnular) : null
      },
      {
        label: LS.ACCION_RESTAURAR,
        icon: LS.ICON_RESTAURAR,
        disabled: !perRestaurar,
        command: () => perRestaurar ? this.operacionesLiquidacion(LS.ACCION_RESTAURAR, perRestaurar) : null
      },
      {
        label: LS.ACCION_IMPRIMIR,
        icon: LS.ICON_IMPRIMIR,
        disabled: !perImprimir,
        command: () => perImprimir ? this.imprimirLiquidacionPescaIndividual(listaSeleccionado) : null
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
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, activo: true };
    this.liquidacionMotivoService.listarLiquidacionMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarLiquidacionMotivo(lista) {
    this.listaMotivos = lista;
  }

  obtenerFechaActual() {
    this.sistemaService.getFechaActual(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaActual = data;
      }).catch(err => this.utilService.handleError(err, this));
  }

  //Operaciones
  buscarLiquidaciones(form: NgForm, limite) {
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
    this.liquidacionPescaService.listarLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT)
  }

  despuesDeListarLiquidacion(data) {
    this.listaResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.iniciarAgGrid();
  }

  operacionesLiquidacion(accion, permiso) {
    if (permiso) {
      switch (accion) {
        case LS.ACCION_CONSULTAR: {
          this.consultarLiquidacion(accion, LS.TITULO_FORM_CONSULTA_LIQUIDACION_PESCA);
          break;
        }
        case LS.ACCION_MAYORIZAR: {
          this.consultarLiquidacion(accion, LS.TITULO_FORM_MAYORIZAR_LIQUIDACION_PESCA);
          break;
        }
        case LS.ACCION_ANULAR: {
          this.consultarLiquidacion(accion, LS.TITULO_FORM_ANULAR_LIQUIDACION_PESCA);
          break;
        }
        case LS.ACCION_RESTAURAR: {
          this.consultarLiquidacion(accion, LS.TITULO_FORM_RESTAURAR_LIQUIDACION_PESCA);
          break;
        }
      }
    }
  }

  nuevaLiquidacion(form: NgForm) {
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
        titulo: LS.TITULO_FORM_NUEVO_LIQUIDACION_PESCA,
        piscinaSeleccionada: this.piscinaSeleccionada,
        sectorSeleccionado: this.sectorSeleccionado
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  consultarLiquidacion(accion, titulo) {
    this.cargando = true;
    let pk = new PrdLiquidacionPK();
    pk.liqEmpresa = this.empresaSeleccionada.empCodigo;
    pk.liqMotivo = this.liquidacionSeleccionada.liqMotivo;
    pk.liqNumero = this.liquidacionSeleccionada.liqNumero;
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
      seleccionado: this.liquidacionSeleccionada
    }
  }

  //Desmayorizar liquidacion pesca
  desmayorizarLiquidacion() {
    if (this.liquidacionPescaService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let pk = new PrdLiquidacionPK();
      pk.liqEmpresa = this.empresaSeleccionada.empCodigo;
      pk.liqMotivo = this.liquidacionSeleccionada.liqMotivo;
      pk.liqNumero = this.liquidacionSeleccionada.liqNumero;
      this.liquidacionPescaService.desmayorizarLiquidacion({ liquidacionPK: pk }, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeDesmayorizarLiquidacion(data) {
    this.cargando = false;
    if (data) {
      this.liquidacionSeleccionada.liqPendiente = "PENDIENTE";
      let index = this.listaResultado.findIndex(item => item.id == this.liquidacionSeleccionada.id);
      if (this.liquidacionPescaService.verificarPermiso(LS.ACCION_MAYORIZAR, this.empresaSeleccionada, true)) {
        swal(this.utilService.generarSwalConfirmationOption(LS.MSJ_TITULO_MAYORIZAR, LS.MSJ_PREGUNTA_MAYORIZAR, LS.SWAL_QUESTION))
          .then((result) => {
            if (result.value) {
              this.refrescarTabla(index, this.liquidacionSeleccionada);
              this.operacionesLiquidacion(LS.ACCION_MAYORIZAR, true)
            } else {
              this.refrescarTabla(index, this.liquidacionSeleccionada);
            }
          });
      } else {
        this.refrescarTabla(index, this.liquidacionSeleccionada);
      }
    }
  }

  //Demayorizar por lote 
  desmayorizarLiquidacionLote() {
    if (this.liquidacionPescaService.verificarPermiso(LS.ACCION_DESMAYORIZAR, this.empresaSeleccionada, true)) {
      let listaSeleccionados = this.utilService.getAGSelectedData(this.gridApi);
      this.cargando = true;
      if (listaSeleccionados.length === 1) {
        let seleccionado = listaSeleccionados[0];
        if (seleccionado.liqAnulado === "ANULADO" || seleccionado.liqPendiente === "PENDIENTE") {
          this.toastr.warning(LS.MSJ_HAY_LIQUIDACION_PESCA_PENDIENTES_SELECCIONADOS, LS.TAG_AVISO)
          this.cargando = false;
        } else {
          this.cargando = true;
          this.liquidacionSeleccionada = seleccionado;
          let pk = new PrdLiquidacionPK();
          pk.liqEmpresa = this.empresaSeleccionada.empCodigo;
          pk.liqMotivo = seleccionado.liqMotivo;
          pk.liqNumero = seleccionado.liqNumero;
          this.liquidacionPescaService.desmayorizarLiquidacion({ liquidacionPK: pk }, this, LS.KEY_EMPRESA_SELECT);
        }
      } else {
        if (listaSeleccionados.length > 1) {
          let parametro = { ListaLiquidacionTO: listaSeleccionados, empresa: this.empresaSeleccionada.empCodigo };
          this.liquidacionPescaService.desmayorizarLoteLiquidacion(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.cargando = false;
          this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TAG_AVISO)
        }
      }
    }
  }

  despuesDeDesmayorizarLoteLiquidacion(data) {
    this.cargando = false;
    if (data) {
      this.utilService.generarSwalHTML(LS.TAG_LIQUIDACION_PESCA, LS.SWAL_INFO, data.operacionMensaje, LS.ICON_OK_SWAL, LS.SWAL_OK);
      this.buscar('20');
    }
  }

  //Imprimir liquidacion pesca
  imprimirLiquidacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListaLiquidacionTO: this.listaResultado, empresa: this.empresaSeleccionada.empCodigo };
      this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteLiquidacionPescaListado", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoLiquidacionPescaListado.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //Imprimir liquidacion pesca por lote
  imprimirLiquidacionLote() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaSeleccionados = this.utilService.getAGSelectedData(this.gridApi);
      let algunaFilaPendienteOAnulada = this.liquidacionPescaService.algunaFilaPendienteOAnulada(listaSeleccionados.slice());
      if (algunaFilaPendienteOAnulada) {
        this.cargando = false;
        this.toastr.warning(LS.MSJ_HAY_LIQUIDACION_PESCA_PENDIENTES_SELECCIONADOS, LS.TAG_AVISO);
      } else {
        if (listaSeleccionados.length > 0) {
          this.imprimirLiquidacionPescaIndividual(listaSeleccionados);
        } else {
          this.cargando = false;
          this.toastr.warning(LS.MSJ_NO_ITEM_SELECCIONADO, LS.TAG_AVISO);
        }
      }
    }
  }

  imprimirLiquidacionPescaIndividual(listaSeleccionados) {
    this.cargando = true;
    let parametros = { ListaLiquidacionTO: listaSeleccionados, empresa: this.empresaSeleccionada.empCodigo };
    this.archivoService.postPDF("todocompuWS/produccionWebController/generarReporteLiquidacionPescaPorLote", parametros, this.empresaSeleccionada)
      .then(data => {
        (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoLiquidacionPesca.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  //Exportar liquidacion pesca
  exportarLiquidacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListaLiquidacionTO: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/produccionWebController/exportarReportePescaLiquidacion", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoLiquidacionPesca_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
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
          this.actualizarItem(event.liquidacion);
          break;
        }
      }
    }
  }

  actualizarItem(liquidacion: PrdLiquidacion) {
    let nuevaLiquidacionSelec: ListaLiquidacionTO = new ListaLiquidacionTO();
    nuevaLiquidacionSelec.id = this.liquidacionSeleccionada.id;
    nuevaLiquidacionSelec.liqAnulado = liquidacion.liqAnulado ? "ANULADO" : null;
    nuevaLiquidacionSelec.liqPendiente = liquidacion.liqPendiente ? "PENDIENTE" : null;
    nuevaLiquidacionSelec.liqMotivo = liquidacion.prdLiquidacionPK.liqMotivo;
    nuevaLiquidacionSelec.liqNumero = liquidacion.prdLiquidacionPK.liqNumero;
    nuevaLiquidacionSelec.liqLote = liquidacion.liqLote;
    nuevaLiquidacionSelec.liqFecha = this.utilService.convertirFechaStringYYYYMMDD(liquidacion.liqFecha);
    nuevaLiquidacionSelec.cliCodigo = liquidacion.invCliente.invClientePK.cliCodigo;
    nuevaLiquidacionSelec.cliNombre = liquidacion.invCliente.cliRazonSocial;
    nuevaLiquidacionSelec.liqTotalMonto = liquidacion.liqTotalMonto;

    let index = this.listaResultado.findIndex(item => item.id == this.liquidacionSeleccionada.id);
    if (index >= 0) {
      this.listaResultado[index] = nuevaLiquidacionSelec;
      this.refrescarTabla(index, nuevaLiquidacionSelec);
    }
    this.cerrar();
  }

  refrescarTabla(index, liquidacion: ListaLiquidacionTO) {
    if (this.gridApi) {
      var rowNode = this.gridApi.getRowNode("" + index);
      rowNode.setData(liquidacion);
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
    this.columnDefs = this.liquidacionPescaService.generarColumnas();
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
    this.liquidacionSeleccionada = fila ? fila.data : null;
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
    this.liquidacionSeleccionada = data;
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
