import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { BodegaService } from '../../archivo/bodega/bodega.service';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ToastrService } from 'ngx-toastr';
import { ListadoProductosComponent } from '../listado-productos/listado-productos.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { NgForm } from '@angular/forms';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { InvConsumosMotivoTO } from '../../../../entidadesTO/inventario/InvConsumosMotivoTO';
import { MotivoConsumosService } from '../../archivo/motivo-consumos/motivo-consumos.service';
import { KardexService } from './kardex.service';
import { InvTransferenciaMotivoTO } from '../../../../entidadesTO/inventario/InvTransferenciaMotivoTO';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.css']
})
export class KardexComponent implements OnInit {

  public activar: boolean = false; //
  public constantes: any; //Referencia a las constantes
  public cargando: boolean = false; //Es true cuando esta cargando algun dato desde el server.
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO(); //Identifica la empresa seleccionada
  public listaBodegas: Array<InvListaBodegasTO> = new Array();
  public bodegaSeleccionada: InvListaBodegasTO = new InvListaBodegasTO();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public productoSeleccionado: InvListaProductosGeneralTO = new InvListaProductosGeneralTO();
  public productoCodigoCopia: string = null;//Nulo cuando el valor no es valido
  public formatoLista = "";//valorizado o produccion
  public busquedaListado: any = null;//Parametros de busqueda
  public dataListado: any = {};
  public vistaFormulario: false = null;
  vistaListado: boolean = false;
  deshabilitarOpciones: boolean = false;
  mostrandoFormulario: boolean = false;

