import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import * as moment from 'moment'
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { PrdListaCorridaTO } from '../../../../entidadesTO/Produccion/PrdListaCorridaTO';
import { SectorService } from '../../archivos/sector/sector.service';
import { PiscinaService } from '../../archivos/piscina/piscina.service';
import { CorridaService } from '../../archivos/corrida/corrida.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { PrdUtilidadDiariaCorridaTO } from '../../../../entidadesTO/Produccion/PrdUtilidadDiariaCorridaTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { UtilidadDiariaService } from './utilidad-diaria.service';

@Component({
  selector: 'app-utilidad-diaria',
  templateUrl: './utilidad-diaria.component.html',
  styleUrls: ['./utilidad-diaria.component.css']
})
export class UtilidadDiariaComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public es: object = {};
  public cargando: boolean = false;
  public activar: boolean = false;
  //
  public listaSectores: Array<PrdListaSectorTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  //
  public listaPiscina: Array<PrdListaPiscinaTO> = new Array();
  public piscinaSeleccionado: PrdListaPiscinaTO
  //
  public listaCorridas: Array<PrdListaCorridaTO> = new Array();
  public corridaSeleccionada: PrdListaCorridaTO;
  //
  public listaResultado: Array<PrdUtilidadDiariaCorridaTO> = [];
  //
  public filasTiempo: FilasTiempo = new FilasTiempo();
  //
  public descripcion: string = "";
  public valorTexto: string = "";
  //
  public listaResumenBiologico: Array<PrdUtilidadDiariaCorridaTO> = [];
  public listaResumenFinanciero: Array<PrdUtilidadDiariaCorridaTO> = [];
  public listaConsumoBalanceado: Array<PrdUtilidadDiariaCorridaTO> = [];

  constructor(
    private utilService: UtilService,
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private sectorService: SectorService,
    private piscinaService: PiscinaService,
    private corridaService: CorridaService,
    private atajoService: HotkeysService,
    private toastr: ToastrService,
    private utilidadDiariaService: UtilidadDiariaService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['utilidadDiaria'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarSectores();
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listaResultado = [];
    this.filasService.actualizarFilas("0", "0");
  }

  listarSectores() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      mostrarInactivo: false
    }
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.cargando = false;
    this.listaSectores = data;
    this.sectorSeleccionado = this.listaSectores ? this.listaSectores[0] : undefined;
    if (this.sectorSeleccionado) {
      this.listarPiscinas();
    }
  }

  listarPiscinas() {
    if (this.piscinaService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado.secCodigo,
        mostrarInactivo: false,
      };
      this.piscinaService.listarPrdListaPiscinaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeListarPiscina(data) {
    if (data) {
      this.listaPiscina = data;
      this.piscinaSeleccionado = this.listaPiscina ? this.listaPiscina[0] : null;
      if (this.piscinaSeleccionado) {
        this.listarCorridas();
      }
    }
    this.cargando = false;
  }

  listarCorridas() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametro = {
        empresa: this.empresaSeleccionada.empCodigo,
        sector: this.sectorSeleccionado.secCodigo,
        piscina: this.piscinaSeleccionado.pisNumero,
        mostrarInactivo: false,
      };
      this.corridaService.listarPrdListaCorridaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeListarCorrida(data) {
    if (data) {
      this.listaCorridas = data;
      this.corridaSeleccionada = this.listaCorridas ? this.listaCorridas[0] : null;
    }
    this.cargando = false;
  }

  listarUtilidadDiaria(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let parametro = {
          empresa: this.empresaSeleccionada.empCodigo,
          sector: this.sectorSeleccionado.secCodigo,
          piscina: this.piscinaSeleccionado.pisNumero,
          corrida: this.corridaSeleccionada.corNumero,
        };
        this.filasTiempo.iniciarContador();
        this.utilidadDiariaService.listarUtilidadDiaria(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeListarUtilidadDiaria(lista) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listaResultado = lista;
    this.setearListas(this.listaResultado);
  }

  setearListas(lista: Array<PrdUtilidadDiariaCorridaTO>) {
    for (let listaUtilidad of lista) {
      if (listaUtilidad.uTipo == "1) RESUMEN BIOLOGICO") {
        let listaUtilidadPK = new PrdUtilidadDiariaCorridaTO();
        listaUtilidadPK.uDescripcion = listaUtilidad.uDescripcion;
        listaUtilidadPK.uValorNumerico = listaUtilidad.uValorNumerico;
        listaUtilidadPK.uValorTexto = listaUtilidad.uValorTexto;
        this.listaResumenBiologico.push(listaUtilidadPK);
      }
      if (listaUtilidad.uTipo == "2) RESUMEN FINANCIERO") {
        let listaUtilidadPK = new PrdUtilidadDiariaCorridaTO();
        listaUtilidadPK.uDescripcion = listaUtilidad.uDescripcion;
        listaUtilidadPK.uValorNumerico = listaUtilidad.uValorNumerico;
        listaUtilidadPK.uValorTexto = listaUtilidad.uValorTexto;
        this.listaResumenFinanciero.push(listaUtilidadPK);
      }
      if (listaUtilidad.uTipo == "3) CONSUMO BALANCEADO") {
        let listaUtilidadPK = new PrdUtilidadDiariaCorridaTO();
        listaUtilidadPK.uDescripcion = listaUtilidad.uDescripcion;
        listaUtilidadPK.uValorNumerico = listaUtilidad.uValorNumerico;
        listaUtilidadPK.uValorTexto = listaUtilidad.uValorTexto;
        this.listaConsumoBalanceado.push(listaUtilidadPK);
      }
    }
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        sector: this.sectorSeleccionado.secCodigo,
        piscina: this.piscinaSeleccionado.pisNumero,
        corrida: this.corridaSeleccionada.corNumero,
        reporteUtilidadDiaria: this.listaResultado
      };
      this.utilidadDiariaService.imprimirUtilidadDiaria(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        usuarioEmpresaReporteTO: this.empresaSeleccionada ? this.empresaSeleccionada.empCodigo : '',
        sector: this.sectorSeleccionado.secCodigo,
        piscina: this.piscinaSeleccionado.pisNumero,
        corrida: this.corridaSeleccionada.corNumero,
        listaResumenBiologico: this.listaResumenBiologico,
        listaResumenFinanciero: this.listaResumenFinanciero,
        listaConsumoBalanceado: this.listaConsumoBalanceado
      };
      this.utilidadDiariaService.exportarUtilidadDiaria(parametros, this, this.empresaSeleccionada);
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }
}
