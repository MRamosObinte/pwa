import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { RhListaDetalleRolesTO } from './../../../../entidadesTO/rrhh/RhListaDetalleRolesTO';
import { Component, OnInit, HostListener, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GridApi } from 'ag-grid';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { RhComboCategoriaTO } from '../../../../entidadesTO/rrhh/RhComboCategoriaTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaService } from '../../archivo/categoria/categoria.service';
import * as moment from 'moment';
import { EmpleadosListadoComponent } from '../../componentes/empleados-listado/empleados-listado.component';
import { NgForm } from '@angular/forms';
import { RolPagosService } from './rol-pagos.service';
import { BotonAccionComponent } from '../../../componentes/boton-accion/boton-accion.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { ComprobanteRolComponent } from '../../componentes/comprobante-rol/comprobante-rol.component';
import { ConContablePK } from '../../../../entidades/contabilidad/ConContablePK';

@Component({
  selector: 'app-rol-pagos',
  templateUrl: './rol-pagos.component.html',
  styleUrls: ['./rol-pagos.component.css']
})
export class RolPagosComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaCategorias: Array<RhComboCategoriaTO> = [];
  public listaResultadoRolPago: Array<RhListaDetalleRolesTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public rolPagoSeleccionado: RhListaDetalleRolesTO = new RhListaDetalleRolesTO();
  public categoriaSeleccionada: RhComboCategoriaTO = new RhComboCategoriaTO();
  public es: object = {};
  public fechaInicio: Date;
  public fechaFin: Date;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public opciones: MenuItem[];
  //EMPLEADO
  public codigoEmpleado: string = null;
  public empleado: RhEmpleado = new RhEmpleado();
  //DESDE FUERA
  @Input() objetoRolPagoDesdeFuera;
  @Output() cerrarRolPago = new EventEmitter();
  //CONTABLE
  public objetoContableEnviar = null;
  public mostrarContabilidaAcciones: boolean = false;
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
  public visualizarSoloFechas: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private sectorService: SectorService,
    private sistemaService: AppSistemaService,
    private modalService: NgbModal,
    private categoriaService: CategoriaService,
    private rolPagosService: RolPagosService
  ) {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    if (this.objetoRolPagoDesdeFuera) {
      this.setearValoresRolPagoDesdeFuera();
    } else {
      this.listaEmpresas = this.route.snapshot.data["rolListado"];
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
      this.obtenerFechaInicioFinMes();
    }
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarRolPagos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarRolPagos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirRolPagos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarRolPagos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      if (this.objetoRolPagoDesdeFuera) {
        this.regresar();
      }
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.categoriaSeleccionada = null;
    this.codigoEmpleado = null;
    this.validarEmpleado();
    this.limpiarResultado();
    this.listarSectores();
    this.listarCategoria();
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaInicio = data[0];//Fecha inicio en la posicion 0
        this.fechaFin = data[1];//Fecha fin esta en la posicion 1
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.listaResultadoRolPago = [];
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

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
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  listarCategoria() {
    this.listaCategorias = [];
    this.limpiarResultado();
    this.cargando = true;
    this.categoriaService.listarComboRhCategoriaTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarComboRhCategoriaTO(data) {
    this.listaCategorias = data;
    if (this.listaCategorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.catNombre ? this.listaCategorias.find(item => item.catNombre === this.categoriaSeleccionada.catNombre) : null;
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  setearValoresRolPagoDesdeFuera() {
    this.visualizarSoloFechas = this.objetoRolPagoDesdeFuera.visualizarSoloFechas ? true : false;
    /**Empresa */
    this.listaEmpresas.push(this.objetoRolPagoDesdeFuera.empresaSeleccionada);
    this.empresaSeleccionada = this.objetoRolPagoDesdeFuera.empresaSeleccionada;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    /**Categoria */
    if (this.objetoRolPagoDesdeFuera.categoriaSeleccionada) {
      this.listaCategorias.push(this.objetoRolPagoDesdeFuera.categoriaSeleccionada);
      this.categoriaSeleccionada = this.objetoRolPagoDesdeFuera.categoriaSeleccionada;
    }
    /**Sector */
    if (this.objetoRolPagoDesdeFuera.sectorSeleccionado) {
      this.listaSectores.push(this.objetoRolPagoDesdeFuera.sectorSeleccionado);
      this.sectorSeleccionado = this.objetoRolPagoDesdeFuera.sectorSeleccionado;
    }
    /**Fechas */
    this.fechaInicio = this.objetoRolPagoDesdeFuera.fechaDesde;
    this.fechaFin = this.objetoRolPagoDesdeFuera.fechaHasta;
    /**empleado */
    this.empleado = this.objetoRolPagoDesdeFuera.empleado;
    this.codigoEmpleado = typeof this.objetoRolPagoDesdeFuera.empleado === 'object' ?
      this.objetoRolPagoDesdeFuera.empleado.rhEmpleadoPK.empId : this.objetoRolPagoDesdeFuera.empleado;
    this.buscar();
  }

  regresar() {
    this.cerrarRolPago.emit();
  }

  generarOpciones() {
    let permiso = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this);
    this.opciones = [
      { label: LS.TAG_CONTABLE, icon: LS.ICON_BUSCAR, disabled: !permiso, command: () => permiso ? this.consultarContable() : null },
      { label: LS.TAG_COMPROBANTE_ROL, icon: LS.ICON_BUSCAR, disabled: !permiso, command: () => permiso ? this.consultarComprobante() : null },
      { label: LS.LABEL_IMPRIMIR_CONTABLE, icon: LS.ICON_IMPRIMIR, disabled: !permiso, command: () => permiso ? this.imprimirContable() : null },
      { label: LS.LABEL_IMPRIMIR_COMPROBANTE, icon: LS.ICON_IMPRIMIR, disabled: !permiso, command: () => permiso ? this.imprimirComprobante() : null }
    ];
  }

  //OPERACIONES
  buscarRolPagos(filtro, form: NgForm) {
    this.limpiarResultado();
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      this.buscar(filtro);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  buscar(filtro?) {
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    let parametros = {
      empresa: this.empresaSeleccionada.empCodigo,
      empId: this.codigoEmpleado,
      sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
      empCategoria: this.categoriaSeleccionada ? this.categoriaSeleccionada.catNombre : null,
      fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
      fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
      filtro: filtro ? filtro : null
    }
    this.rolPagosService.listaRhDetalleRolesTO(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarRhDetalleRolesTO(data) {
    this.listaResultadoRolPago = data;
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.iniciarAgGrid();
  }

  imprimirRolPagos() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        nombreEmpleado: this.codigoEmpleado,
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        empCategoria: this.categoriaSeleccionada.catNombre,
        listaDetalleRolesTO: this.listaResultadoRolPago
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteListadoRolesPago", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoRolPagos.pdf', data) : this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarRolPagos() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        nombreEmpleado: this.codigoEmpleado,
        fechaDesde: this.utilService.convertirFechaStringYYYYMMDD(this.fechaInicio),
        fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
        empCategoria: this.categoriaSeleccionada.catNombre,
        listaDetalleRolesTO: this.listaResultadoRolPago
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteListadoRolesPago", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoRolPagos_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }
  //CONTABLE
  consultarContable() {
    if (this.rolPagoSeleccionado && this.rolPagoSeleccionado.lrpContable) {
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.rolPagoSeleccionado.lrpContable,
        listadoSectores: [],
        tamanioEstructura: null,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: this.activar,
        tipoContable: this.rolPagoSeleccionado.lrpContable.split('|')[1],
        listaPeriodos: [],
        volverACargar: false
      };
      this.mostrarContabilidaAcciones = true;
    }
  }

  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
  }

  cerrarContabilidadAcciones(event) {
    if (!event.noIniciarAtajoPadre) {
      this.activar = false;
      this.objetoContableEnviar = event.objetoEnviar;
      this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
      this.actualizarFilas();
      this.generarAtajosTeclado();
    }
  }

  imprimirContableLote() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaSeleccionados = this.utilService.getAGSelectedData(this.gridApi);
      let listaPk = [];
      if (listaSeleccionados.length === 0) {
        this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_UNA_FILA, LS.TAG_AVISO);
        this.cargando = false;
      } else {
        listaSeleccionados.forEach(value => {
          if (value.lrpContable) {
            let pk = new ConContablePK();
            pk.conEmpresa = this.empresaSeleccionada.empCodigo;
            pk.conNumero = value.lrpContable.split("|")[2].trim();
            pk.conPeriodo = value.lrpContable.split("|")[0].trim();
            pk.conTipo = value.lrpContable.split("|")[1].trim();
            listaPk.push(pk);
          }
        });
        let parametros = { listadoPK: listaPk };
        this.generarReporteContable(parametros);
      }
    }
  }

  imprimirContable() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      if (this.rolPagoSeleccionado.lrpContable) {
        this.cargando = true;
        let listaPk = [];
        let pk = new ConContablePK();
        pk.conEmpresa = this.empresaSeleccionada.empCodigo;
        pk.conNumero = this.rolPagoSeleccionado.lrpContable.split("|")[2].trim();
        pk.conPeriodo = this.rolPagoSeleccionado.lrpContable.split("|")[0].trim();
        pk.conTipo = this.rolPagoSeleccionado.lrpContable.split("|")[1].trim();
        listaPk.push(pk);
        let parametros = { listadoPK: listaPk };
        this.generarReporteContable(parametros);
      }
    }
  }

  generarReporteContable(parametros) {
    this.archivoService.postPDF("todocompuWS/contabilidadWebController/generarReporteContableIndividual", parametros, this.empresaSeleccionada)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('Contable.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  //COMPROBANTE
  consultarComprobante() {
    if (this.rolPagoSeleccionado && this.rolPagoSeleccionado.lrpContable) {
      let contable = new ConContablePK();
      contable.conEmpresa = this.empresaSeleccionada.empCodigo;
      contable.conNumero = this.rolPagoSeleccionado.lrpContable.split('|')[2].trim();
      contable.conPeriodo = this.rolPagoSeleccionado.lrpContable.split('|')[0].trim();
      contable.conTipo = this.rolPagoSeleccionado.lrpContable.split('|')[1].trim();

      let parametros = {
        empresa: this.empresaSeleccionada.empCodigo,
        idEmpleado: this.rolPagoSeleccionado.lrpId,
        conContablePK: contable
      };
      const modalRef = this.modalService.open(ComprobanteRolComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.parametros = parametros;
      modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
      modalRef.componentInstance.accion = LS.ACCION_CONSULTAR;
      modalRef.componentInstance.rutaImprimir = 'todocompuWS/rrhhWebController/imprimirComprobanteRolListado';
      modalRef.result.then(() => {
        this.generarAtajosTeclado();
      }, () => {
        this.generarAtajosTeclado();
      });
    }
  }

  imprimirComprobanteLote() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let listaSeleccionados = this.utilService.getAGSelectedData(this.gridApi);
      let listaPk = [];
      if (listaSeleccionados.length === 0) {
        this.toastr.warning(LS.MSJ_DEBE_SELECCIONAR_UNA_FILA, LS.TAG_AVISO);
        this.cargando = false;
      } else {
        listaSeleccionados.forEach(value => {
          if (value.lrpContable) {
            let pk = new ConContablePK();
            pk.conEmpresa = this.empresaSeleccionada.empCodigo;
            pk.conNumero = value.lrpContable.split("|")[2].trim();
            pk.conPeriodo = value.lrpContable.split("|")[0].trim();
            pk.conTipo = value.lrpContable.split("|")[1].trim();
            listaPk.push(pk);
          }
        });
        let parametros = { listaContablePK: listaPk };
        this.generarComprobante(parametros);
      }
    }
  }

  imprimirComprobante() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      if (this.rolPagoSeleccionado.lrpContable) {
        this.cargando = true;
        let listaPk = [];
        let pk = new ConContablePK();
        pk.conEmpresa = this.empresaSeleccionada.empCodigo;
        pk.conNumero = this.rolPagoSeleccionado.lrpContable.split("|")[2].trim();
        pk.conPeriodo = this.rolPagoSeleccionado.lrpContable.split("|")[0].trim();
        pk.conTipo = this.rolPagoSeleccionado.lrpContable.split("|")[1].trim();
        listaPk.push(pk);
        let parametros = { listaContablePK: listaPk };
        this.generarComprobante(parametros);
      }
    }
  }


  generarComprobante(parametros) {
    this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteComprobanteRolLote", parametros, this.empresaSeleccionada)
      .then(data => {
        if (data._body.byteLength > 0) {
          this.utilService.descargarArchivoPDF('comprobanteRol_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
        } else {
          this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  //EMPLEADO
  buscarEmpleado(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      let fueBuscado = (this.empleado.rhEmpleadoPK.empId === this.codigoEmpleado && this.empleado.rhEmpleadoPK.empId && this.codigoEmpleado);
      if (!fueBuscado) {
        this.empleado.rhEmpleadoPK.empId = this.empleado.rhEmpleadoPK.empId === '' ? null : this.empleado.rhEmpleadoPK.empId;
        this.empleado.rhEmpleadoPK.empId = this.empleado.rhEmpleadoPK.empId ? this.empleado.rhEmpleadoPK.empId.toUpperCase() : null;
        if (this.empleado.rhEmpleadoPK.empId) {
          let parametroBusqueda = {
            empresa: this.empresaSeleccionada.empCodigo,
            buscar: this.empleado.rhEmpleadoPK.empId,
            estado: true
          };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(EmpleadosListadoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
          modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
          modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
          modalRef.componentInstance.isModal = true;
          modalRef.result.then((result) => {
            this.codigoEmpleado = result ? result.rhEmpleadoPK.empId : null;
            this.empleado.rhEmpleadoPK.empId = result ? result.rhEmpleadoPK.empId : null;
            this.empleado.empNombres = result ? result.empApellidos + " " + result.empNombres : null;
            document.getElementById('empleado').focus();
            this.filasService.actualizarFilas("0", "0");
          }, () => {
            let element: HTMLElement = document.getElementById('empleado') as HTMLElement;
            element ? element.focus() : null;
            this.filasService.actualizarFilas("0", "0");
          });
        }
      }
    }
  }

  validarEmpleado() {
    if (this.codigoEmpleado !== this.empleado.rhEmpleadoPK.empId) {
      this.codigoEmpleado = null;
      this.empleado.empNombres = null;
      this.empleado.rhEmpleadoPK.empId = null;
      this.limpiarResultado();
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.rolPagosService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "multiple";
    this.frameworkComponents = {
      botonOpciones: BotonAccionComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.rolPagoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
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

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.rolPagoSeleccionado = fila ? fila.data : null;
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
  }

}
