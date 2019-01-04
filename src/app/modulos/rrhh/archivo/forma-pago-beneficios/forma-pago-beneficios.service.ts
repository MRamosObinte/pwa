import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { LS } from '../../../../constantes/app-constants';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoBeneficiosService {

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
      let element = document.getElementById('btnBuscarFormaPagoBen');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element = document.getElementById('btnNuevoFormaPagoBen');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element = document.getElementById('btnimprimirFormasPagoBeneficio');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element = document.getElementById('btnexportarFormasPagoBeneficio');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element = document.getElementById('btnGuardarFormaPagoBeneficio');
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element = document.getElementById('btnCancelarFormaPagoBeneficio');
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

  // el extraInfo retorna List<RhListaFormaPagoBeneficioSocialTO>
  listarFormasPagoBeneficios(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getListaFormaPagoBeneficioSocialTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarFormasPagoBeneficios(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  listarComboFormaPagoBeneficioSocial(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getComboFormaPagoBeneficioSocial", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarComboFormaPagoBeneficioSocial(data.extraInfo);
        } else {
          contexto.despuesDeListarComboFormaPagoBeneficioSocial([]);
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un mensaje
  accionFormasPagoBeneficios(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/accionRhFormaPagoBeneficioSocial", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeAccionFormasPagoBeneficios(data);
        } else {
          contexto.despuesDeAccionFormasPagoBeneficios(null);
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }

  // el extraInfo retorna un objeto 
  guardarFormasPagoBeneficios(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/insertarRhFormaPagoBeneficioSocial", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeGuardarFormasPagoBeneficios(data);
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
        headerName: LS.TAG_CUENTA,
        field: 'ctaCodigo',
        width: 120,
        minWidth: 120
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'fpDetalle',
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_CODIGO_MAGISTERIAL,
        field: 'fpCodigoMinisterial',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_SECTOR,
        field: 'secCodigo',
        width: 80,
        minWidth: 80
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'fpInactivo',
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
