export class Parametros {
    empresa: string;
    incluirInactivos: boolean;

    constructor(data?) {
        this.hydrate(data);
    }



    hydrate(data) {
        this.empresa = data.empresa ? data.empresa : this.empresa;
        this.incluirInactivos = data.incluirInactivos ? data.incluirInactivos : this.incluirInactivos;
    }
}