  mostrarKardexComponente: boolean = false;
  //[ELEMENTOS DE BUSQUEDA]
  es: any = {}; //Locale Date (Obligatoria)
  objetoConsultaEnviar: any = {};
  objetoFormularioEnviar: any = {};
  operacionListado: any = {};
  //ELEMENTOS QUE NECESITA CUANDO SE BUSCA UN KARDEX DESDE OTRO COMPONENTE
  @Input() objetoDesdeFuera;//{empresa:objetoEmpresa,bodega:objetoBodega,productoSeleccionado:objetoProducto,fechaDesde,fechaHasta}
  @Output() cerrarKardex = new EventEmitter();
  mostrarBtnRegresarFomulario: boolean = false;
  //VENTAS
  listadoPeriodos: Array<SisPeriodo> = new Array();
  //CONSUMOS
  public listaConsumoMotivo: Array<InvConsumosMotivoTO> = [];
  //TRANSFENRENCIAS
  public listaMotivosTransferencias: Array<InvTransferenciaMotivoTO> = new Array();

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private toastr: ToastrService,
    private bodegaService: BodegaService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private periodoService: PeriodoService,
    private motivoConsumoService: MotivoConsumosService,
    private sistemaService: AppSistemaService,
    private kardexService: KardexService
  ) {
    moment.locale('es');
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    if (this.objetoDesdeFuera) {
      this.setearValoresDesdeFuera();
    } else {
      this.listaEmpresas = this.route.snapshot.data['kardex'];
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.formatoLista = this.route.snapshot.data['tipoKardex'];
      this.cambiarempresaSeleccionada();
      this.obtenerFechaInicioActualMes();
    }
    this.iniciarAtajos();
    this.focusProducto();
  }

  setearValoresDesdeFuera() {
    this.listaEmpresas.push(this.objetoDesdeFuera.empresa);
    this.empresaSeleccionada = this.listaEmpresas[0];
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.objetoDesdeFuera.bodega ?
      typeof this.objetoDesdeFuera.bodega === 'string' ? this.listarBodegas() : this.listaBodegas.push(this.objetoDesdeFuera.bodega) : null;
    this.bodegaSeleccionada = this.listaBodegas[0];
    this.productoSeleccionado = this.objetoDesdeFuera.productoSeleccionado;
    this.productoCodigoCopia = this.productoSeleccionado.proCodigoPrincipal;
    this.fechaDesde = this.objetoDesdeFuera.fechaDesde;
    this.fechaHasta = this.objetoDesdeFuera.fechaHasta;
    this.mostrarBtnRegresarFomulario = true;
    this.obtenerDatosParaKardex();
  }

  obtenerDatosParaKardex() {
    this.cargando = true;
    this.kardexService.obtenerDatosParaKardex({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaKardex(data) {
    this.cargando = false;
    if (data) {
      this.listaBodegas = data.listadoBodegas;
      this.listadoPeriodos = data.listadoPeriodos;
      this.listaConsumoMotivo = data.listadoMotivos;
      this.busquedaKardex(this.objetoDesdeFuera.incluirTodos);
    }
  }

  cerrarKardexComponente() {
    this.cerrarKardex.emit(false);
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element.click();
      return false;
    }));
  }

  cambiarempresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.cargando = true;
    this.productoSeleccionado = new InvListaProductosGeneralTO();
    this.bodegaSeleccionada = null;
    this.listarBodegas();//Listar bodegas
    this.listarPeriodos();
    this.listarMotivosConsumo();
  }

  listarPeriodos() {
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT }
    this.cargando = true;
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPeriodos(listadoPeriodos) {
    this.listadoPeriodos = listadoPeriodos ? listadoPeriodos : [];
  }

  listarMotivosConsumo() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivos: false };
    this.motivoConsumoService.listarInvConsumosMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarInvConsumosMotivoTO()*/
  despuesDeListarInvConsumosMotivoTO(data) {
    this.listaConsumoMotivo = data;
    this.cargando = false;
  }

  listarBodegas() {
    this.cargando = true;
    this.listaBodegas = [];
    this.limpiarResultado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: false };
    this.bodegaService.listarInvListaBodegasTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvListaBodegasTO(data) {
    this.listaBodegas = data;
    if (this.objetoDesdeFuera && this.objetoDesdeFuera.bodega) {
      this.bodegaSeleccionada = typeof this.objetoDesdeFuera.bodega === 'string' ? new InvListaBodegasTO({ bodCodigo: this.objetoDesdeFuera.bodega }) : this.bodegaSeleccionada;
    }
    if (this.listaBodegas.length > 0) {
      this.bodegaSeleccionada = (this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo) ? this.listaBodegas.find(item => item.bodCodigo === this.bodegaSeleccionada.bodCodigo) : null;
    } else {
      this.bodegaSeleccionada = null;
    }
    this.cargando = false;
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaDesde.setMonth(this.fechaDesde.getMonth() - 1);
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.busquedaListado = null;
    this.vistaListado = false;
    this.filasService.actualizarFilas(0);
  }

  buscarKardex(form: NgForm, incluirTodos) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    this.cargando = true;
    if (form && form.valid && formularioTocado) {
      this.busquedaKardex(incluirTodos);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  busquedaKardex(incluirTodos) {
    this.filasService.actualizarFilas(0);
    this.dataListado = { vista: this.formatoLista, nombreProducto: this.productoSeleccionado.proNombre };
    this.busquedaListado = this.generarObjetoListado(incluirTodos);
    this.vistaListado = true;
    this.cargando = false;
  }

  generarObjetoListado(incluirTodos): any {
    return {
      empresa: LS.KEY_EMPRESA_SELECT,
      bodega: this.bodegaSeleccionada ? this.bodegaSeleccionada.bodCodigo : null,
      producto: this.productoSeleccionado.proCodigoPrincipal,
      desde: this.utilService.formatearDateToStringYYYYMMDD(this.fechaDesde),
      hasta: this.utilService.formatearDateToStringYYYYMMDD(this.fechaHasta),
      promedio: LS.KEY_KARDEX_PROMEDIO,
      mostrarBtnRegresar: this.objetoDesdeFuera ? true : false,
      incluirTodos: incluirTodos,
      vista: 'kardex',
      listaPeriodos: this.listadoPeriodos,
      listaConsumoMotivo: this.listaConsumoMotivo,
      listaMotivosTransferencias: this.listaMotivosTransferencias
    };
  }

  mostrarFormulario(event) {
    this.activar = event;
    this.deshabilitarOpciones = true;
    this.vistaListado = false;
  }

  cancelar() {
    this.cerrarKardexComponente();
    this.activar = false;
    this.deshabilitarOpciones = false;
    this.vistaListado = true;
  }

  accionLista(event) {
    this.operacionListado = event;
    this.cancelar();
  }

  cambiarActivar(event) {
    this.activar = event;
    this.deshabilitarOpciones = true;
  }

  buscarProducto(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode) && !this.esCuentaCodigoValido()) {
      if (this.productoSeleccionado.proCodigoPrincipal && this.productoSeleccionado.proCodigoPrincipal.length > 0) {
        let parametroBusquedaProducto = {
          empresa: this.empresaSeleccionada.empCodigo,
          busqueda: this.productoSeleccionado.proCodigoPrincipal ? this.productoSeleccionado.proCodigoPrincipal : null,
          categoria: null,
          bodega: this.bodegaSeleccionada ? this.bodegaSeleccionada.bodCodigo : null,
          incluirInactivos: false,
          limite: false,
          fecha: this.utilService.convertirFechaStringYYYYMMDD(this.fechaDesde)
        };
        event.srcElement.blur();
        event.preventDefault();
        const modalRef = this.modalService.open(ListadoProductosComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
        modalRef.componentInstance.parametrosBusqueda = parametroBusquedaProducto;
        modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
        modalRef.componentInstance.isModal = true;
        modalRef.result.then((result) => {
          this.productoCodigoCopia = result.proCodigoPrincipal;
          this.productoSeleccionado = result;
        }, () => {
          this.focusProducto();
        });
      } else {
        this.toastr.info(LS.MSJ_ENTER_NO_DATA, LS.TOAST_INFORMACION)
      }
    }
  }

  focusProducto() {
    let element: HTMLElement = document.getElementById('idProducto') as HTMLElement;
    element ? element.focus() : null;
  }

  esCuentaCodigoValido(): boolean {
    return this.productoCodigoCopia && this.productoCodigoCopia === this.productoSeleccionado.proCodigoPrincipal;
  }

  validarProducto() {
    if (this.productoCodigoCopia !== this.productoSeleccionado.proCodigoPrincipal) {
      this.productoCodigoCopia = null;
      this.productoSeleccionado = new InvListaProductosGeneralTO();
    }
  }
}
