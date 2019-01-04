import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { InvProductoCategoriaTO } from '../../../../entidadesTO/inventario/InvProductoCategoriaTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoCategoriaService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private auth: AuthService
  ) { }

  /**
 * Retorna el listado de categorias por producto
 * @param parametro debe ser tipo {empresa: ''}
 */
  listarInvProductoCategoriaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/getInvProductoCategoriaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarInvProductoCategoriaTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarInvProductoCategoriaTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  listarInvProductoSubCategoria(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/listarSubcategoriasProducto", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarSubCategoriaTO(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarSubCategoriaTO([]);
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  guardarInvProductoSubCategoria(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/insertarInvSubCategoriaProducto", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeGuardarSubCategoria(respuesta.extraInfo);
          this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  modificarInvProductoSubCategoria(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/modificarInvSubCategoriaProducto", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeModificarSubCategoria(respuesta.extraInfo);
          this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  eliminarInvProductoSubCategoria(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/inventarioWebController/eliminarInvSubCategoriaProducto", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeEliminarSubCategoria(respuesta.extraInfo);
          this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  formatearInvProductoTipoTO(invProductoCategoriaTO: InvProductoCategoriaTO, contexto): InvProductoCategoriaTO {
    let invProductoCategoriaTOCopia = new InvProductoCategoriaTO(invProductoCategoriaTO);
    invProductoCategoriaTOCopia.catEmpresa = contexto.empresaSeleccionada.empCodigo;
    invProductoCategoriaTOCopia.catActiva = true;
    invProductoCategoriaTOCopia.usrEmpresa = contexto.empresaSeleccionada.empCodigo;
    if (invProductoCategoriaTOCopia.ctaCodigo === "") {
      invProductoCategoriaTOCopia.ctaCodigo = null;
      invProductoCategoriaTOCopia.ctaEmpresa = null;
    }
    if (contexto.accion === LS.ACCION_CREAR) {
      invProductoCategoriaTOCopia.usrCodigo = this.auth.getCodigoUser();
      invProductoCategoriaTOCopia.usrFechaInserta = null;
    }
    return invProductoCategoriaTOCopia;
  }

  generarColumnasProductoCategoria(isPedidos: string): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_CODIGO,
        field: 'catCodigo',
        width: 100,
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'catDetalle',
        width: 250,
      }
    );
    if (!isPedidos) {
      columnas.push(
        {
          headerName: LS.TAG_PRECIO_FIJO,
          field: 'catPrecioFijo',
          width: 100,
          cellRenderer: 'inputEstado',
          cellClass: 'text-sm-center'
        });
    }
    columnas.push(this.utilService.getColumnaOpciones());
    return columnas;
  }

  generarColumnasProductoSubCategoria(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_CODIGO,
        field: 'invProductoSubcategoriaPK.scatCodigo',
        width: 100,
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'scatDetalle',
        width: 250,
      }
    );
    columnas.push(this.utilService.getColumnaOpciones());
    return columnas;
  }
}
