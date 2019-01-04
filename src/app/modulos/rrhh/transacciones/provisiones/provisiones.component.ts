import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { SisPeriodo } from '../../../../entidades/sistema/SisPeriodo';
import { PeriodoService } from '../../../sistema/archivo/periodo/periodo.service';
import { NgForm } from '@angular/forms';
import { RhProvisionesListadoTransTO } from '../../../../entidadesTO/rrhh/RhProvisionesListadoTransTO';

@Component({
  selector: 'app-provisiones',
  templateUrl: './provisiones.component.html',
  styleUrls: ['./provisiones.component.css']
})
export class ProvisionesComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public accion: string = null;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public parametrosListado: any;
  public mostrarListado: boolean = false;
  //
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaPeriodos: Array<SisPeriodo> = [];
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public listaEstados: Array<string> = LS.LISTA_ESTADOS_PROVISIONES;
  public provisionesListadoTransTO: RhProvisionesListadoTransTO = new RhProvisionesListadoTransTO();

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private sectorService: SectorService,
    private periodoService: PeriodoService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['provisionesListadoTrans'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.provisionesListadoTransTO.empresa = LS.KEY_EMPRESA_SELECT;
    this.listarSectores();
    this.listarPeriodos();
    this.limpiarResultado();
    this.provisionesListadoTransTO.estado = this.listaEstados[0];
    this.accion = null;
  }

  listarSectores() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(listaSectores) {
    if (listaSectores.length > 0) {
      this.listaSectores = listaSectores;
      this.provisionesListadoTransTO.sector = this.listaSectores ? this.listaSectores[0].secCodigo : null;
    } else {
      this.listaSectores = [];
      this.provisionesListadoTransTO.sector = null;
    }
    this.cargando = false;
  }

  listarPeriodos() {
    this.listaPeriodos = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.periodoService.listarPeriodos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarPeriodos() y asi seleccionar el primer elemento*/
  despuesDeListarPeriodos(listaPeriodos) {
    if (listaPeriodos.length > 0) {
      this.listaPeriodos = listaPeriodos;
      this.periodoSeleccionado = this.listaPeriodos ? this.listaPeriodos[0] : null;
    } else {
      this.listaSectores = [];
      this.periodoSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.parametrosListado = null;
    this.mostrarListado = false;
  }

  listarProvisiones(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.provisionesListadoTransTO.periodo = this.periodoSeleccionado.sisPeriodoPK.perCodigo;
        this.provisionesListadoTransTO.datePeriodoHasta = this.periodoSeleccionado.perHasta;
        this.parametrosListado = {
          provisionesListadoTransTO: this.provisionesListadoTransTO,
          contableProvision: ''
        };
        this.mostrarListado = true;
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  ejecutarAccion(event) {
    if (event.accion === LS.ACCION_CANCELAR) {
      this.limpiarResultado();
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }
}
