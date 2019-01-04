import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { ActivatedRoute } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { SectorService } from '../sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { PrdSobrevivenciaTO } from '../../../../entidadesTO/Produccion/PrdSobrevivenciaTO';
import { SobrevivenciaService } from './sobrevivencia.service';

@Component({
  selector: 'app-sobrevivencia',
  templateUrl: './sobrevivencia.component.html',
  styleUrls: ['./sobrevivencia.component.css']
})
export class SobrevivenciaComponent implements OnInit {

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
  //
  public listaSectores: Array<PrdListaSectorTO> = new Array();
  public sectorSeleccionado: PrdListaSectorTO;
  constructor(
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private sobrevivenciaService: SobrevivenciaService,
    private sectorService: SectorService,
    private filasService: FilasResolve,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['sobrevivencia'];
    this.sectorSeleccionado = new PrdListaSectorTO();
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
    this.listarSectores();
  }

  limpiarPiscinas() {
    this.vistaFormulario = false;
    this.vistaListado = false;
  }

  listarSectores() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      mostrarInactivo: false
    }
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.cargando = false;
    this.listaSectores = data;
    this.sectorSeleccionado = this.listaSectores ? this.listaSectores[0] : undefined;
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      this.activar = !this.activar;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      !this.vistaFormulario ? this.listarSobrevivencia() : null
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      this.nuevaPiscina();
      return false;
    }))
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.sobrevivenciaService.verificarPermiso(accion, this, mostraMensaje);
  }

  listarSobrevivencia() {
    this.parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      sector: this.sectorSeleccionado.secCodigo,
      sectorSeleccionado: this.sectorSeleccionado,
      debeBuscar: true
    };
    this.vistaListado = true;
    this.vistaFormulario = false;
    this.definirAtajosDeTeclado();
  }

  refrescarTabla(estado, sobrevivencia, accion) {
    this.parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      sector: this.sectorSeleccionado.secCodigo,
      sectorSeleccionado: this.sectorSeleccionado,
      mostrarInactivo: estado,
      sobrevivencia: sobrevivencia,
      accion: accion,
      debeBuscar: false
    };
    this.definirAtajosDeTeclado();
    this.vistaListado = true;
    this.vistaFormulario = false;
  }

  nuevaPiscina() {
    this.vistaFormulario = true;
    this.vistaListado = false;
    this.parametrosFormulario = {
      accion: LS.ACCION_NUEVO,
      sobrevivenciaSeleccionada: new PrdSobrevivenciaTO(),
      sectorSeleccionado: this.sectorSeleccionado,
    };
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
      if (this.parametro) {
        // this.listarSobrevivencia(this.parametro.mostrarInactivo);
        switch (event.accion) {
          case LS.ACCION_NUEVO:
          case LS.ACCION_EDITAR:
          case LS.ACCION_REGISTRO_NO_EXITOSO:
            this.refrescarTabla(this.parametro.mostrarInactivo, event.sobrevivencia, event.accion);
            break;
          default:
            this.parametro = {
              empresa: LS.KEY_EMPRESA_SELECT,
              sector: this.sectorSeleccionado.secCodigo,
              sectorSeleccionado: this.sectorSeleccionado,
              mostrarInactivo: true,
              accion: LS.ACCION_LISTAR,
              debeBuscar: false
            };
            this.vistaListado = true;
            this.vistaFormulario = false;
            this.definirAtajosDeTeclado();
            break;
        }
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
        this.nuevaPiscina();
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
      sobrevivenciaSeleccionada: event.sobrevivenciaSeleccionada,
      sectorSeleccionado: this.sectorSeleccionado
    };
  }
}
