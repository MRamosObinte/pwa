import { ConContable } from "../../entidades/contabilidad/ConContable";
import { SisPeriodo } from "../../entidades/sistema/SisPeriodo";
import { ConListaContableDetalleTO } from "./ConListaContableDetalleTO";
import { ConTipoTO } from "./ConTipoTO";

export class ItemListaContableTO {
    public conContable: ConContable = new ConContable();
    public detalle: ConListaContableDetalleTO[] = null;
    public periodoSeleccionado: SisPeriodo = new SisPeriodo();
    public tipoSeleccionado: ConTipoTO = new ConTipoTO();

    constructor(data?) {
        this.hydrate(data);
    }
    hydrate(data) {
        this.conContable = data ? data.conContable : this.conContable;
        this.detalle = data ? data.detalle : this.detalle;
        this.periodoSeleccionado = data ? data.periodoSeleccionado : this.periodoSeleccionado;
        this.tipoSeleccionado = data ? data.tipoSeleccionado : this.tipoSeleccionado;
    }
}