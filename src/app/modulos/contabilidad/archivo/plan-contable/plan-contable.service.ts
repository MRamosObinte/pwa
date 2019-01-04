import { Injectable } from '@angular/core';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { ConEstructuraTO } from '../../../../entidadesTO/contabilidad/ConEstructuraTO';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Injectable({
  providedIn: 'root'
})
export class PlanContableService {

  public resultado: any = [];
  conEstructuraTO: Array<ConEstructuraTO> = new Array();
  listConCuentasTO: Array<ConCuentasTO> = [];

  constructor(
    public api: ApiRequestService,
    public toastr: ToastrService,
    private utilService: UtilService
  ) { }

  listarPlanContable(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/getConCuentas", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeListarPlanContable(respuesta.extraInfo);
        } else {
          contexto.despuesDeListarPlanContable([]);
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  insertarPlanContable(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/insertarConCuenta", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.operacionMensaje) {
          contexto.despuesDeInsertarPlanContable(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  actualizarPlanContable(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/modificarConCuenta", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.operacionMensaje) {
          contexto.despuesDeActualizarPlanContable(respuesta);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
          contexto.cargando = false;
        }
      })
      .catch(err => this.utilService.handleError(err, contexto));
  }

  getTamanioListaConEstructura(parametros, empresa): Promise<any> {
    return this.api.post("todocompuWS/contabilidadWebController/getListaConEstructura", parametros, empresa)
      .then(data => {
        if (data && data.extraInfo && data.extraInfo.length > 0) {
          this.conEstructuraTO = data.extraInfo;
        } else {
          this.conEstructuraTO = [new ConEstructuraTO(),];
          this.toastr.warning(data.operacionMensaje, 'Aviso');
        }
        return this.conEstructuraTO;
      }).catch(err => this.utilService.handleError(err, this));
  }

  getListaBuscarConCuentas(filtroBusquedaConCuentas, empresa): Promise<any> {
    return this.api.post("todocompuWS/contabilidadWebController/getListaBuscarConCuentasTO", filtroBusquedaConCuentas, empresa)
      .then(data => {
        if (data && data.extraInfo) {
          this.listConCuentasTO = data.extraInfo;
        } else {
          this.listConCuentasTO = [];
          this.toastr.warning(data.operacionMensaje, LS.TAG_AVISO);
        }
        return this.listConCuentasTO;
      }).catch(err => this.utilService.handleError(err, this));
  }

