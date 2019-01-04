import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { LS } from '../../../../constantes/app-constants';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../sector/sector.service';
import { PiscinaService } from '../piscina/piscina.service';

@Component({
  selector: 'app-corrida',
  templateUrl: './corrida.component.html'
})
export class CorridaComponent implements OnInit {

  public listadoEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public listadoSectoresTO: Array<PrdListaSectorTO> = [];
  public listadoPiscinaTO: Array<PrdListaPiscinaTO> = [];

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public piscinaSeleccionado: PrdListaPiscinaTO = new PrdListaPiscinaTO();

  public parametrosFormulario: any = {};
  public parametrosListado: any = {};
  public constantes: any = LS;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public cargando: boolean = false;
  public vistaFormulario: boolean = false;
  public activar: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private sectorService: SectorService,
    private piscinaService: PiscinaService,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.listadoEmpresas = this.route.snapshot.data['corrida'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listadoEmpresas);
    this.listadoEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.definirAtajosDeTeclado();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.listarSectores();
    this.limpiarResultado();
  }

  listarSectores() {
    this.listadoSectoresTO = [];
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      mostrarInactivo: false
    };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarSectores() y asi seleccionar el primer elemento*/
  despuesDeListarSectores(listadoSectoresTO) {
    this.listadoSectoresTO = listadoSectoresTO;
    if (this.listadoSectoresTO.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listadoSectoresTO.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listadoSectoresTO[0];
      this.sectorSeleccionado = this.sectorSeleccionado ? this.sectorSeleccionado : this.listadoSectoresTO[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.sectorSeleccionado ? this.listarPiscinas() : null;
    this.cargando = false;
  }

  listarPiscinas() {
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : "",
      mostrarInactivo: true
    };
    this.piscinaService.listarPrdListaPiscinaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarInvConsumosMotivoTO()*/
  despuesDeListarPiscina(data) {
    this.listadoPiscinaTO = data;
    if (this.listadoPiscinaTO.length > 0) {
      this.piscinaSeleccionado = this.piscinaSeleccionado && this.piscinaSeleccionado.pisNumero ? this.listadoPiscinaTO.find(item => item.pisNumero === this.piscinaSeleccionado.pisNumero) : this.listadoPiscinaTO[0];
      this.piscinaSeleccionado = this.piscinaSeleccionado ? this.piscinaSeleccionado : this.listadoPiscinaTO[0];
    } else {
      this.piscinaSeleccionado = null;
    }
    this.cargando = false;
  }

  /** Metodo para limpiar la tabla y filas */
  limpiarResultado() {
    this.filasService.actualizarFilas("0", "0");
    this.parametrosListado = {};
    this.parametrosListado.listar = false;
    this.vistaFormulario = false;
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.utilService.verificarPermiso(accion, this, mostraMensaje);
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  listarCorridas() {
    if (this.validarObligatorios()) {
      this.parametrosListado = {};
      this.parametrosListado.empresa = LS.KEY_EMPRESA_SELECT;
      this.parametrosListado.listar = true;
      this.parametrosListado.sector = this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : "";
      this.parametrosListado.piscina = this.piscinaSeleccionado ? this.piscinaSeleccionado.pisNumero : "";
      this.vistaFormulario = false;
    }
  }

  validarObligatorios() {
    if (!this.sectorSeleccionado && !this.piscinaSeleccionado) {
      this.toastr.warning(LS.MSJ_NO_HAY_PARAMETROS_DE_BUSQUEDA, LS.TAG_AVISO);
      return false;
    }
    return true;
  }

  nuevaCorrida() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      if (this.sectorSeleccionado && this.sectorSeleccionado.secActivo && this.piscinaSeleccionado && this.piscinaSeleccionado.pisActiva) { // && this.periodoSeleccionado.perCerrado
        this.vistaFormulario = true;
        this.parametrosFormulario = this.generarParametrosFormulario();
      } else {
        this.toastr.warning(LS.MSJ_PISCINA_SECTOR_INACTIVOS, LS.TAG_AVISO);
      }
    }
  }

  cancelar() {
    this.vistaFormulario = false;
    this.activar = false;
  }

  /**
   * event contiene la empresa seleccionada, la accion que se envia y otro parametro que se ajuste a la accion
   * @param {*} event
   */
  ejecutarAccion(event) {
    this.definirAtajosDeTeclado();
    switch (event.accion) {
      case LS.ACCION_CREAR:
        this.nuevaCorrida();
        break;
      case LS.ACCION_LISTAR:
        this.listarCorridas();
        break;
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_CREADO://Se creo un objeto nuevo desde el hijo
        this.actualizarTabla(event);
        break;
      case LS.ACCION_CONSULTAR:
      case LS.ACCION_ANULAR:
      case LS.ACCION_EDITAR:
      case LS.ACCION_RESTAURAR:
        this.irAlHijo(event);
        break;
    }
  }

  actualizarTabla(event) {
    this.vistaFormulario = false;
    this.empresaSeleccionada = event.empresa;
    let parametro = { ...this.parametrosListado };
    parametro.corResultante = event.corResultante;
    parametro.listar = false;
    this.parametrosListado = parametro;
    this.activar = false;
  }

  irAlHijo(event) {
    this.parametrosFormulario.accion = event.accion;
    this.parametrosFormulario.seleccionado = event.objetoSeleccionado;
    this.parametrosFormulario.piscinaSeleccionada = this.piscinaSeleccionado;
    this.vistaFormulario = true;
    this.activar = true;
  }

  generarParametrosFormulario() {
    return {
      accion: LS.ACCION_CREAR,
      sectorSeleccionado: this.sectorSeleccionado,
      piscinaSeleccionada: this.piscinaSeleccionado
    };
  }

}
