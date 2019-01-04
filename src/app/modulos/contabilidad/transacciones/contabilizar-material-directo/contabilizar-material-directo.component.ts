import { Component, OnInit } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ContabilizarMaterialDirectoService } from './contabilizar-material-directo.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';

@Component({
  selector: 'app-contabilizar-material-directo',
  templateUrl: './contabilizar-material-directo.component.html',
  styleUrls: ['./contabilizar-material-directo.component.css']
})
export class ContabilizarMaterialDirectoComponent implements OnInit {

  /* Generales */
  public constantes: any;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public frmTitulo: string;
  public classTitulo: string;
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public es: any;
  public vistaFormulario: boolean = false;//Es true siempre que es listado tambien sea true
  public vistaListado: boolean = false;
  public parametroBusquedaListado: any = {};
  //Formulario
  public mostrarDialogo: boolean = false;
  public listaMensajes: Array<string> = [];
  public tituloDialogo: string = "";

  constructor(
    private sectorService: SectorService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private materialDirectoService: ContabilizarMaterialDirectoService,
  ) {
    this.constantes = LS; //Hace referncia a los constantes
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.es = this.utilService.setLocaleDate();
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['contabilizarIPPDirecto'];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.cambiarEmpresaSelect();
    }
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.inicializarAtajos();
    this.obtenerFechaInicioActualMes();
  }

  inicializarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarLista();
    this.activar = false;
    this.listarSectores();
  }

  obtenerFechaInicioActualMes() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarLista() {
    this.vistaListado = false;
    this.activar = false;
    this.filasService.actualizarFilas(0);
  }

  listarSectores() {
    this.cargando = true;
    this.listaSectores = [];
    this.sectorSeleccionado = null;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.listaSectores = data;
    if (this.listaSectores.length > 0)
      this.sectorSeleccionado = this.listaSectores[0];
    this.cargando = false;
  }

  buscarContabilizarMaterialDirecto() {
    this.cargando = true;
    let fechaInicio = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaDesde);
    let fechaFin = this.utilService.formatoStringSinZonaHorariaYYYMMDD(this.fechaHasta);
    if (this.fechaDesde && this.fechaHasta && fechaInicio.split('-')[0] === fechaFin.split('-')[0]) {
      let parametros = {
        empCodigo: LS.KEY_EMPRESA_SELECT,
        fechaDesde: fechaInicio,
        fechaHasta: fechaFin
      }
      this.materialDirectoService.existenConsumosPendientes(parametros, this, LS.KEY_EMPRESA_SELECT)
        .then(data => {
          if (data === false) {
            let parametro = {
              empresa: LS.KEY_EMPRESA_SELECT,
              fechaInicio: fechaInicio,
              fechaFin: fechaFin,
              parametro: 'DIRECTO'
            }
            this.parametroBusquedaListado = parametro;
            this.vistaListado = true;
          } else if (data && data.extraInfo) {
            this.listaMensajes = data.extraInfo;
            this.tituloDialogo = data.operacionMensaje;
            this.mostrarDialogo = true;
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    } else {
      this.cargando = false;
      this.toastr.warning(LS.MSJ_FECHAS_DIFERENTES, LS.TOAST_ADVERTENCIA)
    }
  }

  modificarActivar(event) {
    this.activar = event;
  }

}
