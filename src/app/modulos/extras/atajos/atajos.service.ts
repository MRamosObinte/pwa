import { Injectable } from '@angular/core';
import { LS } from '../../../constantes/app-constants';

@Injectable({
  providedIn: 'root'
})
export class AtajosService {

  constructor() { }

  obtenerAtajos(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        "atajo": LS.TAG_GENERALES,
        "comando": "",
        "titulo": true
      },
      {
        "atajo": LS.LABEL_OCULTAR_MENU,
        "comando": LS.ATAJO_OCULTAR_MENU
      },
      {
        "atajo": LS.LABEL_MOSTRAR_OCULTAR_FILTROS,
        "comando": LS.ATAJO_MOSTRAR_OCULTAR_FILTROS
      },
      {
        "atajo": LS.LABEL_CANCELAR,
        "comando": LS.ATAJO_CANCELAR
      },
      {
        "atajo": LS.LABEL_AYUDA,
        "comando": LS.ATAJO_AYUDA
      },
      {
        "atajo": LS.TAG_CONSULTAS,
        "comando": "",
        "titulo": true
      },
      {
        "atajo": LS.LABEL_MENU_CONSULTA,
        "comando": LS.ATAJO_MENU_CONSULTA
      },
      {
        "atajo": LS.LABEL_IMPRIMIR,
        "comando": LS.ATAJO_IMPRIMIR
      },
      {
        "atajo": LS.LABEL_EXPORTAR,
        "comando": LS.ATAJO_EXPORTAR
      },
      {
        "atajo": LS.LABEL_BUSCAR,
        "comando": LS.ATAJO_BUSCAR
      },
      {
        "atajo": LS.LABEL_BUSCAR,
        "comando": LS.ATAJO_CONSULTAR
      },
      {
        "atajo": LS.TAG_ARCHIVO,
        "comando": "",
        "titulo": true
      },
      {
        "atajo": LS.LABEL_MENU_ARCHIVO,
        "comando": LS.ATAJO_MENU_ARCHIVO
      },
      {
        "atajo": LS.LABEL_NUEVO,
        "comando": LS.ATAJO_NUEVO
      },
      {
        "atajo": LS.LABEL_EDITAR,
        "comando": LS.ATAJO_EDITAR
      },
      {
        "atajo": LS.LABEL_GUARDAR,
        "comando": LS.ATAJO_GUARDAR
      },
      {
        "atajo": LS.TAG_TRANSACCIONES,
        "comando": "",
        "titulo": true
      },
      {
        "atajo": LS.LABEL_MENU_TRANSACCIONES,
        "comando": LS.ATAJO_MENU_TRANSACCIONES
      },
      {
        "atajo": LS.LABEL_DISTRIBUIR,
        "comando": LS.ATAJO_DISTRIBUIR
      },
      {
        "atajo": LS.LABEL_ACEPTAR,
        "comando": LS.ATAJO_ACEPTAR
      },
      {
        "atajo": LS.LABEL_ELIMINAR,
        "comando": LS.ATAJO_ELIMINAR
      },
      {
        "atajo": LS.LABEL_MAYORIZAR,
        "comando": LS.ATAJO_MAYORIZAR
      },
      {
        "atajo": LS.LABEL_DESMAYORIZAR,
        "comando": LS.ATAJO_DESMAYORIZAR
      },
      {
        "atajo": LS.LABEL_DESBLOQUEAR,
        "comando": LS.ATAJO_DESBLOQUEAR
      },
      {
        "atajo": LS.LABEL_CONTABILIZAR,
        "comando": LS.ATAJO_CONTABILIZAR
      },
      {
        "atajo": LS.LABEL_ANULAR,
        "comando": LS.ATAJO_ANULAR
      },
      {
        "atajo": LS.LABEL_RESTAURAR,
        "comando": LS.ATAJO_RESTAURAR
      },
      {
        "atajo": LS.LABEL_OPCIONES,
        "comando": LS.ATAJO_OPCIONES
      },
      {
        "atajo": LS.LABEL_REVERSAR,
        "comando": LS.ATAJO_REVERSAR
      },
    );
    return columnas;
  }

}
