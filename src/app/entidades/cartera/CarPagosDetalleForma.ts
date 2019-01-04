import { CarPagosForma } from "./CarPagosForma";
import { CarPagos } from "./CarPagos";

export class CarPagosDetalleForma {

    detSecuencial:number = null;
	detValor:number = 0;
	detReferencia:string="";
	detObservaciones:string="";
	fpSecuencial:CarPagosForma=new CarPagosForma();
    carPagos:CarPagos=new CarPagos();
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detValor = data.detValor ? data.detValor : this.detValor;
        this.detReferencia = data.detReferencia ? data.detReferencia : this.detReferencia;
        this.detObservaciones = data.detObservaciones ? data.detObservaciones : this.detObservaciones;
        this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
        this.carPagos = data.carPagos ? data.carPagos : this.carPagos;
    }

}