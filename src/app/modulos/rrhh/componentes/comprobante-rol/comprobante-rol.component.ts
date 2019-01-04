import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { ToastrService } from 'ngx-toastr';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ItemListaRolTO } from '../../../../entidadesTO/rrhh/ItemListaRolTO';
import { GridApi } from 'ag-grid';
import { RolPagosService } from '../../consultas/rol-pagos/rol-pagos.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import * as moment from 'moment';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';

@Component({
  selector: 'app-comprobante-rol',
  templateUrl: './comprobante-rol.component.html',
  styleUrls: ['./comprobante-rol.component.css']
})
export class ComprobanteRolComponent implements OnInit {

  @Input() empresaSeleccionada;
  @Input() parametros;
  @Input() accion;
  @Input() rutaImprimir;
  @Input() titulo = LS.RRHH_ROL_PAGO;
  @Input() vistaPreliminar: boolean = false;
  @Input() puedeEditar: boolean = false;
  public itemListaRolTO: ItemListaRolTO = new ItemListaRolTO();
  public mostrarModal: boolean = false;
  public mostrarDescuentos: boolean = true;
  public mostrarBeneficios: boolean = true;
  public columnas: string = null;
  public constantes: any = LS;
  public hastaTextoOriginal: any;
  public cargando: boolean = true;

  //para fechas
  public es: any = {}; //Locale Date (Obligatoria)
  public isFechaValido: boolean = true;
  public periodo: SisPeriodo = new SisPeriodo();

  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;

  constructor(
    public activeModal: NgbActiveModal,
    private api: ApiRequestService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    private toastr: ToastrService,
    private rolPagosService: RolPagosService,
    private atajoService: HotkeysService,
    private periodoService: PeriodoService
  ) {
    this.itemListaRolTO = new ItemListaRolTO();
    this.constantes = LS;
    moment.locale('es'); // para la fecha
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    if (this.parametros) {
      this.cargando = true;
      !this.vistaPreliminar ? this.obtenerRol() : this.obtenerVistaPreliminar();
      this.columnas = 'col-lg-3';
      this.resetearAtajos();
    }
  }

  resetearAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('bntImprimirComprobanteRol') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('bntCancelarComprobanteRol') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  obtenerRol() {
    this.api.post("todocompuWS/rrhhWebController/obtenerRol", this.parametros, this.empresaSeleccionada.empCodigo)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.itemListaRolTO = new ItemListaRolTO(respuesta.extraInfo);
          this.mostrarModal = true;
          this.iniciarAgGrid();
          this.verificarColumansTamanio();
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          this.mostrarModal = false;
          this.activeModal.close();
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  obtenerVistaPreliminar() {
    this.api.post("todocompuWS/rrhhWebController/obtenerVistaPreliminarRol", this.parametros, this.empresaSeleccionada.empCodigo)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.itemListaRolTO = new ItemListaRolTO(respuesta.extraInfo);
          this.puedeEditar ? this.obtenerPeriodoPorFecha(this.itemListaRolTO.rolHastaTexto) : null;
          this.itemListaRolTO.rolHastaTexto = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.itemListaRolTO.rolHastaTexto);
          this.hastaTextoOriginal = this.itemListaRolTO.rolHastaTexto;
          this.mostrarModal = true;
          this.iniciarAgGrid();
          this.verificarColumansTamanio();
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          this.mostrarModal = false;
          this.activeModal.close();
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  imprimirComprobante() {
    this.cargando = true;
    if (this.empresaSeleccionada.listaSisPermisoTO.gruImprimir) {
      let parametros = { conContablePK: this.parametros.conContablePK, listaRolSaldoEmpleadoDetalladoTO: this.itemListaRolTO.detalle };
      this.archivoService.postPDF(this.rutaImprimir, parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('comprobanteRol_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    } else {
      this.cargando = false;
    }
  }

  verificarColumansTamanio() {
    this.mostrarDescuentos = this.itemListaRolTO.rhRol.rolAnticipos > 0 || this.itemListaRolTO.rhRol.rolIess > 0 || this.itemListaRolTO.rolValorPrestamos > 0 || this.itemListaRolTO.rolImpuestoRenta > 0 || this.itemListaRolTO.rhRol.rolDescuentoPermisoMedico > 0 || this.itemListaRolTO.rolDescFondoReserva > 0;
    this.mostrarBeneficios = this.itemListaRolTO.rhRol.rolLiqXiii > 0 || this.itemListaRolTO.rhRol.rolLiqXiv > 0 || this.itemListaRolTO.rhRol.rolLiqVacaciones > 0 || this.itemListaRolTO.rhRol.rolLiqSalarioDigno > 0 || this.itemListaRolTO.rhRol.rolLiqDesahucio > 0 || this.itemListaRolTO.rhRol.rolLiqDesahucioIntempestivo > 0 || this.itemListaRolTO.rhRol.rolLiqBonificacion > 0;
    if (!this.mostrarBeneficios) {
      this.columnas = 'col-lg-4';
      if (!this.mostrarDescuentos) {
        this.columnas = 'col-lg-6';
      }
    }
  }

  // validar fechas
  obtenerPeriodoPorFecha(fecha) {
    this.isFechaValido = false;
    let parametro = {
      fecha: fecha,
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.periodoService.getPeriodoPorFecha(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetPeriodoPorFecha(data: SisPeriodo) {
    this.periodo = data;
    this.cambioLaFecha();
    this.cargando = false;
  }

  cambioLaFecha() {
    if (!this.puedeEditar) {
      this.isFechaValido = true;
    } else if (this.periodo && this.itemListaRolTO.rolHastaTexto) {
      let fecha: Date = this.itemListaRolTO.rolHastaTexto.getTime();
      if (fecha >= this.periodo.perDesde && fecha <= this.periodo.perHasta) {
        this.isFechaValido = true;
      } else {
        this.isFechaValido = false;
      }
    } else {
      this.isFechaValido = false;
    }
  }
  //fin validar fechas

  cerrarModal() {
    if (this.hastaTextoOriginal === this.itemListaRolTO.rolHastaTexto) {
      this.activeModal.close();
    } else {
      this.activeModal.close({
        isFechaValido: this.isFechaValido,
        rolHastaTexto: this.itemListaRolTO.rolHastaTexto
      });
    }
  }

  iniciarAgGrid() {
    this.columnDefs = this.rolPagosService.generarColumnasConfirmacionRol();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }
}
