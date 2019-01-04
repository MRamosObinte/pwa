import { Component, OnInit } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { RhComboCategoriaTO } from '../../../../entidadesTO/rrhh/RhComboCategoriaTO';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { CategoriaService } from '../../archivo/categoria/categoria.service';
import { RhAnticipoMotivo } from '../../../../entidades/rrhh/RhAnticipoMotivo';
import { RhComboFormaPagoTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoTO';
import { MotivoAnticiposService } from '../../archivo/motivo-anticipos/motivo-anticipos.service';
import { FormaPagoService } from '../../archivo/forma-pago/forma-pago.service';
import { AnticiposService } from './anticipos.service';
import * as moment from 'moment';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-anticipos',
  templateUrl: './anticipos.component.html'
})
export class AnticiposComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public sectores: Array<PrdListaSectorTO> = new Array();
  public categorias: Array<RhComboCategoriaTO> = new Array();
  public motivos: Array<RhAnticipoMotivo> = new Array();
  public formasDePago: Array<RhComboFormaPagoTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  public categoriaSeleccionada: RhComboCategoriaTO;
  public motivoSeleccionado: RhAnticipoMotivo = new RhAnticipoMotivo();
  public fpSeleccionada: RhComboFormaPagoTO;

  public parametrosFormulario: any = {};
  public constantes: any = LS;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public vistaFormulario: boolean = false;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isFechaValido: boolean = false;
  public es: any = {}; //Locale Date (Obligatoria)
  public fechaActual: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private anticipoService: AnticiposService,
    private sectorService: SectorService,
    private categoriaService: CategoriaService,
    private motivoService: MotivoAnticiposService,
    private formaPagoService: FormaPagoService,
    private periodoService: PeriodoService,
    private toastr: ToastrService
  ) {
    moment.locale('es'); // para la fecha
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['anticipoListadoTrans'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.definirAtajosDeTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.obtenerDatosParaCrudAnticipos();
    this.limpiarResultado();
  }

  obtenerDatosParaCrudAnticipos() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.anticipoService.obtenerDatosParaCrudAnticipos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaCrudAnticipos(data) {
    this.cargando = false;
    this.fechaActual = new Date(data.fechaActual);
    this.validarFechaPorPeriodo();
    this.sectores = data.sectores;
    this.categorias = data.categorias;
    this.motivos = data.motivos;
    this.motivoSeleccionado = this.motivos[0];
    this.formasDePago = data.formasDePago;
  }

  listarSectores() {
    this.sectores = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    this.sectores = listaSectores;
    if (this.sectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : null;
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  listarCategorias() {
    this.categorias = [];
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, activo: true };
    this.categoriaService.listarCategorias(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarCategorias(lista) {
    this.categorias = lista;
    if (this.categorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.catNombre ? this.categorias.find(item => item.catNombre === this.categoriaSeleccionada.catNombre) : null;
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  listarMotivos() {
    this.motivos = [];
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      estado: true
    }
    this.motivoService.listarMotivoAnticipos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarMotivoAnticipos(lista) {
    this.motivos = lista;
    if (this.motivos.length > 0) {
      this.motivoSeleccionado = this.motivoSeleccionado && this.motivoSeleccionado.rhAnticipoMotivoPK.motDetalle ? this.motivos.find(item => item.rhAnticipoMotivoPK.motDetalle === this.motivoSeleccionado.rhAnticipoMotivoPK.motDetalle) : this.motivos[0];
    } else {
      this.motivoSeleccionado = null;
    }
    this.cargando = false;
  }

  listarFormasDePago() {
    this.formasDePago = [];
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    };
    this.formaPagoService.listarComboFormasPago(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarComboFormasPago(lista) {
    this.formasDePago = lista;
    if (this.formasDePago.length > 0) {
      this.fpSeleccionada = this.fpSeleccionada && this.fpSeleccionada.fpDetalle ? this.formasDePago.find(item => item.fpDetalle === this.fpSeleccionada.fpDetalle) : null;
    } else {
      this.fpSeleccionada = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.filasService.actualizarFilas("0", "0");
    this.vistaFormulario = false;
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element = document.getElementById("buscar");
      element ? element.click() : null;
      return false;
    }))
  }

  // validar fechas
  validarFechaPorPeriodo() {
    this.isFechaValido = false;
    let parametro = {
      fecha: moment(this.fechaActual).format('YYYY-MM-DD'),
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.periodoService.getPeriodoPorFecha(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetPeriodoPorFecha(data: SisPeriodo) {
    if (data && !data.perCerrado) {
      this.isFechaValido = true;
    } else {
      this.isFechaValido = false;
    }
  }

  cambioLaFecha() {
    this.fechaActual ? this.validarFechaPorPeriodo() : this.isFechaValido = false;
  }
  //fin validar fechas

  buscar(form: NgForm) {
    if (this.validarAntesDeEnviar(form)) {
      this.parametrosFormulario = {};
      this.parametrosFormulario.empresa = LS.KEY_EMPRESA_SELECT;
      this.parametrosFormulario.sector = this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null;
      this.parametrosFormulario.categoria = this.categoriaSeleccionada ? this.categoriaSeleccionada.catNombre : null;
      this.parametrosFormulario.listar = true;
      this.parametrosFormulario.fechaHasta = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaActual);
      this.parametrosFormulario.fecha = this.utilService.convertirFechaStringDDMMYYYY(this.fechaActual);
      this.parametrosFormulario.formaPago = this.fpSeleccionada ? this.fpSeleccionada.fpDetalle : null;
      this.parametrosFormulario.fpSeleccionada = this.fpSeleccionada;
      this.parametrosFormulario.motivo = this.motivoSeleccionado ? this.motivoSeleccionado.rhAnticipoMotivoPK.motDetalle : null;
      this.vistaFormulario = true;
    }
  }

  validarAntesDeEnviar(form: NgForm) {
    let validado = true;
    let formTouched = this.utilService.establecerFormularioTocado(form);
    if (!(formTouched && form && form.valid) || !this.isFechaValido) {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    if (!this.formasDePago || this.formasDePago.length == 0) {
      this.toastr.warning(LS.MSJ_NO_EXISTEN_FORMAS_PAGO, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    return validado;
  }

  ejecutarAccion(event) {
    this.definirAtajosDeTeclado();
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.activar = false;
        this.vistaFormulario = false;
        break;
    }
  }

}
