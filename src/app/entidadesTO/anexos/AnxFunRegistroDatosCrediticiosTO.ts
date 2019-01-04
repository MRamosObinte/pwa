export class AnxFunRegistroDatosCrediticiosTO {

    cliCodigoDinardap : string = "";
    cliFechaCorte: string = "";
    cliTipoId: string = "";
    cliID: string = "";
    cliRazonSocial: string = "";
    cliClaseSujeto: string = "";
    cliProvincia: string = "";
    cliCiudad: string = "";
    cliParroquia: string = "";
    cliSexo: string = "";
    cliEstadoCivil: string = "";
    cliOrigenIngreso: string = "";
    vtaDocumentoNumero: string = "";
    vtaTotal: number = 0;
    vtaSaldo: number = 0;
    vtaFechaConcecion: string = "";
    VtaFechaVencimiento: string = "";
    vtaFechaExigible: string = "";
    vtaPlazoOperacion: number = 0;
    vtaPeriodicidadPago: number = 0;
    vtaDiasMorosidad: number = 0;
    vtaMontoMorosidad: number = 0;
    vtaMontoInteresMora: number = 0;
    vtaValorPorVencer0130: number = 0;
    vtaValorPorVencer3190: number = 0;
    vtaValorPorVencer91180: number = 0;
    vtaValorporVencer181360: number = 0;
    vtaValorPorVencerMas360: number = 0;
    vtaValorVencido0130: number = 0;
    vtaValorVencido3190: number = 0;
    vtaValorVencido91180: number = 0;
    vtaValorVencido181360: number = 0;
    vtaValorVencidomas360: number = 0;
    vtaValorDemandaJudicial: number = 0;
    vtaCarteraCastigada: number = 0;
    vtaCuotaCredito: number = 0;
    vtaFechaCancelacion: string = "";
    vtaFormaCancelacion: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cliCodigoDinardap = data.cliCodigoDinardap ? data.cliCodigoDinardap : this.cliCodigoDinardap;
        this.cliFechaCorte = data.cliFechaCorte ? data.cliFechaCorte : this.cliFechaCorte;
        this.cliTipoId = data.cliTipoId ? data.cliTipoId : this.cliTipoId;
        this.cliID = data.cliID ? data.cliID : this.cliID;
        this.cliRazonSocial = data.cliRazonSocial ? data.cliRazonSocial : this.cliRazonSocial;
        this.cliClaseSujeto = data.cliClaseSujeto ? data.cliClaseSujeto : this.cliClaseSujeto;
        this.cliProvincia = data.cliProvincia ? data.cliProvincia : this.cliProvincia;
        this.cliCiudad = data.cliCiudad ? data.cliCiudad : this.cliCiudad;
        this.cliParroquia = data.cliParroquia ? data.cliParroquia : this.cliParroquia;
        this.cliSexo = data.cliSexo ? data.cliSexo : this.cliSexo;
        this.cliEstadoCivil = data.cliEstadoCivil ? data.cliEstadoCivil : this.cliEstadoCivil;
        this.cliOrigenIngreso = data.cliOrigenIngreso ? data.cliOrigenIngreso : this.cliOrigenIngreso;
        this.vtaDocumentoNumero = data.vtaDocumentoNumero ? data.vtaDocumentoNumero : this.vtaDocumentoNumero;
        this.vtaTotal = data.vtaTotal ? data.vtaTotal : this.vtaTotal;
        this.vtaSaldo = data.vtaSaldo ? data.vtaSaldo : this.vtaSaldo;
        this.vtaFechaConcecion = data.vtaFechaConcecion ? data.vtaFechaConcecion : this.vtaFechaConcecion;
        this.VtaFechaVencimiento = data.VtaFechaVencimiento ? data.VtaFechaVencimiento : this.VtaFechaVencimiento;
        this.vtaFechaExigible = data.vtaFechaExigible ? data.vtaFechaExigible : this.vtaFechaExigible;
        this.vtaPlazoOperacion = data.vtaPlazoOperacion ? data.vtaPlazoOperacion : this.vtaPlazoOperacion;
        this.vtaPeriodicidadPago = data.vtaPeriodicidadPago ? data.vtaPeriodicidadPago : this.vtaPeriodicidadPago;
        this.vtaDiasMorosidad = data.vtaDiasMorosidad ? data.vtaDiasMorosidad : this.vtaDiasMorosidad;
        this.vtaMontoMorosidad = data.vtaMontoMorosidad ? data.vtaMontoMorosidad : this.vtaMontoMorosidad;
        this.vtaMontoInteresMora = data.vtaMontoInteresMora ? data.vtaMontoInteresMora : this.vtaMontoInteresMora;
        this.vtaValorPorVencer0130 = data.vtaValorPorVencer0130 ? data.vtaValorPorVencer0130 : this.vtaValorPorVencer0130;
        this.vtaValorPorVencer3190 = data.vtaValorPorVencer3190 ? data.vtaValorPorVencer3190 : this.vtaValorPorVencer3190;
        this.vtaValorPorVencer91180 = data.vtaValorPorVencer91180 ? data.vtaValorPorVencer91180 : this.vtaValorPorVencer91180;
        this.vtaValorporVencer181360 = data.vtaValorporVencer181360 ? data.vtaValorporVencer181360 : this.vtaValorporVencer181360;
        this.vtaValorPorVencerMas360 = data.vtaValorPorVencerMas360 ? data.vtaValorPorVencerMas360 : this.vtaValorPorVencerMas360;
        this.vtaValorVencido0130 = data.vtaValorVencido0130 ? data.vtaValorVencido0130 : this.vtaValorVencido0130;
        this.vtaValorVencido3190 = data.vtaValorVencido3190 ? data.vtaValorVencido3190 : this.vtaValorVencido3190;
        this.vtaValorVencido91180 = data.vtaValorVencido91180 ? data.vtaValorVencido91180 : this.vtaValorVencido91180;
        this.vtaValorVencido181360 = data.vtaValorVencido181360 ? data.vtaValorVencido181360 : this.vtaValorVencido181360;
        this.vtaValorVencidomas360 = data.vtaValorVencidomas360 ? data.vtaValorVencidomas360 : this.vtaValorVencidomas360;
        this.vtaValorDemandaJudicial = data.vtaValorDemandaJudicial ? data.vtaValorDemandaJudicial : this.vtaValorDemandaJudicial;
        this.vtaCarteraCastigada = data.vtaCarteraCastigada ? data.vtaCarteraCastigada : this.vtaCarteraCastigada;
        this.vtaCuotaCredito = data.vtaCuotaCredito ? data.vtaCuotaCredito : this.vtaCuotaCredito;
        this.vtaFechaCancelacion = data.vtaFechaCancelacion ? data.vtaFechaCancelacion : this.vtaFechaCancelacion;
        this.vtaFormaCancelacion = data.vtaFormaCancelacion ? data.vtaFormaCancelacion : this.vtaFormaCancelacion;
    }

}