import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { InvVentaMotivoComboTO } from '../../../../entidadesTO/inventario/InvVentaMotivoComboTO';
import { MotivoVentasService } from '../../archivo/motivo-ventas/motivo-ventas.service';
import { ToastrService } from 'ngx-toastr';
import { VentaService } from '../../transacciones/venta/venta.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-venta-busqueda',
  templateUrl: './venta-busqueda.component.html'
})
export class VentaBusquedaComponent implements OnInit, OnChanges {

  listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  listadoPeriodos: Array<SisPeriodo> = new Array();
  listadoMotivos: Array<InvVentaMotivoComboTO> = new Array();

  empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  motivoSeleccionado: InvVentaMotivoComboTO = new InvVentaMotivoComboTO();
  periodoSeleccionado: SisPeriodo = new SisPeriodo();

  @Input() ruta: string = "";
  @Input() tipoDocumento: string = "";
  @Input() vistaFormulario: boolean = false;
  @Output() enviarAccion = new EventEmitter();

  filtro: string = "";
  constantes: any = LS;

  activar: boolean = false;
  cargando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private motivoVentaService: MotivoVentasService,
    private periodoService: PeriodoService,
    private atajoService: HotkeysService,
    private ventaService: VentaService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) {
    this.definirAtajosDeTeclado();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data[this.ruta];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.cambiarEmpresaSelect();
    }
  }

  ngOnChanges(changes) {
    if (changes.vistaFormulario) {
      this.vistaFormulario = this.vistaFormulario;
    }
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      !this.vistaFormulario ? this.listarVentas() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      !this.vistaFormulario ? this.nuevaVenta() : null;
      return false;
    }))
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_CAMBIAR_EMPRESA
    }
    this.enviarAccion.emit(parametro);
    this.activar = false;
    this.listarPeriodos();
    this.listarInvVentaMotivoComboTO(false);
  }

  limpiarLista() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_CAMBIAR_EMPRESA
    }
    this.enviarAccion.emit(parametro);
    this.activar = false;
  }

  listarVentas() {
    if (this.validarObligatorios()) {
      this.vistaFormulario = false;
      let parametro = {
        empresaSeleccionada: this.empresaSeleccionada,
        accion: LS.ACCION_LISTAR,
        empresa: LS.KEY_EMPRESA_SELECT,
        periodo: this.periodoSeleccionado ? this.periodoSeleccionado.sisPeriodoPK.perCodigo : "",
        motivo: this.motivoSeleccionado ? this.motivoSeleccionado.vmCodigo : "",
        busqueda: this.filtro,
        tipoDocumento: this.tipoDocumento,
        listaPeriodos: this.listadoPeriodos
      }
      this.enviarAccion.emit(parametro);
    }
  }

  validarObligatorios() {
    if (!this.periodoSeleccionado && !this.motivoSeleccionado && !this.filtro) {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
      return false;
    }
    return true;
  }

  nuevaVenta() {
    let parametro = {
      empresa: this.empresaSeleccionada,
      accion: LS.ACCION_CREAR
    }
    this.enviarAccion.emit(parametro);
  }

  listarPeriodos() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.cargando = true;
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPeriodos(listadoPeriodos) {
    this.listadoPeriodos = listadoPeriodos ? listadoPeriodos : [];
    this.periodoSeleccionado = this.listadoPeriodos.length > 0 ? this.listadoPeriodos[0] : null;
  }

  listarInvVentaMotivoComboTO(estado) {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      filtrarInactivos: estado
    }
    this.cargando = true;
    this.motivoVentaService.listarInvVentaMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvVentaMotivoTO(data) {
    this.listadoMotivos = data;
    this.motivoSeleccionado = data[0];
  }

  verificarPermiso(accion, mensaje?): boolean {
    return this.ventaService.verificarPermiso(accion, this.empresaSeleccionada, mensaje);
  }

}
