import { SisEmpresa } from "./SisEmpresa";

export class SisEmpresaParametros {

    parEmpresa: string = "";
    parGerente: string = "";
    parGerenteTipoId: string = "";
    parGerenteId: string = "";
    parContador: string = "";
    parContadorRuc: string = "";
    parFinanciero: string = "";
    parFinancieroId: string = "";
    parActividad: string = "";
    parEscogerPrecioPor: string = "";
    parObligadoLlevarContabilidad: boolean = false;
    parResolucionContribuyenteEspecial: string = "";
    parColumnasEstadosFinancieros: number = 0;
    parCodigoDinardap: string = "";
    parWebDocumentosElectronicos: string = "";
    parObligadoEmitirDocumentosElectronicos: boolean = false;
    parObligadoRegistrarLiquidacionPesca: boolean = false;
    empCodigo: SisEmpresa = new SisEmpresa();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.parEmpresa = data.parEmpresa ? data.parEmpresa : this.parEmpresa;
        this.parGerente = data.parGerente ? data.parGerente : this.parGerente;
        this.parGerenteTipoId = data.parGerenteTipoId ? data.parGerenteTipoId : this.parGerenteTipoId;
        this.parGerenteId = data.parGerenteId ? data.parGerenteId : this.parGerenteId;
        this.parContador = data.parContador ? data.parContador : this.parContador;
        this.parContadorRuc = data.parContadorRuc ? data.parContadorRuc : this.parContadorRuc;
        this.parFinanciero = data.parFinanciero ? data.parFinanciero : this.parFinanciero;
        this.parFinancieroId = data.parFinancieroId ? data.parFinancieroId : this.parFinancieroId;
        this.parActividad = data.parActividad ? data.parActividad : this.parActividad;
        this.parEscogerPrecioPor = data.parEscogerPrecioPor ? data.parEscogerPrecioPor : this.parEscogerPrecioPor;
        this.parObligadoLlevarContabilidad = data.parObligadoLlevarContabilidad ? data.parObligadoLlevarContabilidad : this.parObligadoLlevarContabilidad;
        this.parResolucionContribuyenteEspecial = data.parResolucionContribuyenteEspecial ? data.parResolucionContribuyenteEspecial : this.parResolucionContribuyenteEspecial;
        this.parColumnasEstadosFinancieros = data.parColumnasEstadosFinancieros ? data.parColumnasEstadosFinancieros : this.parColumnasEstadosFinancieros;
        this.parCodigoDinardap = data.parCodigoDinardap ? data.parCodigoDinardap : this.parCodigoDinardap;
        this.parWebDocumentosElectronicos = data.parWebDocumentosElectronicos ? data.parWebDocumentosElectronicos : this.parWebDocumentosElectronicos;
        this.parObligadoEmitirDocumentosElectronicos = data.parObligadoEmitirDocumentosElectronicos ? data.parObligadoEmitirDocumentosElectronicos : this.parObligadoEmitirDocumentosElectronicos;
        this.parObligadoRegistrarLiquidacionPesca = data.parObligadoRegistrarLiquidacionPesca ? data.parObligadoRegistrarLiquidacionPesca : this.parObligadoRegistrarLiquidacionPesca;
        this.empCodigo = data.empCodigo ? new SisEmpresa(data.empCodigo) : this.empCodigo;
    }

}