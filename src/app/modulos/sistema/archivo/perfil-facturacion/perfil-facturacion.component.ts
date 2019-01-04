import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { Hotkey } from 'angular2-hotkeys/src/hotkey.model';
import { HotkeysService } from 'angular2-hotkeys';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-perfil-facturacion',
  templateUrl: './perfil-facturacion.component.html',
  styleUrls: ['./perfil-facturacion.component.css']
})
export class PerfilFacturacionComponent implements OnInit {

  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any;
  public cargando: boolean = false;
  public activar: boolean = false;
  public accion: string = null;//Bandera
  public listadoResultado: Array<any> = [];
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public busquedaListado: any = null;//Parametros de busqueda
  public vistaListado: boolean = false;
  public dataFormularioPerfil: any = null;
  public deshabilitarOpciones: any = false;
  public operacionListado: any = null;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private api: ApiRequestService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private filasService: FilasResolve
  ) {
    this.constantes = LS; //Hace referncia a los constantes
    this.listaEmpresas = this.route.snapshot.data['perfilFacturacion'];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    }
  }

  ngOnInit() {
    this.cambiarempresaSeleccionada();
    this.iniciarAtajos();
  }

  iniciarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element.click();
      return false;
    }));
  }

  cambiarempresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
  }

  limpiarResultado() {
    this.operacionListado = { objeto: null, accion: LS.LST_LIMPIAR };
    this.busquedaListado = null;
    this.vistaListado = false;
    this.dataFormularioPerfil = null;
    this.filasService.actualizarFilas(0);
  }

  buscarPerfilFacturacion() {
    this.filasService.actualizarFilas(0);
    this.busquedaListado = this.generarObjetoListado();
    this.vistaListado = true;
    this.dataFormularioPerfil = null;
  }

  generarObjetoListado(): any {
    return { empresa: LS.KEY_EMPRESA_SELECT };
  }

  nuevoPerfilFacturacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.dataFormularioPerfil = this.generarObjetoFormulario();
    }
  }

  generarObjetoFormulario(): any {
    return { accion: LS.ACCION_CREAR, cajCajaPK: null };
  }

  cancelar() {
    //this.activar = false;
    this.deshabilitarOpciones = false;
    this.dataFormularioPerfil = null;
    this.vistaListado = true;
  }

  cancelarFormulario() {
    this.cancelar();
    this.operacionListado = { objeto: null, accion: LS.LST_FILAS };
  }

  cambiarActivar(event) {
    event.activar || event.activar === false ? this.activar = event.activar : null;
    event.deshabilitarOpciones || event.deshabilitarOpciones === false ? this.deshabilitarOpciones = event.deshabilitarOpciones : null;
    event.vistaListado || event.vistaListado === false ? this.vistaListado = event.vistaListado : null;
  }

  accionLista(event) {
    this.operacionListado = event;
    this.cancelar();
  }
}
