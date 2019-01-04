import { Component, OnInit, Input } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import * as moment from 'moment';
import { RhComboCategoriaTO } from '../../../../entidadesTO/rrhh/RhComboCategoriaTO';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { CategoriaService } from '../../archivo/categoria/categoria.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { EmpleadosListadoComponent } from '../../componentes/empleados-listado/empleados-listado.component';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-bonos',
  templateUrl: './detalle-bonos.component.html',
  styleUrls: ['./detalle-bonos.component.css']
})
export class DetalleBonosComponent implements OnInit {

  @Input() isModal: boolean;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
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
  public estadoformulario: boolean = false;
  //
  public listaCategorias: Array<RhComboCategoriaTO> = new Array();
  public categoriaSeleccionada: RhComboCategoriaTO;
  public listaDeducible = {};
  public deducibleSeleccionado: string;
  public trabajador: RhEmpleado = new RhEmpleado();
  public codigoEmpleado: string = null;
  public filaSeleccionada: any;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private categoriaService: CategoriaService,
    private modalService: NgbModal,
    private atajoService: HotkeysService,
    private toastr: ToastrService,
    private sistemaService: AppSistemaService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['bonoDetalle'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.listaDeducible = LS.LISTA_DEDUCIBLE;
    this.deducibleSeleccionado = this.listaDeducible[2];
    this.generarAtajosTeclado();
    this.obtenerFechaInicioFinMes();
    this.categoriaSeleccionada = new RhComboCategoriaTO();
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
              this.definirAtajosDeTeclado();
            }
          }, () => {
            let element: HTMLElement = document.getElementById('trabajador') as HTMLElement;
            element ? element.focus() : null;
            this.filasService.actualizarFilas("0", "0");
            this.definirAtajosDeTeclado();
          });
        }
      }
    }
  }

  listarDetallePrestamos(parametro, form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.parametrosListado = {
          empCodigo: this.empresaSeleccionada.empCodigo,
          fechaDesde: this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),
          fechaHasta: this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),
          empCategoria: this.categoriaSeleccionada ? this.categoriaSeleccionada.catNombre : null,
          empId: this.trabajador.rhEmpleadoPK.empId ? this.trabajador.rhEmpleadoPK.empId : null,
          nombreEmpleado: this.trabajador.rhEmpleadoPK.empId ? this.trabajador.empNombres + " " + this.trabajador.empApellidos : LS.TAG_TODOS_MAYUSCULA,
          estadoDeducible: this.deducibleSeleccionado,
          parametro: parametro,
        };
        this.mostrarListado = true;
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
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
