export class BanListaConciliacionBancariaTO {
    cbContable: string = "";
    cbSecuencial: string = "";
    cbFecha: string = "";
    cbDocumento: string = "";
    cbValor: number = 0;
    cbConciliado: boolean = false;
    cbConcepto: string = "";
    cbObservaciones: string = "";
    cbDc: string = "";
    cbCategoria: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cbContable = data.cbContable ? data.cbContable : this.cbContable;
        this.cbSecuencial = data.cbSecuencial ? data.cbSecuencial : this.cbSecuencial;
        this.cbFecha = data.cbFecha ? data.cbFecha : this.cbFecha;
        this.cbDocumento = data.cbDocumento ? data.cbDocumento : this.cbDocumento;
        this.cbValor = data.cbValor ? data.cbValor : this.cbValor;
        this.cbConciliado = data.cbConciliado ? data.cbConciliado : this.cbConciliado;
        this.cbConcepto = data.cbConcepto ? data.cbConcepto : this.cbConcepto;
        this.cbObservaciones = data.cbObservaciones ? data.cbObservaciones : this.cbObservaciones;
        this.cbDc = data.cbDc ? data.cbDc : this.cbDc;
        this.cbCategoria = data.cbCategoria ? data.cbCategoria : this.cbCategoria;
    }

}