import { Component, OnInit, Input } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public accion: string = null;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public vistaFormulario: boolean = false;
  public es: object = {};
  //
  public parametrosFormulario: any = {};

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['prestamoListadoTrans'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.abrirFormularioPrestamo() : null;
    this.generarAtajos();
  }

  abrirFormularioPrestamo() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.parametrosFormulario = {
      empresaSeleccionada: this.empresaSeleccionada
    }
    this.vistaFormulario = true;
  }

  ejecutarAccion(event) {
    this.generarAtajos();
    switch (event.accion) {
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.activar = false;
        this.vistaFormulario = false;
        break;
    }
  }

  limpiarFormulario() {
    this.parametrosFormulario = null;
    this.vistaFormulario = false;
  }

  cancelar() {
    this.accion = null;
  }

  generarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }
}
