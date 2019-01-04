import { NgForm } from '@angular/forms';
import { MotivoBonosService } from './../../archivo/motivo-bonos/motivo-bonos.service';
import { RhBonoMotivo } from './../../../../entidades/rrhh/RhBonoMotivo';
import { AppSistemaService } from './../../../../serviciosgenerales/app-sistema.service';
import { Hotkey } from 'angular2-hotkeys/src/hotkey.model';
import { UtilService } from './../../../../serviciosgenerales/util.service';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { CategoriaService } from './../../archivo/categoria/categoria.service';
import { PiscinaService } from './../../../produccion/archivos/piscina/piscina.service';
import { SectorService } from './../../../produccion/archivos/sector/sector.service';
import { ConceptoBonosService } from './../../archivo/concepto-bonos/concepto-bonos.service';
import { RhListaBonoConceptoTO } from './../../../../entidadesTO/rrhh/RhListaBonoConceptoTO';
import { PrdListaSectorTO } from './../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PermisosEmpresaMenuTO } from './../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { RhComboCategoriaTO } from './../../../../entidadesTO/rrhh/RhComboCategoriaTO';
import { LS } from './../../../../constantes/app-constants';
import { FilasTiempo } from './../../../../enums/FilasTiempo';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SistemaService } from '../../../sistema/sistema/sistema.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';

@Component({
  selector: 'app-bonos',
  templateUrl: './bonos.component.html',
  styleUrls: ['./bonos.component.css']
})
export class BonosComponent implements OnInit {
  public parametrosFormulario;
  public parametrosBusqueda;

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public listaCategorias: Array<RhComboCategoriaTO> = [];
  public listaConceptos: Array<RhListaBonoConceptoTO> = [];
  public listaPiscinas: Array<PrdListaPiscinaTO> = [];
  public listaMotivos: Array<RhBonoMotivo> = [];

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public categoriaSeleccionada: RhComboCategoriaTO = new RhComboCategoriaTO();
  public conceptoSeleccionado: RhListaBonoConceptoTO = new RhListaBonoConceptoTO();
  public piscinaSeleccionada: PrdListaPiscinaTO = new PrdListaPiscinaTO();
  public motivoSeleccionado: RhBonoMotivo = new RhBonoMotivo();

  public periodoAbierto: boolean = false;
  public es: object = {};
  public fechaFin: any;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public filasTiempo: FilasTiempo = new FilasTiempo();

  constructor(
    private piscinaService: PiscinaService,
    private conceptoBonoService: ConceptoBonosService,
    private sectorService: SectorService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private appSistemaService: AppSistemaService,
    private motivoBonoService: MotivoBonosService,
    private filasService: FilasResolve,
    private sistemaService: SistemaService) {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data["bonoListadoTrans"];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaActual();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarBonos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarBonos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.categoriaSeleccionada = null;
    this.conceptoSeleccionado = null;
    this.piscinaSeleccionada = null;
    this.limpiarResultado();
    this.listarSectores();
    this.listarCategoria();
    this.listarConceptoBonos();
    this.listarMotivosBono();
    this.validarPeriodoAbierto();
  }

