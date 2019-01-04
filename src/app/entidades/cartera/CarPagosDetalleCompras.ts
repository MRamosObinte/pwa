import { CarPagos } from "./CarPagos";

export class CarPagosDetalleCompras {

    detSecuencial:number=null;
	detValor:number=0;
	compEmpresa:string="";
	compPeriodo:string="";
	compMotivo:string="";
	compNumero:string="";
	secEmpresa:string="";
	secCodigo:string="";
    carPagos:CarPagos=new CarPagos();
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detSecuencial = data.detSecuencial ? data.detSecuencial : this.detSecuencial;
        this.detValor = data.detValor ? data.detValor : this.detValor;
        this.compEmpresa = data.compEmpresa ? data.compEmpresa : this.compEmpresa;
        this.compPeriodo = data.compPeriodo ? data.compPeriodo : this.compPeriodo;
        this.compMotivo = data.compMotivo ? data.compMotivo : this.compMotivo;
        this.compNumero = data.compNumero ? data.compNumero : this.compNumero;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.carPagos = data.carPagos ? data.carPagos : this.carPagos;
    }

}