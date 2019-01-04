import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { InvBodegaTO } from '../../../../entidadesTO/inventario/InvBodegaTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { NgForm } from '@angular/forms';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { BodegaService } from '../../archivo/bodega/bodega.service';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';

@Component({
  selector: 'app-bodega-formulario',
  templateUrl: './bodega-formulario.component.html',
  styleUrls: ['./bodega-formulario.component.css']
})
export class BodegaFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarCancelar = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();
  @Input() parametros;
  //
  public accion: string = null;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public tituloForm: string = "";
  public constantes: any = LS;
  //
  public invBodegaTO: InvBodegaTO = new InvBodegaTO();
  public invListaBodegaTO: InvListaBodegasTO = new InvListaBodegasTO();
  //
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  //
  @ViewChild("frmBodegaDatos") frmBodegaDatos: NgForm;
  public valoresIniciales: any;
  public bodegaInicial: any;

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private sectorService: SectorService,
    private bodegaService: BodegaService,
    private atajoService: HotkeysService
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.invBodegaTO = { ...this.parametros.invBodegaTO }
    this.generarAtajosTeclado();
    this.operaciones();
    this.extraerValoresIniciales();
    this.extraerValoresIniciales();
    this.generarAtajosTeclado();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmBodegaDatos ? this.frmBodegaDatos.value : null));
      this.bodegaInicial = JSON.parse(JSON.stringify(this.invBodegaTO ? this.invBodegaTO : null));
    }, 50);
  }

  /** Metodo para listar los sectores dependiendo de la empresa*/
  listarSectores() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarSectores()*/
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listarSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
    this.operaciones();
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.tituloForm = LS.TITULO_FORM_NUEVO_BODEGA;
        this.obtenerDatosNuevaBodega();
        break;
      case LS.ACCION_CONSULTAR:
        this.obtenerDatosEditarBodega();
        this.tituloForm = LS.TITULO_FORM_CONSULTAR_BODEGA + ": Código: " + this.invBodegaTO.bodCodigo;
        break;
      case LS.ACCION_EDITAR:
        this.obtenerDatosEditarBodega();
        this.tituloForm = LS.TITULO_FORM_EDITAR_BODEGA + ": Código: " + this.invBodegaTO.bodCodigo;
        break;
    }
  }

  /**
   * Método para inicializar valores para ingresar una nueva bodega con la entidad InvBodegaTO
   *
   * @memberof BodegaFormularioComponent
   */
  obtenerDatosNuevaBodega() {
    this.cargando = true;
    this.invBodegaTO = new InvBodegaTO();
    this.listaSectores = this.parametros.listaSectores;
    this.sectorSeleccionado = this.listaSectores[0];
    this.cargando = false;
  }

  /** Metodo para crear una nueva bodega */
  insertarBodega(form: NgForm) {
    if (this.bodegaService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let bodegaCopia = JSON.parse(JSON.stringify(this.invBodegaTO));
        this.setearValoresAObjetoInvBodegaTO(bodegaCopia);
        let parametros = { invBodegaTO: bodegaCopia }
        this.bodegaService.insertarBodegaTO(parametros, this, bodegaCopia, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarBodega(respuesta, bodegaCopia) {
    this.cargando = false;
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      accion: LS.ACCION_CREAR,
      bodegaCopia: bodegaCopia
    };
    this.enviarAccion.emit(parametro);
  }

  /**
   * Método para inicializar los valores para editar una bodega con la entidad InvListaBodegasTO
   *
   * @memberof BodegaFormularioComponent
   */
  obtenerDatosEditarBodega() {
    this.cargando = true;
    this.invListaBodegaTO = this.parametros.invBodegaTO;
    this.listaSectores = this.parametros.listaSectores;
    this.llenarCombos();
    this.cargando = false;
  }

  /** Metodo para guardar la edición de la bodega seleccionado*/
  actualizarBodega(form: NgForm) {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmBodegaDatos)) {
      this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
      this.enviarCancelar.emit();
    } else {
      if (this.bodegaService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          let bodegaCopia = JSON.parse(JSON.stringify(this.invBodegaTO));
          let listaBodegaABodega = this.convertirInvBodegaToAInvListaBodegasTO(bodegaCopia);
          this.setearValoresAObjetoInvBodegaTO(listaBodegaABodega);
          let parametros = { invBodegaTO: listaBodegaABodega };
          this.bodegaService.modificarBodegaTO(parametros, this, listaBodegaABodega, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    }
  }

  despuesDeModificarBodega(respuesta, bodegaCopia) {
    this.cargando = false;
    this.toastr.success(respuesta, 'Aviso');
    let parametro = {
      accion: LS.ACCION_EDITAR,
      bodegaCopia: bodegaCopia
    };
    this.enviarAccion.emit(parametro);
  }

  /** Setear valores */
  setearValoresAObjetoInvBodegaTO(objeto) {
    objeto.empCodigo = LS.KEY_EMPRESA_SELECT;
    objeto.secEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.detEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.detUsuario = this.auth.getCodigoUser();
    objeto.usrInsertaBodega = this.auth.getCodigoUser();
    objeto.secCodigo = this.sectorSeleccionado.secCodigo;
  }

  llenarCombos() {
    this.sectorSeleccionado = this.bodegaService.seleccionarSector(this.listaSectores, this.invListaBodegaTO.codigoCP);
  }

  /**
   * Convertir el código de codigoCP a secCodigo
   *
   * @param {*} InvListaBodegasTO
   * @returns {InvBodegaTO}
   * @memberof BodegaFormularioComponent
   */
  convertirInvBodegaToAInvListaBodegasTO(InvListaBodegasTO): InvBodegaTO {
    let invListaBodegasTO = new InvBodegaTO(InvListaBodegasTO);
    invListaBodegasTO.secCodigo = InvListaBodegasTO.codigoCP;
    return invListaBodegasTO;
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarBodega') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmBodegaDatos)) {
      this.enviarCancelar.emit();
    } else {
      switch (this.accion) {
        case LS.ACCION_EDITAR:
        case LS.ACCION_CREAR:
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI,
            cancelButtonText: LS.MSJ_NO
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.enviarCancelar.emit();
            }
          });
          break;
        default:
          this.enviarCancelar.emit();
      }
    }
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }
}