  obtenerConCuenta(parametro, contexto, empresaSelect) {
    this.api.post("todocompuWS/contabilidadWebController/obtenerConCuenta", parametro, empresaSelect)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          contexto.despuesDeObtenerConCuenta(respuesta.extraInfo);
        } else {
          this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
          contexto.cargando = false;
        }
      }).catch(err => this.utilService.handleError(err, contexto));
  }

  /**
   * Retorna la cantidad total de cuentas
   * @param {*} parametros {empresa:código de empresa}
   * @param {*} empresa
   * @returns {Promise<any>}
   * @memberof PlanContableService
   */
  getConteoConCuentasTO(parametros, empresa): Promise<any> {
    return this.api.post("todocompuWS/contabilidadWebController/getConteoConCuentasTO", parametros, empresa)
      .then(data => {
        if (data && data.extraInfo >= 0) {
          return data.extraInfo;
        } else {
          this.toastr.error(data.operacionMensaje, LS.TAG_AVISO);
          return 0;
        }
      }).catch(err => this.utilService.handleError(err, this));
  }

  /** Metodo para dar formato capitalizado a la palabra que ingrese, si la longitud del codigo es igual al tamaño que se pasa como parametro entonces recibe un formato caso contrario convertir mayuscula toda la palabra*/
  formatoCapitalizado(palabra, codigo, condicionTamaño): string {
    if (condicionTamaño === codigo.length) {
      let dato = "";
      palabra = palabra.toString().toLocaleLowerCase();
      palabra.toString().split(" ").forEach(function (data) {
        dato = dato + data.substring(0, 1).toString().toUpperCase() + data.substring(1, data.length).toString() + " ";
      });
      palabra = dato;
    } else {
      palabra = palabra.toString().toUpperCase();
    }
    return palabra;
  }

  //OTROS METODOS
  /**Metodo para verificar sí plan de cuenta esta bien ingresado en la cantidad de dígitos */
  verificarPlanCuentaIngresadoCorrectamente(cuentaCodigo, objetoTamaniosEstructura): boolean {
    let isCorrecto = false;
    if (cuentaCodigo.length == objetoTamaniosEstructura.estGrupo1
      || cuentaCodigo.length == objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2
      || cuentaCodigo.length == objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2 + objetoTamaniosEstructura.estGrupo3
      || cuentaCodigo.length == objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2 + objetoTamaniosEstructura.estGrupo3 + objetoTamaniosEstructura.estGrupo4
      || cuentaCodigo.length == objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2 + objetoTamaniosEstructura.estGrupo3 + objetoTamaniosEstructura.estGrupo4 + objetoTamaniosEstructura.estGrupo5
      || cuentaCodigo.length == objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2 + objetoTamaniosEstructura.estGrupo3 + objetoTamaniosEstructura.estGrupo4 + objetoTamaniosEstructura.estGrupo5 + objetoTamaniosEstructura.estGrupo6) {
      isCorrecto = true;
    }
    return isCorrecto;
  }

  /**
    * Metodo para buscar cuenta grupo del plan de cuenta que se va a ingresar, si encuentra la cuenta grupo retorna true, caso contrario false
    */
  buscarCuentaGrupo(listaCuentas, cuentaCodigo, objetoTamaniosEstructura: ConEstructuraTO): boolean {
    let contador = 0, indice = 0, encontro = false;
    var tamanioSubString = this.obtenerCuentaGrupoSubString(cuentaCodigo, objetoTamaniosEstructura);
    if (tamanioSubString === 0) {
      encontro = true;
    }
    tamanioSubString === -1 ? tamanioSubString = 0 : null;
    if (!encontro) {
      for (let i = 0; i < listaCuentas.length; i++) {
        if (listaCuentas[i].cuentaCodigo === cuentaCodigo.substring(0, tamanioSubString)) {
          for (let j = contador; j < listaCuentas.length; j++) {
            indice = listaCuentas[j].cuentaCodigo.lastIndexOf(cuentaCodigo.substring(0, tamanioSubString));
            if (indice >= 0) {
              encontro = true;
              break;
            } else {
              encontro = false;
            }
          }
        }
        contador++;
      }
    }
    return encontro;
  }

  /**
   * Busca al grupo de la cuentaCodigo y verifica que exista, 
   * también verifica que la cuentaCodigo este en un indice superior al del grupo,
   * de este modo al momento de insertar no genere un error
   * @param {Array<ConCuentasTO>} listaCuentas
   * @param {*} cuentaCodigo
   * @param {ConEstructuraTO} objetoTamaniosEstructura
   * @returns {boolean}
   * @memberof PlanContableService
   */
  verificarGrupoCuenta(listaCuentas: Array<ConCuentasTO>, cuentaCodigo, objetoTamaniosEstructura: ConEstructuraTO): boolean {
    var tamanioSubString = this.obtenerCuentaGrupoSubString(cuentaCodigo, objetoTamaniosEstructura);
    if (tamanioSubString === 0) {
      return true;
    }
    let cuentaGrupo = cuentaCodigo.substring(0, tamanioSubString);
    let indexGrupo = listaCuentas.findIndex(item => item.cuentaCodigo === cuentaGrupo);
    if (indexGrupo > -1) {//Si encontro al grupo
      let indexCuenta = listaCuentas.findIndex(item => item.cuentaCodigo === cuentaCodigo);
      return indexCuenta > -1 && indexCuenta > indexGrupo;
    }
    return false;
  }

  obtenerCuentaGrupoSubString(cuentaCodigo: String, objetoTamaniosEstructura: ConEstructuraTO): number {
    let tamanioSubString = -1;
    switch (cuentaCodigo.length) {
      case (objetoTamaniosEstructura.estGrupo1): {
        tamanioSubString = 0;//No tiene grupo antecedente
        break;
      }
      case (objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2): {
        tamanioSubString = objetoTamaniosEstructura.estGrupo1;//El grupo antecedente es del nivel 1
        break;
      }
      case (objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2 + objetoTamaniosEstructura.estGrupo3): {
        tamanioSubString = objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2;
        break;
      }
      case (objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2 + objetoTamaniosEstructura.estGrupo3 + objetoTamaniosEstructura.estGrupo4): {
        tamanioSubString = objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2 + objetoTamaniosEstructura.estGrupo3;
        break;
      }
      case (objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2 + objetoTamaniosEstructura.estGrupo3 + objetoTamaniosEstructura.estGrupo4 + objetoTamaniosEstructura.estGrupo5): {
        tamanioSubString = objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2 + objetoTamaniosEstructura.estGrupo3 + objetoTamaniosEstructura.estGrupo4;
        break;
      }
      case (objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2 + objetoTamaniosEstructura.estGrupo3 + objetoTamaniosEstructura.estGrupo4 + objetoTamaniosEstructura.estGrupo5 + objetoTamaniosEstructura.estGrupo6): {
        tamanioSubString = objetoTamaniosEstructura.estGrupo1 + objetoTamaniosEstructura.estGrupo2 + objetoTamaniosEstructura.estGrupo3 + objetoTamaniosEstructura.estGrupo4 + objetoTamaniosEstructura.estGrupo5;
        break;
      }
    }
    return tamanioSubString;
  }

  generarConCuentaTO(conCuentasTO: ConCuentasTO): ConCuentasTO {
    let conCuentasTOCopia = new ConCuentasTO();
    conCuentasTOCopia.cuentaCodigo = conCuentasTO.cuentaCodigo;
    return conCuentasTOCopia;
  }

  generarColumnasPlanContable(contexto) {
    return [
      {
        headerName: LS.TAG_CODIGO,
        field: 'cuentaCodigo',
        width: 200,
        minWidth: 200,
        cellClass: (params) => {
          if (params.value.length < contexto.tamanioEstructura) {
            return 'tr-negrita ';
          } else { return ''; }
        }
      },
      {
        headerName: LS.TAG_DETALLE,
        field: 'cuentaDetalle',
        width: 600,
        minWidth: 300,
        cellClass: (params) => {
          if (params.data.cuentaCodigo.length < contexto.tamanioEstructura) {
            return 'tr-negrita text-whitespace';
          } else {
            return 'text-whitespace';
          }
        }
      },
      {
        headerName: LS.TAG_ACTIVO,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'cuentaActivo',
        width: 100,
        minWidth: 100,
        cellRendererFramework: InputEstadoComponent,
        cellClass: 'text-center'
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'cell-header-center',//Clase a nivel de th
        field: 'cuentaCodigo',
        width: LS.WIDTH_OPCIONES,
        minWidth: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      },
    ];
  }
}
