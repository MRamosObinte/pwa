import { Component, OnInit, Input, ViewChild, EventEmitter, Output, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { RhCategoriaTO } from '../../../../entidadesTO/rrhh/RhCategoriaTO';
import { ConTipo } from '../../../../entidades/contabilidad/ConTipo';
import { NgForm } from '@angular/forms';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { PlanContableService } from '../../../contabilidad/archivo/plan-contable/plan-contable.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaService } from '../../archivo/categoria/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-categoria-formulario',
  templateUrl: './categoria-formulario.component.html'
})
export class CategoriaFormularioComponent implements OnInit {
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() accion: string;
  @Input() categoria: RhCategoriaTO = new RhCategoriaTO(null);
  @Input() categoriaCopia: RhCategoriaTO = new RhCategoriaTO(null);
  @Input() tiposContables: Array<ConTipo> = new Array();
  @Output() enviarAccion = new EventEmitter();

  public constantes: any = LS;
  public isScreamMd: boolean = true;
  public categoriaNombres: RhCategoriaTO = new RhCategoriaTO(null);
  public tipoSeleccionado: ConTipo = new ConTipo();
  public cargando: boolean = false;
  public tamanioEstructura: number = 0;
  public activarCategoriaForm: boolean = false;

  //formulario validar cancelar
  @ViewChild("frmDatos") frmDatos: NgForm;
  public valoresIniciales: any;

  constructor(
    private utilService: UtilService,
    private modalService: NgbModal,
    private categoriaService: CategoriaService,
    private planContableService: PlanContableService,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.definirAtajosDeTeclado();
    this.obtenerEstructura();
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.accion !== LS.ACCION_CREAR ? this.formatearDatos(this.categoria) : null;
    this.accion === LS.ACCION_CREAR || this.accion === LS.ACCION_EDITAR ? this.extraerValoresIniciales() : null;
    this.tipoSeleccionado = this.tiposContables[0] ? this.tiposContables[0] : null;
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element = document.getElementById("btnActivar");
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element = document.getElementById("btnGuardar");
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element = document.getElementById("btnCancelar");
      element ? element.click() : null;
      return false;
    }))
  }

  formatearDatos(categoria) {
    this.cargando = true;
    this.categoria = new RhCategoriaTO('cuenta', categoria);
    this.categoriaNombres = new RhCategoriaTO('nombre', categoria);
    this.categoriaCopia = JSON.parse(JSON.stringify(this.categoria));
    this.cargando = false;
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmDatos ? this.frmDatos.value : null));
      this.focusInput('catNombre');
    }, 50);
  }

  cancelar() {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_CREAR:
        if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmDatos)) {
          this.categoria = this.categoriaService.volverAOriginal(this.categoria, this.categoriaNombres);
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        } else {
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI_ACEPTAR,
            cancelButtonText: LS.MSJ_NO_CANCELAR
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.categoria = this.categoriaService.volverAOriginal(this.categoria, this.categoriaNombres);
              this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
            }
          });
        }
        break;
      default:
        this.categoria = this.categoriaService.volverAOriginal(this.categoria, this.categoriaNombres);
        this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        break;
    }
  }

  modificar(frmDatos: NgForm) {
    if (this.validarAntesDeEnviar(frmDatos)) {
      if (!this.utilService.puedoCancelar(this.valoresIniciales, frmDatos)) {
        this.cargando = true;
        let parametro = {
          rhCategoriaTO: this.categoria,
          accion: 'M'
        }
        this.categoriaService.accionCategorias(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
        this.categoria = this.categoriaService.volverAOriginal(this.categoria, this.categoriaNombres);
        this.cargando = false;
        this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
      }
    }
  }

  insertar(frmDatos: NgForm) {
    if (this.validarAntesDeEnviar(frmDatos)) {
      this.cargando = true;
      this.categoria.empCodigo = LS.KEY_EMPRESA_SELECT;
      this.categoria.usrInsertaCategoria = this.auth.getCodigoUser();
      let parametro = {
        rhCategoriaTO: this.categoria,
        accion: 'I'
      }
      this.categoriaService.accionCategorias(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  verificarPermiso(mostraMensaje): boolean {
    return this.categoriaService.verificarPermiso(this.accion, this.empresaSeleccionada, mostraMensaje);
  }

  validarAntesDeEnviar(form: NgForm): boolean {
    let validado = true;
    if (!this.verificarPermiso(true)) {
      this.cargando = false;
      return false;
    }
    let formTouched = this.utilService.establecerFormularioTocado(form);
    if (!(formTouched && form && form.valid)) {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    this.cargando = validado;
    return validado;
  }

  despuesDeAccionCategorias(data) {
    this.categoria = this.categoriaService.volverAOriginal(this.categoria, this.categoriaNombres);
    this.toastr.info(data.operacionMensaje, LS.TAG_AVISO);
    switch (this.accion) {
      case LS.ACCION_CREAR:
      case LS.ACCION_EDITAR:
        this.enviarAccion.emit({ objetoSeleccionado: this.categoria, accion: LS.ACCION_CREADO });
        break;
    }
    this.cargando = false;
  }

  abrirModalDeCuentas(event, cuenta, clave, valorSiguiente) {
    let fueBuscado = cuenta && cuenta === this.categoriaCopia[clave];
    if (this.utilService.validarKeyBuscar(event.keyCode) && !fueBuscado) {
      let parametroBusquedaConCuentas = {
        empresa: LS.KEY_EMPRESA_SELECT,
        buscar: cuenta
      };
      event.srcElement.blur();
      event.preventDefault();
      const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', windowClass: 'miSize', backdrop: 'static' });
      modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
      modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
      modalRef.result.then((result) => {
        if (result) {
          this.categoriaCopia[clave] = result.cuentaCodigo ? result.cuentaCodigo.trim() : null;
          this.categoriaNombres[clave] = result.cuentaDetalle ? result.cuentaDetalle.trim() : null;
          this.categoria[clave] = result.cuentaCodigo ? result.cuentaCodigo.trim() : null;
          this.focusInput(valorSiguiente);
        } else {
          this.focusInput(clave);
        }
      }, () => {
        this.focusInput(clave);
      });
    }
  }

  validarCuentas(clave) {
    if (this.categoria[clave] !== this.categoriaCopia[clave]) {
      this.categoria[clave] = "";
      this.categoriaCopia[clave] = "";
      this.categoriaNombres[clave] = "";
    }
  }

  focusInput(clave) {
    let element = document.getElementById(clave);
    element ? element.focus() : null;
  }

  obtenerEstructura() {
    this.cargando = true;
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
        this.cargando = false;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  cambiarActivar() {
    this.activarCategoriaForm = !this.activarCategoriaForm;
    this.enviarAccion.emit({ accion: LS.ACCION_ACTIVAR, estado: this.activarCategoriaForm });
  }

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

}
