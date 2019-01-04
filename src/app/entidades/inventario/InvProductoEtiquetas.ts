export class InvProductoEtiquetas {

    eempresa: string = "";
    ecosto01: string = "";
    ecosto02: string = "";
    ecosto03: string = "";
    ecosto04: string = "";
    ecosto05: string = "";
    eprecio01: string = "";
    eprecio02: string = "";
    eprecio03: string = "";
    eprecio04: string = "";
    eprecio05: string = "";
    eprecio06: string = "";
    eprecio07: string = "";
    eprecio08: string = "";
    eprecio09: string = "";
    eprecio10: string = "";
    eprecio11: string = "";
    eprecio12: string = "";
    eprecio13: string = "";
    eprecio14: string = "";
    eprecio15: string = "";
    eprecio16: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.eempresa = data.eempresa ? data.eempresa : this.eempresa;
        this.ecosto01 = data.ecosto01 ? data.ecosto01 : this.ecosto01;
        this.ecosto02 = data.ecosto02 ? data.ecosto02 : this.ecosto02;
        this.ecosto03 = data.ecosto03 ? data.ecosto03 : this.ecosto03;
        this.ecosto04 = data.ecosto04 ? data.ecosto04 : this.ecosto04;
        this.ecosto05 = data.ecosto05 ? data.ecosto05 : this.ecosto05;
        this.eprecio01 = data.eprecio01 ? data.eprecio01 : this.eprecio01;
        this.eprecio02 = data.eprecio02 ? data.eprecio02 : this.eprecio02;
        this.eprecio03 = data.eprecio03 ? data.eprecio03 : this.eprecio03;
        this.eprecio04 = data.eprecio04 ? data.eprecio04 : this.eprecio04;
        this.eprecio05 = data.eprecio05 ? data.eprecio05 : this.eprecio05;
        this.eprecio06 = data.eprecio06 ? data.eprecio06 : this.eprecio06;
        this.eprecio07 = data.eprecio07 ? data.eprecio07 : this.eprecio07;
        this.eprecio08 = data.eprecio08 ? data.eprecio08 : this.eprecio08;
        this.eprecio09 = data.eprecio09 ? data.eprecio09 : this.eprecio09;
        this.eprecio10 = data.eprecio10 ? data.eprecio10 : this.eprecio10;
        this.eprecio11 = data.eprecio11 ? data.eprecio11 : this.eprecio11;
        this.eprecio12 = data.eprecio12 ? data.eprecio12 : this.eprecio12;
        this.eprecio13 = data.eprecio13 ? data.eprecio13 : this.eprecio13;
        this.eprecio14 = data.eprecio14 ? data.eprecio14 : this.eprecio14;
        this.eprecio15 = data.eprecio15 ? data.eprecio15 : this.eprecio15;
        this.eprecio16 = data.eprecio16 ? data.eprecio16 : this.eprecio16;
    }

}