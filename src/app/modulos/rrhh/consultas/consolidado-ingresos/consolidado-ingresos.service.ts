import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { DecimalPipe } from '@angular/common';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoIngresosService {

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
  ) { }

  verificarPermiso(accion, empresaSeleccionada: PermisosEmpresaMenuTO): boolean {
    let permiso: boolean = false;
    switch (accion) {
      case LS.ACCION_CONSULTAR: {
        permiso = true;
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
    return permiso;
  }

  /**
 * Retorna el listado de piscina
 * @param parametro debe ser tipo {empresa: '', sector:''}
 */
  listarConsolidadoIngresos(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/rrhhWebController/getRhFunFormulario107_2013", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarConsolidadoIngresos(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  exportarConsumosMensuales(parametro, contexto, empresaSelect) {
    this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarReporteConsolidadosDeIngresos", parametro, empresaSelect)
      .then(data => {
        (data) ? this.utilService.descargarArchivoExcel(data._body, "ListaConsolidadoIngresos_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
        contexto.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  generarColumnas(isModal) {
    let columnDefs: Array<object> = [];
    columnDefs = [
      {
        headerName: LS.TAG_TIPO,
        field: 'f107Tipo',
        width: 80,
        minWidth: 80,
        pinned: 'left'
      },
      {
        headerName: LS.TAG_IDENTIFICACION,
        field: 'f107Id',
        width: 150,
        minWidth: 150,
        pinned: 'left'
      },
      {
        headerName: LS.TAG_APELLIDOS,
        field: 'f107Apellidos',
        width: 200,
        minWidth: 200,
        pinned: 'left'
      },
      {
        headerName: LS.TAG_NOMBRES,
        field: 'f107Nombres',
        width: 200,
        minWidth: 200,
        pinned: 'left'
      },
      {
        headerName: LS.TAG_ESTABLECIMIENTO,
        field: 'f107Establecimiento',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_T_RESIDENCIA,
        field: 'f107ResidenciaTipo',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_TIPO_RESIDENCIA,
          text: LS.TAG_T_RESIDENCIA
        }
      },
      {
        headerName: LS.TAG_P_RESIDENCIA,
        field: 'f107ResidenciaPais',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_PAIS_RESIDENCIA,
          text: LS.TAG_P_RESIDENCIA
        }
      },
      {
        headerName: LS.TAG_CONVENIO,
        field: 'f107Convenio',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_T_DISCAPACIDAD,
        field: 'f107DiscapacidadTipo',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_TIPO_DISCAPACIDAD,
          text: LS.TAG_T_DISCAPACIDAD
        }
      },
      {
        headerName: LS.TAG_N_DISCAPACIDAD,
        field: 'f107DiscapacidadIdNumero',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_NUMERO_DISCAPACIDAD,
          text: LS.TAG_N_DISCAPACIDAD
        }
      },
      {
        headerName: LS.TAG_SUELDO,
        field: 'f107Sueldo',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },

      {
        headerName: LS.TAG_BONOS,
        field: 'f107Bonos',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_UTILIDADES,
        field: 'f107Utilidades',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_O_SUELDOS,
        field: 'f107SueldoOtrosEmpleadores',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_OTROS_SUELDOS,
          text: LS.TAG_O_SUELDOS
        },
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_I_ASUMIDO,
        field: 'f107ImpuestoAsumido',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_IMPUESTO_ASUMIDO,
          text: LS.TAG_I_ASUMIDO
        },
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },

      {
        headerName: LS.TAG_XIII_SUELDO,
        field: 'f107XiiiSueldo',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_DECIMO_TERCER_SUELDO,
          text: LS.TAG_XIII_SUELDO
        },
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_XIV_SUELDO,
        field: 'f107XivSueldo',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_DECIMO_CUARTO_SUELDO,
          text: LS.TAG_XIV_SUELDO
        },
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_FONDO_RESERVA,
        field: 'f107FondoReserva',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_SALARIO_DIGNO,
        field: 'f107SalarioDigno',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_DESAHUCIO,
        field: 'f107Desahucio',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_SUBTOTAL,
        field: 'f107Subtotal',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_SALARIO_NETO,
        field: 'f107SalarioNeto',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_IESS,
        field: 'f107Iess',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },

      {
        headerName: LS.TAG_O_IESS,
        field: 'f107IessOtrosEmpleadores',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_OTROS_IESS,
          text: LS.TAG_O_IESS
        },
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_VIVIENDA,
        field: 'f107Vivienda',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_SALUD,
        field: 'f107Salud',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_EDUCACION,
        field: 'f107Educacion',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },

      {
        headerName: LS.TAG_ALIMENTACION,
        field: 'f107Alimentacion',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_VESTUARIO,
        field: 'f107Vestuario',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_R_DISCAPACIDAD,
        field: 'f107RebajaDiscapacitado',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_REBAJA_DISCAPACIDAD,
          text: LS.TAG_R_DISCAPACIDAD
        },
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_R_III_EDAD,
        field: 'f107RebajaTerceraEdad',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_REBAJA_TERCERA_EDAD,
          text: LS.TAG_R_III_EDAD
        },
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },

      {
        headerName: LS.TAG_BASE_IMPONIBLE,
        field: 'f107BaseImponible',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_IMP_CAUSADO,
        field: 'f107ImpuestoCausado',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_IMPUESTO_CAUSADO,
          text: LS.TAG_IMP_CAUSADO
        },
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_O_IMP_ASUMIDO,
        field: 'f107ImpuestoAsumidoOtrosEmpleadores',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_OTROS_IMPUESTO_ASUMIDO,
          text: LS.TAG_O_IMP_ASUMIDO
        },
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_IMP_ASUMIDO,
        field: 'f107ImpuestoAsumido',
        width: 100,
        minWidth: 100,
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: '',
          tooltip: LS.TAG_IMPUESTO_ASUMIDO,
          text: LS.TAG_IMP_ASUMIDO
        },
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },

      {
        headerName: LS.TAG_VALOR_RETENIDO,
        field: 'f107ValorRetenido',
        width: 100,
        minWidth: 100,
        cellClass: 'text-right',
        valueFormatter: (params) => {
          return new DecimalPipe('en-US').transform(params.value, '1.2-2');
        }
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',
        field: '',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        cellRendererParams: (params) => {
          if (params.data.f107Id !== null && params.data.f107Id.length < 13 && !params.data.f107EmpleadoInactivo) {
            return {
              icono: LS.ICON_BUSCAR,
              tooltip: LS.ACCION_VER_ROL_PAGO,
              accion: LS.ACCION_CONSULTAR
            };
          } else {
            return {
              icono: null,
              tooltip: null,
              accion: null
            };
          }
        },
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      }
    ];

    return columnDefs;
  }
}
