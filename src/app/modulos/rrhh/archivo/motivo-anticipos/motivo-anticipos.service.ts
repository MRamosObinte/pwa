import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

@Injectable({
  providedIn: 'root'
})
export class MotivoAnticiposService {

  constructor(
    private api: ApiRequestService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private atajoService: HotkeysService
  ) { }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element = document.getElementById('btnActivarListado');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element = document.getElementById('btnBuscarMotivo');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element = document.getElementById('btnNuevoMotivo');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element = document.getElementById('btnimprimirMotivoAnticipos');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element = document.getElementById('btnexportarMotivoAnticipos');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element = document.getElementById('btnGuardarMotivo');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element = document.getElementById('btnCancelarMotivo');
      element ? element.click() : null;
      return false;
    }))
  }

  /**
   * Verifica los permisos
   * @param {*} accion
   * @param {*} contexto
   * @param {*} [mostrarMensaje]
   * @returns {boolean}
   */
  verificarPermiso(accion, empresaSeleccionada: PermisosEmpresaMenuTO, mostrarMensaje?): boolean {
    let permiso: boolean = false;
    switch (accion) {
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruCrear;
        break;
      }
      case LS.ACCION_CONSULTAR: {
        permiso = true;
        break;
      }
      case LS.ACCION_EDITAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruModificar;
        break;
      }
      case LS.ACCION_ELIMINAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruEliminar;
        break;
      }
      case LS.ACCION_IMPRIMIR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruImprimir;
        break;
      }
      case LS.ACCION_EXPORTAR: {
        permiso = empresaSeleccionada.listaSisPermisoTO.gruExportar;
        break;
      }
    }
    if (mostrarMensaje && !permiso) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.TAG_AVISO);
    }
    return permiso;
  }

  // el extraInfo retorna List<RhMotivoAnticipoTO>
  listarMotivoAnticipos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getListaRhAnticipoMotivo", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarMotivoAnticipos(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un mensaje
  guardarMotivoAnticipos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhAnticipoMotivo", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeGuardarMotivoAnticipos(data);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un mensaje
  modificarMotivoAnticipos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/modificarRhAnticipoMotivo", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeModificarMotivoAnticipos(data);
        } else {
          contexto.despuesDeModificarMotivoAnticipos([]);
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un mensaje
  eliminarMotivoAnticipos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/eliminarRhAnticipoMotivo", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeEliminarMotivoAnticipos(data);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  generarColumnas(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_DETALLE,
        width: 300,
        minWidth: 300,
        valueGetter: (params) => {
          return params.data.rhAnticipoMotivoPK ? params.data.rhAnticipoMotivoPK.motDetalle : "";
        }
      },
      {
        headerName: LS.TAG_TIPO_CONTABLE,
        width: 200,
        minWidth: 200,
        valueGetter: (params) => {
          return params.data.conTipo && params.data.conTipo.conTipoPK ? params.data.conTipo.conTipoPK.tipCodigo : "";
        }
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'motInactivo',
        width: 115,
        minWidth: 115,
        cellRendererFramework: InputEstadoComponent,
        cellClass: 'text-md-center'
      },
      this.utilService.getColumnaOpciones()
    );
    return columnas;
  }

}
