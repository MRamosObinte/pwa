import { Component, OnInit, Input } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { RhComboCategoriaTO } from '../../../../entidadesTO/rrhh/RhComboCategoriaTO';
import { RhComboFormaPagoTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoTO';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import { EmpleadosListadoComponent } from '../../componentes/empleados-listado/empleados-listado.component';
import { CategoriaService } from '../../archivo/categoria/categoria.service';
import { FormaPagoService } from '../../archivo/forma-pago/forma-pago.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalle-anticipos',
  templateUrl: './detalle-anticipos.component.html',
  styleUrls: ['./detalle-anticipos.component.css']
})
export class DetalleAnticiposComponent implements OnInit {

  @Input() isModal: boolean;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public accion: string = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public estadoformulario: boolean = false;
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
  public listaFormaPago: Array<RhComboFormaPagoTO> = new Array();
  public formaPagoSeleccionado: RhComboFormaPagoTO = new RhComboFormaPagoTO();
  public trabajador: RhEmpleado = new RhEmpleado();
  public filaSeleccionada: any;
  public codigoEmpleado: string = null;

  constructor(
    private route: ActivatedRoute,
    private utilService: UtilService,
    private categoriaService: CategoriaService,
    private formaPagoService: FormaPagoService,
    private sistemaService: AppSistemaService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private atajoService: HotkeysService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['anticipoDetalle'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    this.obtenerFechaInicioFinMes();
    this.categoriaSeleccionada = new RhComboCategoriaTO();
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.codigoEmpleado = null;
    this.categoriaSeleccionada = null;
    this.formaPagoSeleccionado = null;
    this.validarEmpleado();
    this.listarCategorias();
    this.listarFormasPago();
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.parametrosListado = null;
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
    this.cargando = true;
    this.limpiarResultado();
    this.listaCategorias = [];
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
    }
    this.categoriaService.listarComboRhCategoriaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarComboRhCategoriaTO(data) {
    this.cargando = false;
    this.listaCategorias = data;
  }

  listarFormasPago() {
    this.limpiarResultado();
    this.listaFormaPago = [];
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
    }
    this.formaPagoService.listarComboRhFormaPagoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDelistarComboRhFormaPagoTO(data) {
    this.cargando = false;
    this.listaFormaPago = data;
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
              this.generarAtajosTeclado();
            }
          }, () => {
            let element: HTMLElement = document.getElementById('trabajador') as HTMLElement;
            element ? element.focus() : null;
            this.generarAtajosTeclado();
          });
        }
      }
    }
  }

  listarDetalleAnticipos(parametro, form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.parametrosListado = {
          empCodigo: this.empresaSeleccionada.empCodigo,
          fechaDesde: this.fechaDesde,
          fechaHasta: this.fechaHasta,
          empCategoria: this.categoriaSeleccionada ? this.categoriaSeleccionada.catNombre : null,
          empId: this.trabajador.rhEmpleadoPK.empId ? this.trabajador.rhEmpleadoPK.empId : null,
          formaPago: this.formaPagoSeleccionado ? this.formaPagoSeleccionado.ctaCodigo : null,
          parametro: parametro
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
