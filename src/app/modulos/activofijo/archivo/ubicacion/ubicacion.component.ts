import { Component, OnInit, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { AfUbicacionesTO } from '../../../../entidadesTO/activoFijo/AfUbicacionesTO';
import { MenuItem } from '../../../../../../node_modules/primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { UbicacionService } from './ubicacion.service';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from '../../../../../../node_modules/angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { NgForm } from '../../../../../../node_modules/@angular/forms';
import { AuthService } from '../../../../serviciosgenerales/auth.service';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.css']
})
export class UbicacionComponent implements OnInit {
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public isSeleccionarPrimeraFila: boolean = true;
  public accion: string = null;
  public frmTitulo: string = LS.TITULO_FILTROS;
  public classTitulo: string = LS.ICON_FILTRAR;
  public filtroGlobal: string = "";
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listadoResultado: Array<AfUbicacionesTO> = [];
  public listadoFiltrado: Array<AfUbicacionesTO> = [];
  public opciones: MenuItem[];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public objetoSeleccionado: AfUbicacionesTO = new AfUbicacionesTO();
  public afUbicacionesTO: AfUbicacionesTO = new AfUbicacionesTO();
  public indexTable: number = 0;
  public columnas: Array<object> = [];
  public columnasSeleccionadas: Array<object> = [];
  public filasTiempo: FilasTiempo = new FilasTiempo();

  constructor(
    private ubicacionService: UbicacionService,
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private auth: AuthService,
    private archivoService: ArchivoService
  ) { }

