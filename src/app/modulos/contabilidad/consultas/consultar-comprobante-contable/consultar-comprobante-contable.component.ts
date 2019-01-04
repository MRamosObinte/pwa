import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { TipoContableService } from '../../archivo/tipo-contable/tipo-contable.service';
import { PlanContableService } from '../../archivo/plan-contable/plan-contable.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consultar-comprobante-contable',
  templateUrl: './consultar-comprobante-contable.component.html',
  styleUrls: ['./consultar-comprobante-contable.component.css']
})
export class ConsultarComprobanteContableComponent implements OnInit {
  public listaPeriodos: Array<SisPeriodo> = [];
  public listaTipos: Array<ConTipoTO> = [];
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = LS;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public innerWidth: number;
  public objetoContableEnviar = null;
  public conNumero: String = null;
  public tamanioEstructura: number = 0;
  public mostrarContabilidaAcciones: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private periodoService: PeriodoService,
    private tipoContableService: TipoContableService,
    private cdRef: ChangeDetectorRef,
    private utilService: UtilService,
    private toastr: ToastrService,
    private planContableService: PlanContableService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['consultarComprobanteContable'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  buscarContable(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (formularioTocado && form && form.valid) {
      this.cargando = true;
      this.objetoContableEnviar = {
        accion: LS.ACCION_CONSULTAR,
        contable: this.periodoSeleccionado.sisPeriodoPK.perCodigo + '|' + this.tipoSeleccionado.tipCodigo + '|' + this.conNumero,
        listadoSectores: [],
        tamanioEstructura: this.tamanioEstructura,
        empresaSeleccionada: this.empresaSeleccionada,
        activar: true,
        tipoContable: this.tipoSeleccionado,
        listaPeriodos: [],
        volverACargar: false
      };
      this.mostrarContabilidaAcciones = true;
      this.cdRef.detectChanges();
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  /** Metodo que lista todos los periodos segun empresa */
  listarPeriodos() {
    this.listaPeriodos = [];
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.cargando = true;
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarPeriodos() y asi seleccionar el primer elemento*/
  despuesDeListarPeriodos(listaPeriodos) {
    this.listaPeriodos = listaPeriodos;
    if (this.listaPeriodos.length > 0) {
      this.periodoSeleccionado = this.periodoSeleccionado && this.periodoSeleccionado.sisPeriodoPK.perCodigo ? this.listaPeriodos.find(item => item.sisPeriodoPK.perCodigo === this.periodoSeleccionado.sisPeriodoPK.perCodigo) : this.listaPeriodos[0];
    } else {
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  /** Metodo que lista todos los periodos segun empresa*/
  listarTipos() {
    this.listaTipos = [];
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.cargando = true;
    this.tipoContableService.listarTipoContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo se ejecuta despues de haber ejecutado el metodo listarTipos() y asi seleccionar el primer elemento*/
  despuesDeListarTipoContable(listaTipos) {
    this.listaTipos = listaTipos;
    if (this.listaTipos.length > 0) {
      this.tipoSeleccionado = this.tipoSeleccionado && this.tipoSeleccionado.tipCodigo ? this.listaTipos.find(item => item.tipCodigo === this.tipoSeleccionado.tipCodigo) : this.listaTipos[0];
    } else {
      this.tipoSeleccionado = null;
    }
    this.cargando = false;
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.tipoSeleccionado = null;
    this.periodoSeleccionado = null;
    this.listarTipos();
    this.listarPeriodos();
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  soloNumeros(event) {
    return this.utilService.soloNumeros(event);
  }

  completarCeros() {
    this.conNumero = this.utilService.completarCeros(this.conNumero);
  }
  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable cargando */
  cambiarEstadoCargando(event) {
    this.cargando = event;
  }

  /** Metodo que se necesita para app-contable-formulario(componente), cambia de estado la variable activar */
  cambiarEstadoActivar(event) {
    this.activar = event;
    this.cdRef.detectChanges();
  }

  cerrarContabilidadAcciones(event) {
    this.activar = event.objetoEnviar ? event.objetoEnviar.activar : false;
    this.objetoContableEnviar = event.objetoEnviar;
    this.mostrarContabilidaAcciones = event.mostrarContilidadAcciones;
    this.filasService.actualizarFilas("0", "0");
    this.cdRef.detectChanges();
  }
}
