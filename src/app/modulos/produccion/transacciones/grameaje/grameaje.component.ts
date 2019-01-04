import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import * as moment from 'moment'
import { LS } from '../../../../constantes/app-constants';
import { SectorService } from '../../archivos/sector/sector.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { NgForm } from '@angular/forms';
import { GrameajeService } from './grameaje.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';

@Component({
  selector: 'app-grameaje',
  templateUrl: './grameaje.component.html',
  styleUrls: ['./grameaje.component.css']
})
export class GrameajeComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public es: object = {};
  public constantes: any = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  // SECTORES
  public listaSectores: Array<PrdListaSectorTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  // FECHA
  public fechaHasta: any = new Date();
  public fechaActual: any = new Date();
  //
  public filasTiempo: FilasTiempo = new FilasTiempo();
  //Para mostrar Listado
  public parametrosGramaje;
  public vistaFormulario: boolean = false

  constructor(
    private utilService: UtilService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
    private sectorService: SectorService,
    private gramajeService: GrameajeService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['grameaje'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.obtenerFechaActual();
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.listarSectores();
    this.limpiarResultado();
  }

  listarSectores() {
    this.limpiarResultado();
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false }
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.listaSectores = data;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  obtenerFechaActual() {
    this.cargando = true;
    this.sistemaService.obtenerFechaServidor(this, this.empresaSeleccionada);
  }

  despuesDeObtenerFechaServidor(data) {
    this.cargando = false;
    this.fechaHasta = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
    this.fechaActual = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data);
  }

  limpiarResultado() {
    this.parametrosGramaje = null;
    this.vistaFormulario = false;
    this.filasService.actualizarFilas("0", "0");
  }

  //Operaciones
  buscarGramaje(form: NgForm, incluirTodos) {
    this.limpiarResultado();
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          incluirTodos: incluirTodos,
          empresa: this.empresaSeleccionada.empCodigo,
          sector: this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado.secCodigo : '',
          fecha: this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta),
        };
        this.filasTiempo.iniciarContador();
        this.gramajeService.listarGramaje(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesListarGramaje(lista) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    if (lista.length > 0) {
      lista.forEach(value => {
        value.graSobrevivenciaAnterior = value.graSobrevivencia;//Temporal
        value.isMenorQuePesoAnterior = false;//Temporal
        value.isMayorQueSobrevivenciaAnterior = false;//Temporal
        value.noEditable = (value.graSobrevivencia > 0 && value.graPesoActual > 0);
        if (value.noEditable) {
          value.graBiomasa = this.gramajeService.calculoGramajeBiomasa(value);
          value.graAnimalesM2 = this.gramajeService.calculoGramajeAnimalesM2(value);
        }
      });
      this.vistaFormulario = true;
      this.parametrosGramaje = {
        listaResultado: lista,
        fechaHasta: this.fechaHasta,
        sectorSeleccionado: this.sectorSeleccionado,
        empresaSeleccionada: this.empresaSeleccionada
      }
    }
  }

  accionesGramaje(event) {
    let objeto = event;
    switch (objeto.accion) {
      case LS.ACCION_ACTIVAR: {
        this.activar = objeto.estado;
        break;
      }
      case LS.ACCION_CANCELAR: {
        this.activar ? this.activar = false : null;
        this.limpiarResultado();
        break;
      }
    }
  }
}
