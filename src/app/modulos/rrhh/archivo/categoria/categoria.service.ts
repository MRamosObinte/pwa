import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { RhCategoriaTO } from '../../../../entidadesTO/rrhh/RhCategoriaTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(
    private api: ApiRequestService,
    private utilService: UtilService,
    private toastr: ToastrService
  ) { }

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

  // el extraInfo retorna List<RhCategoriaTO>
  listarCategorias(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getListaRhCategoriaCuentasTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarCategorias(data.extraInfo);
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }


  listarComboRhCategoriaTO(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getComboRhCategoriaTO", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeListarComboRhCategoriaTO(data.extraInfo);
        } else {
          contexto.despuesDeListarComboRhCategoriaTO([]);
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }
      ).catch(err => this.utilService.handleError(err, contexto));
  }
  
  // el extraInfo retorna un mensaje
  accionCategorias(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/accionRhCategoria", parametro, empresaSelect)
      .then(data => {
        if (data && data.extraInfo) {
          contexto.despuesDeAccionCategorias(data);
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
        field: 'catNombre',
        width: 500,
        minWidth: 500
      },
      this.utilService.getColumnaOpciones()
    );
    return columnas;
  }

  volverAOriginal(categoria: RhCategoriaTO, categoriaNombre: RhCategoriaTO): RhCategoriaTO {
    let retorno = new RhCategoriaTO(null);
    retorno.empCodigo = categoria.empCodigo;
    retorno.catNombre = categoria.catNombre;
    retorno.ctaAnticipos = categoria.ctaAnticipos + "-" + categoriaNombre.ctaAnticipos
    retorno.ctaPrestamos = categoria.ctaPrestamos + "-" + categoriaNombre.ctaPrestamos
    retorno.ctaPorPagarBonos = categoria.ctaPorPagarBonos + "-" + categoriaNombre.ctaPorPagarBonos
    retorno.ctaPorPagarSueldo = categoria.ctaPorPagarSueldo + "-" + categoriaNombre.ctaPorPagarSueldo
    retorno.ctaPorPagarImpuestoRenta = categoria.ctaPorPagarImpuestoRenta + "-" + categoriaNombre.ctaPorPagarImpuestoRenta
    retorno.ctaPorPagarUtilidades = categoria.ctaPorPagarUtilidades + "-" + categoriaNombre.ctaPorPagarUtilidades
    retorno.ctaGastoHorasExtras = categoria.ctaGastoHorasExtras + "-" + categoriaNombre.ctaGastoHorasExtras
    retorno.ctaGastoHorasExtras100 = categoria.ctaGastoHorasExtras100 + "-" + categoriaNombre.ctaGastoHorasExtras100
    retorno.ctaGastoBonos = categoria.ctaGastoBonos + "-" + categoriaNombre.ctaGastoBonos
    retorno.ctaGastoBonosNd = categoria.ctaGastoBonosNd + "-" + categoriaNombre.ctaGastoBonosNd
    retorno.ctaGastoBonoFijo = categoria.ctaGastoBonoFijo + "-" + categoriaNombre.ctaGastoBonoFijo
    retorno.ctaGastoBonoFijoNd = categoria.ctaGastoBonoFijoNd + "-" + categoriaNombre.ctaGastoBonoFijoNd
    retorno.ctaGastoOtrosIngresos = categoria.ctaGastoOtrosIngresos + "-" + categoriaNombre.ctaGastoOtrosIngresos
    retorno.ctaGastoOtrosIngresosNd = categoria.ctaGastoOtrosIngresosNd + "-" + categoriaNombre.ctaGastoOtrosIngresosNd
    retorno.ctaPermisoMedico = categoria.ctaPermisoMedico + "-" + categoriaNombre.ctaPermisoMedico
    retorno.ctaGastoSueldos = categoria.ctaGastoSueldos + "-" + categoriaNombre.ctaGastoSueldos
    retorno.ctaPrestamoQuirografario = categoria.ctaPrestamoQuirografario + "-" + categoriaNombre.ctaPrestamoQuirografario
    retorno.ctaAportepersonal = categoria.ctaAportepersonal + "-" + categoriaNombre.ctaAportepersonal
    retorno.ctaAporteExtension = categoria.ctaAporteExtension + "-" + categoriaNombre.ctaAporteExtension
    retorno.ctaPrestamoHipotecario = categoria.ctaPrestamoHipotecario + "-" + categoriaNombre.ctaPrestamoHipotecario
    retorno.ctaAportepatronal = categoria.ctaAportepatronal + "-" + categoriaNombre.ctaAportepatronal
    retorno.ctaIece = categoria.ctaIece + "-" + categoriaNombre.ctaIece
    retorno.ctaSecap = categoria.ctaSecap + "-" + categoriaNombre.ctaSecap
    retorno.ctaXiii = categoria.ctaXiii + "-" + categoriaNombre.ctaXiii
    retorno.ctaXiv = categoria.ctaXiv + "-" + categoriaNombre.ctaXiv
    retorno.ctaFondoreserva = categoria.ctaFondoreserva + "-" + categoriaNombre.ctaFondoreserva
    retorno.ctaVacaciones = categoria.ctaVacaciones + "-" + categoriaNombre.ctaVacaciones
    retorno.ctaDesahucio = categoria.ctaDesahucio + "-" + categoriaNombre.ctaDesahucio
    retorno.ctaGastoAporteindividual = categoria.ctaGastoAporteindividual + "-" + categoriaNombre.ctaGastoAporteindividual
    retorno.ctaGastoAportepatronal = categoria.ctaGastoAportepatronal + "-" + categoriaNombre.ctaGastoAportepatronal
    retorno.ctaGastoIece = categoria.ctaGastoIece + "-" + categoriaNombre.ctaGastoIece
    retorno.ctaGastoSecap = categoria.ctaGastoSecap + "-" + categoriaNombre.ctaGastoSecap
    retorno.ctaGastoXiii = categoria.ctaGastoXiii + "-" + categoriaNombre.ctaGastoXiii
    retorno.ctaGastoXiv = categoria.ctaGastoXiv + "-" + categoriaNombre.ctaGastoXiv
    retorno.ctaGastoFondoreserva = categoria.ctaGastoFondoreserva + "-" + categoriaNombre.ctaGastoFondoreserva
    retorno.ctaGastoVacaciones = categoria.ctaGastoVacaciones + "-" + categoriaNombre.ctaGastoVacaciones
    retorno.ctaGastoSalarioDigno = categoria.ctaGastoSalarioDigno + "-" + categoriaNombre.ctaGastoSalarioDigno
    retorno.ctaGastoDesahucio = categoria.ctaGastoDesahucio + "-" + categoriaNombre.ctaGastoDesahucio
    retorno.ctaGastoDesahucioIntempestivo = categoria.ctaGastoDesahucioIntempestivo + "-" + categoriaNombre.ctaGastoDesahucioIntempestivo
    retorno.ctaGastoBonoLiquidacion = categoria.ctaGastoBonoLiquidacion + "-" + categoriaNombre.ctaGastoBonoLiquidacion
    retorno.tipCodigo = categoria.tipCodigo;
    retorno.usrInsertaCategoria = categoria.usrInsertaCategoria;
    retorno.usrFechaInsertaCategoria = categoria.usrFechaInsertaCategoria;
    return retorno;
  }

}
