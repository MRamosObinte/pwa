
export class PrdListaSectorTO {

    secCodigo: string = null;
    nomSector: string = null;
    secLatitud: string = null;
    secLongitud: string = null;
    secActivo: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.nomSector = data.nomSector ? data.nomSector : this.nomSector;
        this.secLatitud = data.secLatitud ? data.secLatitud : this.secLatitud;
        this.secLongitud = data.secLongitud ? data.secLongitud : this.secLongitud;
        this.secActivo = data.secActivo ? data.secActivo : this.secActivo;
    }

}
