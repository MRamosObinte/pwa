import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { CajCajaTO } from '../../../../entidadesTO/caja/CajCajaTO';
import { AuthService } from '../../../../serviciosgenerales/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilFacturacionService {

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    public utilService: UtilService,
    public authService: AuthService
  ) { }

  listarCajCajaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/cajaWebController/getListadoCajCajaTO", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO && respuesta.extraInfo) {
          contexto.despuesDeGetListadoCajCajaTO(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }


  listarUsuariosResponsables(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/cajaWebController/getListaUsuariosDisponiblesCaja", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.estadoOperacion === LS.KEY_EXITO && respuesta.extraInfo) {
          contexto.despuesDeListarUsuariosResponsables(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  formatearCajCajaTO(cajCajaTO: CajCajaTO, contexto): CajCajaTO {
    let cajCajaTOCopia = Object.assign({}, cajCajaTO);
    if (contexto.accion === LS.ACCION_CREAR) {
      let codUsuario = this.authService.getCodigoUser();
      cajCajaTOCopia.cajaEmpresa = contexto.empresaSeleccionada.empCodigo;
      cajCajaTOCopia.cajaUsuarioResponsable = contexto.usuarioSeleccionado.usrCodigo;
      cajCajaTOCopia.cajaUsuarioNombre = contexto.usuarioSeleccionado.usrNombre + ' ' + contexto.usuarioSeleccionado.usrApellido;
      cajCajaTOCopia.usrEmpresa = codUsuario;
      cajCajaTOCopia.usrCodigo = codUsuario;
    }
    cajCajaTOCopia.permisoMotivoPermitido = contexto.motivoVentaSeleccionado ? contexto.motivoVentaSeleccionado.vmCodigo : null;
    cajCajaTOCopia.permisoDocumentoPermitido = contexto.tipoComprobanteSeleccionado ? contexto.tipoComprobanteSeleccionado.tcCodigo : null;
    cajCajaTOCopia.permisoBodegaPermitida = contexto.bodegaSeleccionada ? contexto.bodegaSeleccionada.bodCodigo : null;
    cajCajaTOCopia.permisoClientePrecioPermitido = contexto.precioVentaSeleccionada ? contexto.precioVentaSeleccionada.value : null;
    cajCajaTOCopia.permisoFormaPagoPermitida = contexto.formaCobroSeleccionado ? contexto.formaCobroSeleccionado.ctaCodigo : null;
    return cajCajaTOCopia;
  }


  generarColumnasCaja(): Array<any> {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'cajaUsuarioResponsable',
        width: 150,
      },
      {
        headerName: LS.TAG_NOMBRE,
        field: 'cajaUsuarioNombre',
        width: 350,
      },
      {
        headerName: LS.TAG_SEC_FACTURAS,
        field: 'permisoSecuencialFacturas',
        width: 160,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_SECUENCIAL_FACTURAS,
          text: LS.TAG_SEC_FACTURAS,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_SEC_NOTAS_CREDITO,
        field: 'permisoSecuencialNotasCredito',
        width: 160,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_SECUENCIAL_NOTAS_CREDITO,
          text: LS.TAG_SEC_NOTAS_CREDITO,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_SEC_NOTAS_DEBITO,
        field: 'permisoSecuencialNotasDebito',
        width: 160,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_SECUENCIAL_NOTAS_DEBITO,
          text: LS.TAG_SEC_NOTAS_DEBITO,
          enableSorting: true
        }
      },
      {
        headerName: LS.TAG_SEC_RETENCIONES,
        field: 'permisoSecuencialRetenciones',
        width: 160,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_SECUENCIAL_RETENCIONES,
          text: LS.TAG_SEC_RETENCIONES,
          enableSorting: true
        }
      },
      this.utilService.getColumnaOpciones()
    ];
  }
}
