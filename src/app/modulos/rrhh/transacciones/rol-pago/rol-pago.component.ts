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
import { RhComboFormaPagoTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoTO';
import { FormaPagoService } from '../../archivo/forma-pago/forma-pago.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RolPagoService } from './rol-pago.service';
import { RhRolMotivo } from '../../../../entidades/rrhh/RhRolMotivo';
import { MotivoRolPagoService } from '../../archivo/motivo-rol-pago/motivo-rol-pago.service';

@Component({
  selector: 'app-rol-pago',
  templateUrl: './rol-pago.component.html'
})
export class RolPagoComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public sectores: Array<PrdListaSectorTO> = new Array();
  public categorias: Array<RhComboCategoriaTO> = new Array();
  public motivos: Array<RhRolMotivo> = new Array();
  public formasDePago: Array<RhComboFormaPagoTO> = new Array();
  public periodos: Array<SisPeriodo> = new Array();

  public sectorSeleccionado: PrdListaSectorTO;
  public categoriaSeleccionada: RhComboCategoriaTO;
  public motivoSeleccionado: RhRolMotivo = new RhRolMotivo();
  public fpSeleccionada: RhComboFormaPagoTO;
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();

  public parametrosFormulario: any = {};
  public constantes: any = LS;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public vistaFormulario: boolean = false;
  public cargando: boolean = false;
  public activar: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private rolesPagoService: RolPagoService,
    private sectorService: SectorService,
    private categoriaService: CategoriaService,
    private motivoService: MotivoRolPagoService,
    private formaPagoService: FormaPagoService,
    private periodoService: PeriodoService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['rolListadoTrans'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.definirAtajosDeTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.obtenerDatosParaRolesDePago();
    this.limpiarResultado();
  }

  obtenerDatosParaRolesDePago() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.rolesPagoService.obtenerDatosParaRolesDePago(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaRolesDePago(data) {
    this.cargando = false;
    this.sectores = data.sectores;
    this.categorias = data.categorias;
    this.motivos = data.motivos;
    this.motivoSeleccionado = this.motivos[0];
    this.despuesDeListarComboFormasPago(data.formasDePago);
    this.periodos = data.periodos;
    this.periodoSeleccionado = this.periodos[0];
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
    this.motivoService.listarMotivoRolPago(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarMotivoRolPago(lista) {
    this.motivos = lista;
    if (this.motivos.length > 0) {
      this.motivoSeleccionado = this.motivoSeleccionado && this.motivoSeleccionado.rhRolMotivoPK.motDetalle ? this.motivos.find(item => item.rhRolMotivoPK.motDetalle === this.motivoSeleccionado.rhRolMotivoPK.motDetalle) : this.motivos[0];
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
    this.formasDePago.push(this.rolesPagoService.fpPorPagar());
    if (this.formasDePago.length > 0) {
      this.fpSeleccionada = this.fpSeleccionada && this.fpSeleccionada.fpDetalle ? this.formasDePago.find(item => item.fpDetalle === this.fpSeleccionada.fpDetalle) : null;
    } else {
      this.fpSeleccionada = null;
    }
    this.cargando = false;
  }

  listarPeriodos() {
    this.periodos = [];
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    };
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPeriodos(lista) {
    this.periodos = lista;
    if (this.periodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.sisPeriodoPK.perCodigo ? this.periodos.find(item => item.sisPeriodoPK.perCodigo === this.periodoSeleccionado.sisPeriodoPK.perCodigo) : this.periodos[0];
    } else {
      this.periodoSeleccionado = null;
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

  buscar(form: NgForm) {
    if (this.validarAntesDeEnviar(form)) {
      this.parametrosFormulario = {};
      this.parametrosFormulario.empresa = LS.KEY_EMPRESA_SELECT;
      this.parametrosFormulario.sector = this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null;
      this.parametrosFormulario.categoria = this.categoriaSeleccionada ? this.categoriaSeleccionada.catNombre : null;
      this.parametrosFormulario.listar = true;
      this.parametrosFormulario.rol = true;
      this.parametrosFormulario.perHasta = this.periodoSeleccionado ? this.utilService.convertirFechaStringDDMMYYYY(new Date(this.periodoSeleccionado.perHasta)) : null;
      this.parametrosFormulario.fechaHasta = this.periodoSeleccionado ?
        this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.periodoSeleccionado.perHasta) + "¬" + this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.periodoSeleccionado.perDesde) :
        null;
      this.parametrosFormulario.fpSeleccionada = this.fpSeleccionada;
      this.parametrosFormulario.periodoSeleccionado = this.periodoSeleccionado;
      this.parametrosFormulario.motivo = this.motivoSeleccionado ? this.motivoSeleccionado.rhRolMotivoPK.motDetalle : null;
      this.vistaFormulario = true;
    }
  }

  validarAntesDeEnviar(form: NgForm) {
    let validado = true;
    let formTouched = this.utilService.establecerFormularioTocado(form);
    if (!(formTouched && form && form.valid)) {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    if (!this.formasDePago || this.formasDePago.length == 0) {
      this.toastr.warning(LS.MSJ_NO_EXISTEN_FORMAS_PAGO, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    if (!this.periodoSeleccionado || !this.periodoSeleccionado.sisPeriodoPK.perCodigo) {
      this.toastr.warning(LS.MSJ_NO_EXISTE_PERIODO_SELECCIONADO, LS.MSJ_TITULO_INVALIDOS);
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
