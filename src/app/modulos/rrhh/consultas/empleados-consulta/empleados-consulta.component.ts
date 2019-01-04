import { Component, OnInit } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { RhComboCategoriaTO } from '../../../../entidadesTO/rrhh/RhComboCategoriaTO';
import { AnxProvinciaCantonTO } from '../../../../entidadesTO/anexos/AnxProvinciaCantonTO';
import { EmpleadosService } from '../../archivo/empleados/empleados.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { CategoriaService } from '../../archivo/categoria/categoria.service';
import { CantonService } from '../../../anexos/archivo/canton/canton.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados-consulta.component.html'
})
export class EmpleadosConsultaComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public sectores: Array<PrdListaSectorTO> = new Array();
  public categorias: Array<RhComboCategoriaTO> = new Array();
  public provincias: Array<AnxProvinciaCantonTO> = new Array();
  public cantones: Array<AnxProvinciaCantonTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  public categoriaSeleccionada: RhComboCategoriaTO;
  public provinciaSeleccionada: AnxProvinciaCantonTO;
  public cantonSeleccionado: AnxProvinciaCantonTO;

  public parametrosListado: any = {};
  public constantes: any = LS;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public busqueda: string = "";
  public tipoVista: string = "C";
  public cargando: boolean = false;
  public activar: boolean = false;
  public accion: string = null;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private filasService: FilasResolve,
    private utilService: UtilService,
    private empleadoService: EmpleadosService,
    private sectorService: SectorService,
    private categoriaService: CategoriaService,
    private cantonService: CantonService
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['empleadoListadoExportar'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.definirAtajosDeTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.obtenerDatosParaBusquedaEmpleados();
    this.limpiarResultado();
  }

  obtenerDatosParaBusquedaEmpleados() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT
    }
    this.empleadoService.obtenerDatosParaBusquedaEmpleados(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaBusquedaEmpleados(data) {
    this.cargando = false;
    this.sectores = data.sectores;
    this.categorias = data.categorias;
    this.provincias = data.provincias;
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

  listarProvincias() {
    this.provincias = [];
    this.cargando = true;
    this.cantonService.listarAnxDpaProvinciaTO(this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAnxDpaProvinciaTO(lista) {
    this.provincias = lista;
    if (this.provincias.length > 0) {
      this.provinciaSeleccionada = this.provinciaSeleccionada && this.provinciaSeleccionada.codigo ? this.provincias.find(item => item.codigo === this.provinciaSeleccionada.codigo) : null;
    } else {
      this.provinciaSeleccionada = null;
    }
    this.cargando = false;
  }

  listarCantones() {
    this.cantones = [];
    if (this.provinciaSeleccionada) {
      this.cargando = true;
      let parametro = {
        provincia: this.provinciaSeleccionada.codigo
      };
      this.cantonService.listarComboAnxCantonTO(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.cantonSeleccionado = null;
    }
  }

  despuesDeListarComboAnxCantonTO(lista) {
    this.cantones = lista;
    if (this.cantones.length > 0) {
      this.cantonSeleccionado = this.cantonSeleccionado && this.cantonSeleccionado.codigo ? this.cantones.find(item => item.codigo === this.cantonSeleccionado.codigo) : null;
    } else {
      this.cantonSeleccionado = null;
    }
    this.cargando = false;
  }

  limpiarResultado() {
    this.filasService.actualizarFilas("0", "0");
    this.parametrosListado = {};
    this.parametrosListado.listar = false;
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      this.listarEmpleado(false)
      return false;
    }))
  }

  listarEmpleado(estado) {
    this.parametrosListado = {};
    this.parametrosListado.empresa = LS.KEY_EMPRESA_SELECT;
    this.parametrosListado.listar = true;
    this.parametrosListado.buscar = this.busqueda;
    this.parametrosListado.estado = estado;
    this.parametrosListado.provincia = this.provinciaSeleccionada ? this.provinciaSeleccionada.codigo : null;
    this.parametrosListado.canton = this.cantonSeleccionado ? this.cantonSeleccionado.codigo : null;
    this.parametrosListado.sector = this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null;
    this.parametrosListado.categoria = this.categoriaSeleccionada ? this.categoriaSeleccionada.catNombre : null;
  }

  /**
   * event contiene la empresa seleccionada, la accion que se envia y otro parametro que se ajuste a la accion
   * @param {*} event
   */
  ejecutarAccion(event) {
    this.definirAtajosDeTeclado();
    switch (event.accion) {
      case LS.ACCION_LISTAR:
        this.listarEmpleado(false);
        break;
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
    }
  }

}
