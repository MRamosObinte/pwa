import { RhListaEmpleadoLoteTO } from './RhListaEmpleadoLoteTO';
import { PrdListaPiscinaTO } from '../Produccion/PrdListaPiscinaTO';
import { RhListaBonoConceptoTO } from './RhListaBonoConceptoTO';
export class RhListaBonosLoteTO {
    rhListaEmpleadoLoteTO: RhListaEmpleadoLoteTO = new RhListaEmpleadoLoteTO();
    //Nuevos
    concepto: RhListaBonoConceptoTO = new RhListaBonoConceptoTO();
    piscina: PrdListaPiscinaTO = new PrdListaPiscinaTO();
    listaPiscinas: Array<PrdListaPiscinaTO> = [];
    observacion: string;
    deducible: boolean;
    isConceptoValido: boolean;
    isValorValido: boolean;
    //Variables propias de RhBono
    bonoSecuencial: number;
    bonoAuxiliar: boolean;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.rhListaEmpleadoLoteTO = data.rhListaEmpleadoLoteTO ? data.rhListaEmpleadoLoteTO : this.rhListaEmpleadoLoteTO;
        this.concepto = data.concepto ? data.concepto : this.concepto;
        this.observacion = data.observacion ? data.observacion : this.observacion;
        this.deducible = data.deducible ? data.deducible : this.deducible;
        this.isConceptoValido = data.isConceptoValido ? data.isConceptoValido : this.isConceptoValido;
        this.isValorValido = data.isValorValido ? data.isValorValido : this.isValorValido;
        this.piscina = data.piscina ? data.piscina : this.piscina;
        this.bonoSecuencial = data.bonoSecuencial ? data.bonoSecuencial : this.bonoSecuencial;
        this.bonoAuxiliar = data.bonoAuxiliar ? data.bonoAuxiliar : this.bonoAuxiliar;
    }
}
