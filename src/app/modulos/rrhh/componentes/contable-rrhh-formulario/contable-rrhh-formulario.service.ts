import { Injectable } from '@angular/core';
import { RhUtilidades } from '../../../../entidades/rrhh/RhUtilidades';
import { RhFunUtilidadesCalcularTO } from '../../../../entidadesTO/rrhh/RhFunUtilidadesCalcularTO';
import { RhComboFormaPagoBeneficioSocialTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoBeneficioSocialTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { RhAnticipo } from '../../../../entidades/rrhh/RhAnticipo';
import { RhComboFormaPagoTO } from '../../../../entidadesTO/rrhh/RhComboFormaPagoTO';
import { RhListaEmpleadoLoteTO } from '../../../../entidadesTO/rrhh/RhListaEmpleadoLoteTO';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { RhBono } from '../../../../entidades/rrhh/RhBono';
import { RhListaBonoConceptoTO } from '../../../../entidadesTO/rrhh/RhListaBonoConceptoTO';
import { RhListaBonosLoteTO } from '../../../../entidadesTO/rrhh/RhListaBonosLoteTO';
import { RhxivSueldoxivSueldoCalcular } from '../../../../entidadesTO/rrhh/RhXivSueldoXivSueldoCalcular';
import { RhXivSueldo } from '../../../../entidades/rrhh/RhXivSueldo';
import { RhXiiiSueldo } from '../../../../entidades/rrhh/RhXiiiSueldo';
import { RhXiiiSueldoXiiiSueldoCalcular } from '../../../../entidadesTO/rrhh/RhXiiiSueldoXiiiSueldoCalcular';
import { RhRol } from '../../../../entidades/rrhh/RhRol';

@Injectable({
  providedIn: 'root'
})
export class ContableRrhhFormularioService {

  constructor(
    private utilService: UtilService
  ) { }

  conversionDeUtilidad(utilidades: Array<RhUtilidades>, formasPago: Array<RhComboFormaPagoBeneficioSocialTO>): Array<RhFunUtilidadesCalcularTO> {
    let funUtilidades: Array<RhFunUtilidadesCalcularTO> = new Array();
    for (let i = 0; i < utilidades.length; i++) {
      let rhUtilidadesCalcularTO: RhFunUtilidadesCalcularTO = new RhFunUtilidadesCalcularTO();
      rhUtilidadesCalcularTO['fpSeleccionada'] = this.seleccionarFormaPagoBS(utilidades[i], formasPago);
      rhUtilidadesCalcularTO.utiApellidos = utilidades[i].rhEmpleado.empApellidos;
      rhUtilidadesCalcularTO.utiCargasFamiliares = utilidades[i].empCargasFamiliares;
      rhUtilidadesCalcularTO.utiCargo = utilidades[i].empCargo;
      rhUtilidadesCalcularTO.utiCategoria = utilidades[i].rhEmpleado.rhCategoria ? utilidades[i].rhEmpleado.rhCategoria.rhCategoriaPK.catNombre : null;
      rhUtilidadesCalcularTO.utiCuenta = utilidades[i].rhEmpleado.empCuentaNumero;
      rhUtilidadesCalcularTO.utiDiasLaborados = utilidades[i].utiDiasLaborados;
      rhUtilidadesCalcularTO.utiFechaIngreso = this.utilService.formatoStringSinZonaHorariaYYYMMDD(utilidades[i].empFechaIngreso);
      rhUtilidadesCalcularTO.utiGenero = utilidades[i].rhEmpleado.empGenero;
      rhUtilidadesCalcularTO.utiId = utilidades[i].rhEmpleado.rhEmpleadoPK.empId;
      rhUtilidadesCalcularTO.utiNombres = utilidades[i].rhEmpleado.empNombres;
      rhUtilidadesCalcularTO.utiSector = utilidades[i].rhEmpleado.prdSector ? utilidades[i].rhEmpleado.prdSector.prdSectorPK.secCodigo : "";
      rhUtilidadesCalcularTO.utiValorCargas = utilidades[i].utiValorCargas;
      rhUtilidadesCalcularTO.utiValorPersonal = utilidades[i].utiValorPersonal;
      rhUtilidadesCalcularTO['valor'] = utilidades[i].utiValorTotal;
      rhUtilidadesCalcularTO['documento'] = utilidades[i].utiDocumento;
      rhUtilidadesCalcularTO['observacion'] = utilidades[i].utiObservaciones;
      rhUtilidadesCalcularTO['errorEnDocumento'] = false;
      rhUtilidadesCalcularTO['documentoRepetido'] = false;
      rhUtilidadesCalcularTO.id = utilidades[i].utiSecuencial;
      rhUtilidadesCalcularTO['desde'] = utilidades[i].utiDesde;
      rhUtilidadesCalcularTO['hasta'] = utilidades[i].utiHasta;
      funUtilidades.push(rhUtilidadesCalcularTO);
    }
    return funUtilidades;
  }

  conversionDeAnticipo(anticipos: Array<RhAnticipo>, formasPago: Array<RhComboFormaPagoTO>): Array<RhListaEmpleadoLoteTO> {
    let funAnticipos: Array<RhListaEmpleadoLoteTO> = new Array();
    for (let i = 0; i < anticipos.length; i++) {
      let rhEmpleadosLoteTO: RhListaEmpleadoLoteTO = new RhListaEmpleadoLoteTO();
      rhEmpleadosLoteTO['fpSeleccionada'] = this.seleccionarFormaPago(anticipos[i], formasPago);
      rhEmpleadosLoteTO.prAfiliado = (anticipos[i].rhEmpleado.empFechaAfiliacionIess != null);
      rhEmpleadosLoteTO.prCargo = anticipos[i].rhEmpleado.empCargo;
      rhEmpleadosLoteTO.prCategoria = anticipos[i].rhEmpleado.rhCategoria.rhCategoriaPK.catNombre;
      rhEmpleadosLoteTO.prEmpresa = anticipos[i].rhEmpleado.rhEmpleadoPK.empEmpresa;
      rhEmpleadosLoteTO.prFechaIngreso = anticipos[i].rhEmpleado.empFechaAfiliacionIess;
      rhEmpleadosLoteTO.prFechaUltimoSueldo = anticipos[i].rhEmpleado.empFechaUltimoSueldo;
      rhEmpleadosLoteTO.prId = anticipos[i].rhEmpleado.rhEmpleadoPK.empId;
      rhEmpleadosLoteTO.prNombres = anticipos[i].rhEmpleado.empApellidos + " " + anticipos[i].rhEmpleado.empNombres;
      rhEmpleadosLoteTO.prSaldoAnterior = anticipos[i].rhEmpleado.empSaldoAnterior;
      rhEmpleadosLoteTO.prSaldoAnticipos = anticipos[i].rhEmpleado.empSaldoAnticipos;
      rhEmpleadosLoteTO.prSaldoBonos = anticipos[i].rhEmpleado.empSaldoBonos;
      rhEmpleadosLoteTO.prSaldoCuotas = anticipos[i].rhEmpleado.empSaldoCuotas;
      rhEmpleadosLoteTO.prSaldoPrestamos = anticipos[i].rhEmpleado.empSaldoPrestamos;
      rhEmpleadosLoteTO.prSector = anticipos[i].rhEmpleado.prdSector.prdSectorPK.secCodigo;
      rhEmpleadosLoteTO.prSueldo = anticipos[i].rhEmpleado.empSueldoIess;
      rhEmpleadosLoteTO.prValor = anticipos[i].antValor;
      rhEmpleadosLoteTO['prIngresos'] = anticipos[i].rhEmpleado.empSaldoBonos + anticipos[i].rhEmpleado.empSueldoIess + anticipos[i].rhEmpleado.empBonoFijo;
      rhEmpleadosLoteTO['pmpBonoFijo'] = anticipos[i].rhEmpleado.empBonoFijo;
      rhEmpleadosLoteTO['documento'] = anticipos[i].antDocumento;
      rhEmpleadosLoteTO['observacion'] = anticipos[i].antObservaciones;
      rhEmpleadosLoteTO['errorEnDocumento'] = false;
      rhEmpleadosLoteTO['documentoRepetido'] = false;
      rhEmpleadosLoteTO.id = anticipos[i].antSecuencial;
      rhEmpleadosLoteTO['auxiliar'] = anticipos[i].antAuxiliar;
      funAnticipos.push(rhEmpleadosLoteTO);
    }
    return funAnticipos;
  }

  conversionDeRol(roles: Array<RhRol>, formasPago: Array<RhComboFormaPagoTO>): Array<RhListaEmpleadoLoteTO> {
    let empleadosLote: Array<RhListaEmpleadoLoteTO> = new Array();
    for (let i = 0; i < roles.length; i++) {
      let rhEmpleadosLoteTO: RhListaEmpleadoLoteTO = this.construirEmpleadosPorLoteAPartirDeUnRol(roles[i], formasPago);
      empleadosLote.push(rhEmpleadosLoteTO);
    }
    return empleadosLote;
  }

  construirEmpleadosPorLoteAPartirDeUnRol(rol: RhRol, formasPago: Array<RhComboFormaPagoTO>): RhListaEmpleadoLoteTO {
    let rhEmpleadosLoteTO: RhListaEmpleadoLoteTO = new RhListaEmpleadoLoteTO();
    rhEmpleadosLoteTO.prAfiliado = (rol.rhEmpleado.empFechaAfiliacionIess != null);
    rhEmpleadosLoteTO.prCargo = rol.rhEmpleado.empCargo;
    rhEmpleadosLoteTO.prCategoria = rol.rhEmpleado.rhCategoria ? rol.rhEmpleado.rhCategoria.rhCategoriaPK.catNombre : null;
    rhEmpleadosLoteTO.prEmpresa = rol.rhEmpleado.rhEmpleadoPK.empEmpresa;
    rhEmpleadosLoteTO.prFechaIngreso = rol.rhEmpleado.empFechaAfiliacionIess;
    rhEmpleadosLoteTO['hasta'] = rol.rolHasta;
    rhEmpleadosLoteTO['desde'] = (rhEmpleadosLoteTO.prFechaIngreso > rol.rolDesde) ? rhEmpleadosLoteTO.prFechaIngreso : rol.rolDesde;
    rhEmpleadosLoteTO.prFechaUltimoSueldo = rol.rhEmpleado.empFechaUltimoSueldo;
    rhEmpleadosLoteTO.prId = rol.rhEmpleado.rhEmpleadoPK.empId;
    rhEmpleadosLoteTO.prNombres = rol.rhEmpleado.empApellidos + " " + rol.rhEmpleado.empNombres;
    rhEmpleadosLoteTO.prSaldoAnterior = rol.rhEmpleado.empSaldoAnterior;
    rhEmpleadosLoteTO.prSaldoAnticipos = rol.rhEmpleado.empSaldoAnticipos;
    rhEmpleadosLoteTO.prSaldoBonos = rol.rhEmpleado.empSaldoBonos;
    rhEmpleadosLoteTO.prSaldoCuotas = rol.rhEmpleado.empSaldoCuotas;
    rhEmpleadosLoteTO.prSaldoPrestamos = rol.rhEmpleado.empSaldoPrestamos;
    rhEmpleadosLoteTO['prestamosH'] = rol.rolPrestamoHipotecario;
    rhEmpleadosLoteTO['prestamosQ'] = rol.rolPrestamoQuirografario;
    rhEmpleadosLoteTO.prSueldo = rol.rhEmpleado.empSueldoIess;
    rhEmpleadosLoteTO['fpSeleccionada'] = this.seleccionarFormaPago(rol, formasPago);
    rhEmpleadosLoteTO['rolDiasExtrasReales'] = rol.rolDiasExtrasReales;
    rhEmpleadosLoteTO['documento'] = rol.rolDocumento;
    rhEmpleadosLoteTO['observacion'] = rol.rolObservaciones;
    rhEmpleadosLoteTO['horas50'] = rol.rolHorasExtras;
    rhEmpleadosLoteTO['horas100'] = rol.rolHorasExtras100;
    rhEmpleadosLoteTO['diasFalta'] = rol.rolDiasFaltasReales;
    rhEmpleadosLoteTO['rolDescuentoPermisoMedico'] = rol.rolDescuentoPermisoMedico;
    rhEmpleadosLoteTO['diasPermiso'] = rol.rolDiasPermisoMedico;
    rhEmpleadosLoteTO['rolLiqFondoReserva'] = rol.rolLiqFondoReserva;
    rhEmpleadosLoteTO['rolLiqXiii'] = rol.rolLiqXiii;
    rhEmpleadosLoteTO['rolLiqXiv'] = rol.rolLiqXiv;
    rhEmpleadosLoteTO['rolLiqVacaciones'] = rol.rolLiqVacaciones;
    rhEmpleadosLoteTO['rolLiqSalarioDigno'] = rol.rolLiqSalarioDigno;
    rhEmpleadosLoteTO['rolLiqBonificacion'] = rol.rolLiqBonificacion;
    rhEmpleadosLoteTO['rolLiqDesahucio'] = rol.rolLiqDesahucio;
    rhEmpleadosLoteTO['rolLiqDesahucioIntempestivo'] = rol.rolLiqDesahucioIntempestivo;
    rhEmpleadosLoteTO['errorEnDocumento'] = false;
    rhEmpleadosLoteTO['documentoRepetido'] = false;
    rhEmpleadosLoteTO.id = rol.rolSecuencial;
    rhEmpleadosLoteTO['rolAuxiliar'] = rol.rolAuxiliar;
    rhEmpleadosLoteTO.prSector = rol.rhEmpleado.prdSector ? rol.rhEmpleado.prdSector.prdSectorPK.secCodigo : null;
    rhEmpleadosLoteTO.prSaldoPrestamos = rol.rhEmpleado.empSaldoPrestamos;
    rhEmpleadosLoteTO['prestamos'] = rol.rolPrestamos;
    rhEmpleadosLoteTO['rolBono'] = rol.rolBonos;
    rhEmpleadosLoteTO['rolAnticipo'] = rol.rolAnticipos;
    rhEmpleadosLoteTO.prSaldoAnterior = rol.rolSaldoAnterior;
    rhEmpleadosLoteTO['contableProvision'] = rol.conContableProvision;
    return rhEmpleadosLoteTO;
  }

  conversionDeBono(bonos: Array<RhBono>, conceptos: Array<RhListaBonoConceptoTO>, piscinas: Array<PrdListaPiscinaTO>): Array<RhListaBonosLoteTO> {
    let listadoBonosLote: Array<RhListaBonosLoteTO> = new Array();
    for (let i = 0; i < bonos.length; i++) {
      let bonoLote: RhListaBonosLoteTO = new RhListaBonosLoteTO();
      bonoLote.rhListaEmpleadoLoteTO.prAfiliado = (bonos[i].rhEmpleado.empFechaAfiliacionIess != null);
      bonoLote.rhListaEmpleadoLoteTO.prCargo = bonos[i].rhEmpleado.empCargo;
      bonoLote.rhListaEmpleadoLoteTO.prCategoria = bonos[i].rhEmpleado.rhCategoria ? bonos[i].rhEmpleado.rhCategoria.rhCategoriaPK.catNombre : null;
      bonoLote.rhListaEmpleadoLoteTO.prEmpresa = bonos[i].rhEmpleado.rhEmpleadoPK.empEmpresa;
      bonoLote.rhListaEmpleadoLoteTO.prFechaIngreso = bonos[i].rhEmpleado.empFechaAfiliacionIess;
      bonoLote.rhListaEmpleadoLoteTO.prFechaUltimoSueldo = bonos[i].rhEmpleado.empFechaUltimoSueldo;
      bonoLote.rhListaEmpleadoLoteTO.prId = bonos[i].rhEmpleado.rhEmpleadoPK.empId;
      bonoLote.rhListaEmpleadoLoteTO.prNombres = bonos[i].rhEmpleado.empApellidos + " " + bonos[i].rhEmpleado.empNombres;
      bonoLote.rhListaEmpleadoLoteTO.prSaldoAnterior = bonos[i].rhEmpleado.empSaldoAnterior;
      bonoLote.rhListaEmpleadoLoteTO.prSaldoAnticipos = bonos[i].rhEmpleado.empSaldoAnticipos;
      bonoLote.rhListaEmpleadoLoteTO.prSaldoBonos = bonos[i].rhEmpleado.empSaldoBonos;
      bonoLote.rhListaEmpleadoLoteTO.prSaldoCuotas = bonos[i].rhEmpleado.empSaldoCuotas;
      bonoLote.rhListaEmpleadoLoteTO.prSaldoPrestamos = bonos[i].rhEmpleado.empSaldoPrestamos;
      bonoLote.rhListaEmpleadoLoteTO.prSector = bonos[i].rhEmpleado.prdSector ? bonos[i].rhEmpleado.prdSector.prdSectorPK.secCodigo : "";
      bonoLote.rhListaEmpleadoLoteTO.prSueldo = bonos[i].rhEmpleado.empSueldoIess;
      bonoLote.rhListaEmpleadoLoteTO.prValor = bonos[i].bonoValor;
      bonoLote.rhListaEmpleadoLoteTO.id = bonos[i].bonoSecuencial;
      bonoLote.concepto = this.seleccionarConcepto(bonos[i], conceptos);
      bonoLote.piscina = this.seleccionarPisicna(bonos[i], piscinas);
      bonoLote.listaPiscinas = piscinas;
      bonoLote.observacion = bonos[i].bonoObservacion;
      bonoLote.deducible = bonos[i].bonoDeducible;
      bonoLote.isConceptoValido = true;
      bonoLote.isValorValido = true;
      bonoLote.bonoSecuencial = bonos[i].bonoSecuencial;
      bonoLote.bonoAuxiliar = bonos[i].bonoAuxiliar;
      listadoBonosLote.push(bonoLote);
    }
    return listadoBonosLote;
  }

  conversionXivSueldo(xivSueldos: Array<RhXivSueldo>, formasPago: Array<RhComboFormaPagoBeneficioSocialTO>, salarioMinimo: number): Array<RhxivSueldoxivSueldoCalcular> {
    let xivSueldoCalcular: Array<RhxivSueldoxivSueldoCalcular> = new Array();
    for (let i = 0; i < xivSueldos.length; i++) {
      let xivSueldo: RhxivSueldoxivSueldoCalcular = new RhxivSueldoxivSueldoCalcular();
      xivSueldo.rhXivSueldo = xivSueldos[i];
      xivSueldo.formaPago = this.seleccionarFormaPagoBS(xivSueldos[i], formasPago);
      xivSueldo.isFormaPagoValido = true;
      xivSueldo.isValorValido = true;
      xivSueldo.documentoRepetido = false;
      xivSueldo.errorEnDocumento = false;
      xivSueldo.diasLaborados = (xivSueldos[i].xivValor * 360) / salarioMinimo;
      xivSueldo.diasLaborados = Math.round(xivSueldo.diasLaborados * 100) / 100;//2 digitos
      xivSueldoCalcular.push(xivSueldo);
    }
    return xivSueldoCalcular;
  }

  conversionXiiiSueldo(xiiiSueldos: Array<RhXiiiSueldo>, formasPago: Array<RhComboFormaPagoBeneficioSocialTO>): Array<RhXiiiSueldoXiiiSueldoCalcular> {
    let xiiiSueldoCalcular: Array<RhXiiiSueldoXiiiSueldoCalcular> = new Array();
    for (let i = 0; i < xiiiSueldos.length; i++) {
      let xiiiSueldo: RhXiiiSueldoXiiiSueldoCalcular = new RhXiiiSueldoXiiiSueldoCalcular();
      xiiiSueldo.rhXiiiSueldo = xiiiSueldos[i];
      xiiiSueldo.ingresosCalculados = xiiiSueldos[i].xiiiBaseImponible;
      xiiiSueldo.formaPago = this.seleccionarFormaPagoBS(xiiiSueldos[i], formasPago);
      xiiiSueldo.isFormaPagoValido = true;
      xiiiSueldo.isValorValido = true;
      xiiiSueldo.documentoRepetido = false;
      xiiiSueldo.errorEnDocumento = false;
      xiiiSueldoCalcular.push(xiiiSueldo);
    }
    return xiiiSueldoCalcular;
  }

  seleccionarFormaPagoBS(entidad, formasPago: Array<RhComboFormaPagoBeneficioSocialTO>): RhComboFormaPagoBeneficioSocialTO {
    if (formasPago && formasPago.length > 0 && entidad.conCuentas) {
      for (let i = 0; i < formasPago.length; i++) {
        if (formasPago[i].ctaCodigo == entidad.conCuentas.conCuentasPK.ctaCodigo) {
          return formasPago[i];
        }
      }
    }
  }

  seleccionarFormaPago(anticipo, formasPago: Array<RhComboFormaPagoTO>): RhComboFormaPagoTO {
    if (formasPago && formasPago.length > 0 && anticipo.conCuentas) {
      for (let i = 0; i < formasPago.length; i++) {
        if (formasPago[i].ctaCodigo == anticipo.conCuentas.conCuentasPK.ctaCodigo) {
          return formasPago[i];
        }
      }
    }
  }

  seleccionarConcepto(bono: RhBono, conceptos: Array<RhListaBonoConceptoTO>): RhListaBonoConceptoTO {
    if (conceptos && conceptos.length > 0) {
      for (let i = 0; i < conceptos.length; i++) {
        if (conceptos[i].bcDetalle.trim() == bono.bonoConcepto.trim()) {
          return conceptos[i];
        }
      }
    }
  }

  seleccionarPisicna(bono: RhBono, piscinas: Array<PrdListaPiscinaTO>): PrdListaPiscinaTO {
    if (piscinas && piscinas.length > 0 && bono.prdPiscina) {
      for (let i = 0; i < piscinas.length; i++) {
        if (piscinas[i].pisNumero == bono.prdPiscina.prdPiscinaPK.pisNumero) {
          return piscinas[i];
        }
      }
    }
  }

}