  obtenerFechaActual() {
    this.appSistemaService.getFechaActual(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaFin = data;
        this.validarPeriodoAbierto();
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.activar = false;
    this.parametrosFormulario = null;
    this.parametrosBusqueda = null;
    this.filasService.actualizarFilas(0, 0);
  }

  validarPeriodoAbierto() {
    this.periodoAbierto = false;
    if (this.fechaFin) {
      let parametro = { empresa: this.empresaSeleccionada.empCodigo, fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaFin) };
      this.sistemaService.getIsPeriodoAbierto(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeObtenerIsPeriodoAbierto(data) {
    this.periodoAbierto = data;
  }

  //Listar conceptos
  listarConceptoBonos() {
    this.limpiarResultado();
    this.cargando = true;
    this.listaConceptos = [];
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: false };
    this.conceptoBonoService.listarConceptoBonos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetListaRhBonoConceptoTO(data) {
    this.listaConceptos = data;
    if (this.listaConceptos.length > 0) {
      this.conceptoSeleccionado = this.conceptoSeleccionado && this.conceptoSeleccionado.bcSecuencia ? this.listaConceptos.find(item => item.bcSecuencia === this.conceptoSeleccionado.bcSecuencia) : this.listaConceptos[0];
    } else {
      this.conceptoSeleccionado = null;
    }
    this.cargando = false;
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
    this.listarPiscinas();
    this.cargando = false;
  }

  //Listar piscinas
  listarPiscinas() {
    this.limpiarResultado();
    this.cargando = true;
    this.listaPiscinas = [];
    if (this.sectorSeleccionado && this.sectorSeleccionado.secCodigo) {
      let parametros = {
        empresa: LS.KEY_EMPRESA_SELECT,
        sector: this.sectorSeleccionado.secCodigo,
        mostrarInactivo: false
      }
      this.piscinaService.listarPrdListaPiscinaTO(parametros, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cargando = false;
      this.piscinaSeleccionada = null;
    }
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

  //Listar categorias
  listarCategoria() {
    this.limpiarResultado();
    this.listaCategorias = [];
    this.cargando = true;
    this.categoriaService.listarComboRhCategoriaTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarComboRhCategoriaTO(data) {
    this.listaCategorias = data;
    if (this.listaCategorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.catNombre ? this.listaCategorias.find(item => item.catNombre === this.categoriaSeleccionada.catNombre) : this.listaCategorias[0];
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  //Listar motivos
  listarMotivosBono() {
    this.limpiarResultado();
    this.cargando = true;
    this.listaMotivos = [];
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: false };
    this.motivoBonoService.listarMotivoBonos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarPrdListaRhBonoMotivoTO(data) {
    this.listaMotivos = data;
    if (this.listaMotivos.length > 0) {
      this.motivoSeleccionado = this.motivoSeleccionado && this.motivoSeleccionado.rhBonoMotivoPK.motDetalle ? this.listaMotivos.find(item => item.rhBonoMotivoPK.motDetalle === this.motivoSeleccionado.rhBonoMotivoPK.motDetalle) : this.listaMotivos[0];
    } else {
      this.motivoSeleccionado = null;
    }
    this.cargando = false;
  }

  //Operaciones
  buscarBonos(form: NgForm) {
    this.limpiarResultado();
    this.cargando = true;
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado && this.periodoAbierto) {
      if (this.listaConceptos.length > 0) {
        this.filasTiempo.iniciarContador();
        /**Para realizar la busqueda */
        this.parametrosBusqueda = {
          empresa: this.empresaSeleccionada.empCodigo,
          categoria: this.categoriaSeleccionada ? this.categoriaSeleccionada.catNombre : null,
          sector: this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null,
          motivo: this.motivoSeleccionado ? this.motivoSeleccionado.rhBonoMotivoPK.motDetalle : null,
          fechaHasta: this.utilService.convertirFechaStringYYYYMMDD(this.fechaFin),
          rol: false,
          listadoPiscinas: this.listaPiscinas.length > 0 ? this.listaPiscinas : null
        }
        /**Para ser usado en el formulario */
        this.parametrosFormulario = {
          empresaSeleccionada: this.empresaSeleccionada,
          listadoConceptos: this.listaConceptos,
          listadoPiscinas: this.listaPiscinas,
          conceptoSeleccionado: this.conceptoSeleccionado,
          piscinaSeleccionada: this.piscinaSeleccionada,
          fechaFin: this.fechaFin,
          activarBonos: this.activar
        }
      } else {
        this.toastr.warning(LS.MSJ_POR_LO_MENOS_1_CONCEPTO, LS.TAG_AVISO);
        this.cargando = false;
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  accionesBonos(event) {
    let objeto = event;
    switch (objeto.accion) {
      case LS.ACCION_ACTIVAR: {
        this.activar = objeto.estado;
        break;
      }
      case LS.ACCION_CARGANDO: {
        this.cargando = objeto.estado;
        break;
      }
      case LS.ACCION_LIMPIAR_RESULTADO: {
        this.limpiarResultado();
        break;
      }
    }
  }
}