  ngOnInit() {
    this.constantes = LS; //Hace referncia a los constantes
    this.listaEmpresas = this.route.snapshot.data['ubicacionActivoFijo'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo : null;
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.inicializarAtajos();
    this.inicializarTabla();
  }

  operacionesUbicacion(opcion) {
    switch (opcion) {
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.afUbicacionesTO = new AfUbicacionesTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.activar = false;
          this.frmTitulo = LS.TITULO_FILTROS;
          this.classTitulo = LS.ICON_FILTRAR;
          this.eliminarUbicacion();
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.afUbicacionesTO = new AfUbicacionesTO();
          this.accion = LS.ACCION_CREAR;
          this.activar = false;
          this.frmTitulo = LS.TITULO_FORM_NUEVO_UBICACION;
          this.classTitulo = LS.ICON_FILTRO_NUEVO;
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.afUbicacionesTO = new AfUbicacionesTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_EDITAR;
          this.activar = false;
          this.frmTitulo = LS.TITULO_FORM_EDITAR_UBICACION;
          this.classTitulo = LS.ICON_FILTRO_EDITAR;
        }
        break;
      }
    }
  }

  insertarUbicacion(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (formularioTocado && form && form.valid) {
        let ubicacionCopia = JSON.parse(JSON.stringify(this.afUbicacionesTO));
        this.setearValoresAObjetoAfUbicacionesTO(ubicacionCopia);
        this.api.post("todocompuWS/activosFijosWebController/insertarAfUbicacionesTO", { afUbicacionesTO: ubicacionCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              this.resetearFormulario();
              this.refrescarTabla(ubicacionCopia, 'I');
              this.toastr.success(respuesta.operacionMensaje, 'Aviso');
            } else {
              this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
            }
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  actualizarUbicacion(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let ubicacionCopia = JSON.parse(JSON.stringify(this.afUbicacionesTO));
        this.setearValoresAObjetoAfUbicacionesTO(ubicacionCopia);
        this.api.post("todocompuWS/activosFijosWebController/modificarAfUbicacionesTO", { afUbicacionesTO: ubicacionCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.refrescarTabla(ubicacionCopia, 'U');
              this.toastr.success(respuesta.operacionMensaje, 'Aviso');
              this.resetearFormulario();
            } else {
              this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  eliminarUbicacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { afUbicacionesTO: this.afUbicacionesTO };
          this.api.post("todocompuWS/activosFijosWebController/eliminarAfUbicacionesTO", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                this.refrescarTabla(this.afUbicacionesTO, 'D');
              } else {
                this.toastr.warning(respuesta.operacionMensaje);
              }
              this.resetearFormulario();
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.resetearFormulario();
        }
      });
    }
  }

  imprimirUbicaciones() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listadoAfUbicacionesTO: this.listadoResultado };
      this.archivoService.postPDF("todocompuWS/activosFijosWebController/generarReporteAfUbicacionesTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoPDF('ListadoUbicaciones' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarUbicaciones() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listadoAfUbicacionesTO: this.listadoResultado };
      this.archivoService.postExcel("todocompuWS/activosFijosWebController/exportarReporteAfUbicacionesTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, 'ListadoUbicaciones_');
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  listarUbicaciones() {
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    this.ubicacionService.listarAfUbicacionesTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAfUbicacionesTO(data) {
    this.listadoResultado = data;
    this.listadoFiltrado = this.listadoResultado.slice();
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.seleccionarPrimeraFila();
    this.actualizarFilas();
  }

  setearValoresAObjetoAfUbicacionesTO(objeto: AfUbicacionesTO) {
    objeto.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.ubiEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.usrCodigo = this.auth.getCodigoUser();
  }

  resetearFormulario() {
    this.accion = null;
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.afUbicacionesTO = new AfUbicacionesTO();
    this.actualizarFilas()
  }

  refrescarTabla(afUbicacionesTO: AfUbicacionesTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          listaTemporal.unshift(afUbicacionesTO);
          this.listadoResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.ubiCodigo === afUbicacionesTO.ubiCodigo);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = afUbicacionesTO;
        this.listadoResultado = listaTemporal;
        this.objetoSeleccionado = this.listadoResultado[indexTemp];
        this.indexTable = indexTemp;
        this.isSeleccionarPrimeraFila = false;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoResultado.findIndex(item => item.ubiCodigo === afUbicacionesTO.ubiCodigo);
        this.listadoResultado = this.listadoResultado.filter((val, i) => i != indexTemp);
        this.indexTable = indexTemp;
        this.isSeleccionarPrimeraFila = false;
        break;
      }
    }
  }

  generarOpciones() {
    this.indexTable = this.listadoFiltrado.indexOf(this.objetoSeleccionado);
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesUbicacion(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesUbicacion(LS.ACCION_ELIMINAR) : null },
    ];
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (event: KeyboardEvent): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarUbicacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarUbicacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirUbicacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarUbicacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoUbicacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (this.listadoResultado.length > 0) {
        this.operacionesUbicacion(LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (this.listadoResultado.length > 0) {
        this.operacionesUbicacion(LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarUbicacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarUbicacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  inicializarTabla() {
    this.columnas = [
      { field: 'ubiCodigo', header: LS.TAG_CODIGO, width: '20%' },
      { field: 'ubiDescripcion', header: LS.TAG_DETALLE, width: '70%' },
    ];
    this.columnasSeleccionadas = this.columnas;
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.listadoFiltrado = [];
    this.listadoResultado = [];
    this.accion = null;
    this.activar = false;
    this.objetoSeleccionado = new AfUbicacionesTO();
    this.actualizarFilas();
  }

  onFilterTabla(event) {
    this.listadoFiltrado = event.filteredValue.slice();
    this.isSeleccionarPrimeraFila ? this.seleccionarPrimeraFila() : null;
    this.isSeleccionarPrimeraFila = true;
    this.actualizarFilas();
  }

  verificarFiltros(event, dt, tipo) {
    switch (tipo) {
      case 'TECLAS': {
        if (this.utilService.validarKeyBuscar(event.keyCode)) {
          this.filtrarGlobalmente(dt);
        }
        break;
      }
      case 'CLICK': {
        this.filtrarGlobalmente(dt);
        break;
      }
      case 'BLUR': {
        if (!this.filtroGlobal) {
          this.filtrarGlobalmente(dt);
        }
        break;
      }
    }
  }
  
  seleccionarPrimeraFila() {
    if (this.listadoFiltrado.length > 0) {
      this.objetoSeleccionado = this.listadoFiltrado[0];
      this.indexTable = 0;
    }
  }

  filtrarGlobalmente(dt, filtrar?) {
    if (filtrar && this.filtroGlobal !== "") {
      return;
    }
    dt.filterGlobal(this.filtroGlobal.toUpperCase(), 'contains');
  }

  actualizarFilas() {
    this.filasService.actualizarFilas(this.listadoFiltrado.length, this.filasTiempo.getTiempo());
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }
}
