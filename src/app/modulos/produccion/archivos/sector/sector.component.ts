import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { SectorService } from './sector.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css']
})
export class SectorComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public busqueda: string = null;
  public parametro: any = {};
  public parametrosFormulario: any = {};
  public constantes: any;
  public cargando: boolean = false;
  public vistaFormulario: boolean = false;
  public vistaListado: boolean = false;
  public activar: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private sectorService: SectorService,
    private utilService: UtilService,
    private filasService: FilasResolve,
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['sector'];
    this.constantes = LS;
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      this.listaEmpresas ? this.cambiarEmpresaSelect() : null;
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    }
    this.definirAtajosDeTeclado();
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.vistaFormulario = false;
    this.vistaListado = false;
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      this.activar = !this.activar;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      !this.vistaFormulario ? this.listarSectores(false) : null
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      this.nuevoSector();
      return false;
    }))
  }

  listarSectores(estado) {
    this.parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      activo: estado,
      mostrarInactivo: estado,
      debeBuscar: true,
    };
    this.vistaListado = true;
    this.vistaFormulario = false;
  }

  nuevoSector() {
    this.vistaFormulario = true;
    this.vistaListado = false;
    this.parametrosFormulario = {
      accion: LS.ACCION_NUEVO,
      sectorSeleccionado: new PrdListaSectorTO(),
    };
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.sectorService.verificarPermiso(accion, this, mostraMensaje);
  }

  limpiarResultado() {
    this.parametro = null;
    this.parametrosFormulario = null;
    this.vistaListado = false;
    this.vistaFormulario = false;
    this.filasService.actualizarFilas(0, 0);
  }

  cancelar(event) {
    if (event) {
      if (this.parametro && this.parametro.mostrarInactivo != undefined) {
        this.listarSectores(this.parametro.mostrarInactivo);
      } else {
        this.limpiarResultado();
      }
      this.definirAtajosDeTeclado();
    }
  }

  accionLista(event) {
    //En que lugar de la lista debe insertar,
    switch (event.accion) {
      case LS.ACCION_NUEVO:
        this.nuevoSector();
        break;
      case LS.ACCION_EDITAR:
      case LS.ACCION_CONSULTAR:
        this.mostrarFormulario(event);
        break;
    }
  }

  mostrarFormulario(event) {
    this.vistaFormulario = true;
    this.vistaListado = false;
    this.parametrosFormulario = {
      accion: event.accion,
      sectorSeleccionado: event.sectorSeleccionado
    };
  }
}
