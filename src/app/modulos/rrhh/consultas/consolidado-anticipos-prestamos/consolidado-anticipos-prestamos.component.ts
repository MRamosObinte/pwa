import { Component, OnInit, Input } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { RhComboCategoriaTO } from '../../../../entidadesTO/rrhh/RhComboCategoriaTO';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { CategoriaService } from '../../archivo/categoria/categoria.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { EmpleadosListadoComponent } from '../../componentes/empleados-listado/empleados-listado.component';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consolidado-anticipos-prestamos',
  templateUrl: './consolidado-anticipos-prestamos.component.html',
  styleUrls: ['./consolidado-anticipos-prestamos.component.css']
})
export class ConsolidadoAnticiposPrestamosComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public accion: string = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public fechaDesde: Date = new Date();
  public fechaHasta: Date = new Date();
  public fechaActual: Date = new Date();
  public es: object = {};
  public parametrosListado: any;
  public mostrarListado: boolean = false;
  //
  public listaCategorias: Array<RhComboCategoriaTO> = new Array();
  public categoriaSeleccionada: RhComboCategoriaTO;
  public trabajador: RhEmpleado = new RhEmpleado();
  public filaSeleccionada: any;
  public codigoEmpleado: string = null;
  public estadoformulario: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private categoriaService: CategoriaService,
    private sistemaService: AppSistemaService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['consolidadosAnticiposPrestamos'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaInicioFinMes();
    this.categoriaSeleccionada = null;
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.categoriaSeleccionada = null;
    this.codigoEmpleado = null;
    this.validarEmpleado();
    this.listarCategorias();
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.parametrosListado = null;
    this.filasService.actualizarFilas("0", "0");
  }

  obtenerFechaInicioFinMes() {
    this.sistemaService.getFechaInicioFinMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.fechaDesde = data[0];//Fecha inicio en la posicion 0
        this.fechaHasta = data[1];//Fecha fin esta en la posicion 1
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  listarCategorias() {
    this.limpiarResultado();
    this.listaCategorias = [];
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
    }
    this.categoriaService.listarCategorias(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarCategorias(data) {
    this.cargando = false;
    this.listaCategorias = data;
  }

  validarEmpleado() {
    if (this.codigoEmpleado !== this.trabajador.rhEmpleadoPK.empId) {
      this.codigoEmpleado = null;
      this.trabajador.empNombres = "";
      this.trabajador.rhEmpleadoPK.empId = "";
      this.limpiarResultado();
    }
  }

  abrirModalTrabajadores(event) {
    if (this.utilService.validarTeclasAgregarFila(event.keyCode)) {
      let fueBuscado = (this.trabajador.rhEmpleadoPK.empId === this.codigoEmpleado && this.trabajador.rhEmpleadoPK.empId && this.codigoEmpleado);
      if (!fueBuscado) {
        this.trabajador.rhEmpleadoPK.empId = this.trabajador.rhEmpleadoPK.empId === '' ? null : this.trabajador.rhEmpleadoPK.empId;
        this.trabajador.rhEmpleadoPK.empId = this.trabajador.rhEmpleadoPK.empId ? this.trabajador.rhEmpleadoPK.empId.toUpperCase() : null;
        if (this.trabajador.rhEmpleadoPK.empId) {
          let parametroBusqueda = {
            empresa: this.empresaSeleccionada.empCodigo,
            buscar: this.trabajador.rhEmpleadoPK.empId,
            estado: true
          };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(EmpleadosListadoComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
          modalRef.componentInstance.parametrosBusqueda = parametroBusqueda;
          modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
          modalRef.componentInstance.isModal = true;
          modalRef.result.then((result) => {
            if (result) {
              this.trabajador = result;
              this.trabajador.empNombres = result ? result.empApellidos + " " + result.empNombres : "";
              this.codigoEmpleado = result ? result.rhEmpleadoPK.empId : null;
              let element: HTMLElement = document.getElementById('trabajador') as HTMLElement;
              element ? element.focus() : null;
              this.filasService.actualizarFilas("0", "0");
              this.generarAtajosTeclado();
            }
          }, () => {
            let element: HTMLElement = document.getElementById('trabajador') as HTMLElement;
            element ? element.focus() : null;
            this.filasService.actualizarFilas("0", "0");
            this.generarAtajosTeclado();
          });
        }
      }
    }
  }

  listarDetallePrestamos(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.parametrosListado = {
          empCodigo: this.empresaSeleccionada.empCodigo,
          fechaDesde: this.fechaDesde,
          fechaHasta: this.fechaHasta,
          empCategoria: this.categoriaSeleccionada ? this.categoriaSeleccionada.catNombre : "",
          empId: this.trabajador.rhEmpleadoPK.empId ? this.trabajador.rhEmpleadoPK.empId : "",
          formaPago: null
        };
        this.mostrarListado = true;
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  /**
   * event contiene la empresa seleccionada, la accion que se envia y otro parametro que se ajuste a la accion
   * @param {*} event
   */
  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
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
