export class SisPermisoPK {

    perEmpresa: string = "";
    perModulo: string = "";
    perMenu: string = "";
    perItem: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.perEmpresa = data.perEmpresa ? data.perEmpresa : this.perEmpresa;
        this.perModulo = data.perModulo ? data.perModulo : this.perModulo;
        this.perMenu = data.perMenu ? data.perMenu : this.perMenu;
        this.perItem = data.perItem ? data.perItem : this.perItem;
    }

}