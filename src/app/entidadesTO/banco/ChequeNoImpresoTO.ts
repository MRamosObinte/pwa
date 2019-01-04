import { ConsultaDatosBancoCuentaTO } from "./ConsultaDatosBancoCuentaTO";
import { BanListaChequesNoImpresosTO } from "./BanListaChequesNoImpresosTO";

export class ChequeNoImpresoTO extends BanListaChequesNoImpresosTO{
    valorChequeLetras: string = "";
    datosBancoCuentaTO: ConsultaDatosBancoCuentaTO = new ConsultaDatosBancoCuentaTO();
    isChequeCruzado: boolean = false;
    isChequeValido: boolean = false;
    isChequeDiferente: boolean = false;

    constructor(data?) {
        super();
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.valorChequeLetras = data.valorChequeLetras ? data.valorChequeLetras : this.valorChequeLetras;
        this.datosBancoCuentaTO = data.datosBancoCuentaTO ? data.datosBancoCuentaTO : this.datosBancoCuentaTO;
        this.isChequeCruzado = data.isChequeCruzado ? data.isChequeCruzado : this.isChequeCruzado;
        this.isChequeValido = data.isChequeValido ? data.isChequeValido : this.isChequeValido;
        this.isChequeDiferente = data.isChequeDiferente ? data.isChequeDiferente : this.isChequeDiferente;
    }
}