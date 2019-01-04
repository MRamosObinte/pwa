export class RhListaProvisionesTO {
    id: number = null;
    provCategoria: string = null;
    provId: string = null;
    provNombres: string = null;
    provSueldo: number = 0;
    provDiasPagados: number = 0;
    provAporteIndividual: number = 0;
    provAportePatronal: number = 0;
    provIece: number = 0;
    provSecap: number = 0;
    provXiii: number = 0;
    provXiv: number = 0;
    provFondoReserva: number = 0;
    provVacaciones: number = 0;
    provDesahucio: number = 0;
    provSecuencial: number = 0;
    provContableRol: string = null;
    provContableProvision: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.provCategoria = data.provCategoria ? data.provCategoria : this.provCategoria;
        this.provId = data.provId ? data.provId : this.provId;
        this.provNombres = data.provNombres ? data.provNombres : this.provNombres;
        this.provSueldo = data.provSueldo ? data.provSueldo : this.provSueldo;
        this.provDiasPagados = data.provDiasPagados ? data.provDiasPagados : this.provDiasPagados;
        this.provAporteIndividual = data.provAporteIndividual ? data.provAporteIndividual : this.provAporteIndividual;
        this.provAportePatronal = data.provAportePatronal ? data.provAportePatronal : this.provAportePatronal;
        this.provIece = data.provIece ? data.provIece : this.provIece;
        this.provSecap = data.provSecap ? data.provSecap : this.provSecap;
        this.provXiii = data.provXiii ? data.provXiii : this.provXiii;
        this.provXiv = data.provXiv ? data.provXiv : this.provXiv;
        this.provFondoReserva = data.provFondoReserva ? data.provFondoReserva : this.provFondoReserva;
        this.provVacaciones = data.provVacaciones ? data.provVacaciones : this.provVacaciones;
        this.provDesahucio = data.provDesahucio ? data.provDesahucio : this.provDesahucio;
        this.provSecuencial = data.provSecuencial ? data.provSecuencial : this.provSecuencial;
        this.provContableRol = data.provContableRol ? data.provContableRol : this.provContableRol;
        this.provContableProvision = data.provContableProvision ? data.provContableProvision : this.provContableProvision;
    }
}