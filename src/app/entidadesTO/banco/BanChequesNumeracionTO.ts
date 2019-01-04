export class BanChequesNumeracionTO {
    banNombre: string = "";


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.banNombre = data.banNombre ? data.banNombre : this.banNombre;
    
    }
}