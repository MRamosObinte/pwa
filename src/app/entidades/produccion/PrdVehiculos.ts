import { PrdVehiculosPK } from './PrdVehiculosPK';
import { PrdPiscina } from './PrdPiscina';
export class PrdVehiculos {

    prdVehiculosPK: PrdVehiculosPK = new PrdVehiculosPK();
    vehMarca: String = "";
    vehModelo: String = "";
    vehColor: String = "";
    vehAnio: String = "";
    vehMotor: String = "";
    vehChasis: String = "";
    vehOrigen: String = "";
    vehTipo: String = "";
    vehTonelaje: String = "";
    vehCilindraje: String = "";
    vehCombustible: String = "";
    vehTipoServicio: String = "";
    vehObservaciones: String = "";
    vehCompraValor: number = 0;
    vehCompraComision: number = 0;
    vehCompraMultasCtg: number = 0;
    vehCompraMultasAnt: number = 0;
    vehVentaValor: number = 0;
    vehVentaComision: number = 0;
    vehMatriculadoANombreDe: String = "";
    vehProveedorId: String = "";
    vehProveedorNombre: String = "";
    vehProveedorDireccion: String = "";
    vehProveedorTelefono: String = "";
    vehClienteId: String = "";
    vehClienteNombre: String = "";
    vehClienteDireccion: String = "";
    vehClienteTelefono: String = "";
    vehPrimerTraspasoId: String = "";
    vehPrimerTraspasoNombre: String = "";
    vehPrimerTraspasoDireccion: String = "";
    vehPrimerTraspasoTelefono: String = "";
    vehSegundoTraspasoId: String = "";
    vehSegundoTraspasoNombre: String = "";
    vehSegundoTraspasoDireccion: String = "";
    vehSegundoTraspasoTelefono: String = "";
    prdPiscina: PrdPiscina = new PrdPiscina();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.prdVehiculosPK = data.prdVehiculosPK ? new PrdVehiculosPK(data.prdVehiculosPK) : this.prdVehiculosPK;
        this.vehMarca = data.vehMarca ? data.vehMarca : this.vehMarca;
        this.vehModelo = data.vehModelo ? data.vehModelo : this.vehModelo;
        this.vehColor = data.vehColor ? data.vehColor : this.vehColor;
        this.vehAnio = data.vehAnio ? data.vehAnio : this.vehAnio;
        this.vehMotor = data.vehMotor ? data.vehMotor : this.vehMotor;
        this.vehChasis = data.vehChasis ? data.vehChasis : this.vehChasis;
        this.vehOrigen = data.vehOrigen ? data.vehOrigen : this.vehOrigen;
        this.vehTipo = data.vehTipo ? data.vehTipo : this.vehTipo;
        this.vehTonelaje = data.vehTonelaje ? data.vehTonelaje : this.vehTonelaje;
        this.vehCilindraje = data.vehCilindraje ? data.vehCilindraje : this.vehCilindraje;
        this.vehCombustible = data.vehCombustible ? data.vehCombustible : this.vehCombustible;
        this.vehTipoServicio = data.vehTipoServicio ? data.vehTipoServicio : this.vehTipoServicio;
        this.vehObservaciones = data.vehObservaciones ? data.vehObservaciones : this.vehObservaciones;
        this.vehCompraValor = data.vehCompraValor ? data.vehCompraValor : this.vehCompraValor;
        this.vehCompraComision = data.vehCompraComision ? data.vehCompraComision : this.vehCompraComision;
        this.vehCompraMultasCtg = data.vehCompraMultasCtg ? data.vehCompraMultasCtg : this.vehCompraMultasCtg;
        this.vehCompraMultasAnt = data.vehCompraMultasAnt ? data.vehCompraMultasAnt : this.vehCompraMultasAnt;
        this.vehVentaValor = data.vehVentaValor ? data.vehVentaValor : this.vehVentaValor;
        this.vehVentaComision = data.vehVentaComision ? data.vehVentaComision : this.vehVentaComision;
        this.vehMatriculadoANombreDe = data.vehMatriculadoANombreDe ? data.vehMatriculadoANombreDe : this.vehMatriculadoANombreDe;
        this.vehProveedorId = data.vehProveedorId ? data.vehProveedorId : this.vehProveedorId;
        this.vehProveedorNombre = data.vehProveedorNombre ? data.vehProveedorNombre : this.vehProveedorNombre;
        this.vehProveedorDireccion = data.vehProveedorDireccion ? data.vehProveedorDireccion : this.vehProveedorDireccion;
        this.vehProveedorTelefono = data.vehProveedorTelefono ? data.vehProveedorTelefono : this.vehProveedorTelefono;
        this.vehClienteId = data.vehClienteId ? data.vehClienteId : this.vehClienteId;
        this.vehClienteNombre = data.vehClienteNombre ? data.vehClienteNombre : this.vehClienteNombre;
        this.vehClienteDireccion = data.vehClienteDireccion ? data.vehClienteDireccion : this.vehClienteDireccion;
        this.vehClienteTelefono = data.vehClienteTelefono ? data.vehClienteTelefono : this.vehClienteTelefono;
        this.vehPrimerTraspasoId = data.vehPrimerTraspasoId ? data.vehPrimerTraspasoId : this.vehPrimerTraspasoId;
        this.vehPrimerTraspasoNombre = data.vehPrimerTraspasoNombre ? data.vehPrimerTraspasoNombre : this.vehPrimerTraspasoNombre;
        this.vehPrimerTraspasoDireccion = data.vehPrimerTraspasoDireccion ? data.vehPrimerTraspasoDireccion : this.vehPrimerTraspasoDireccion;
        this.vehPrimerTraspasoTelefono = data.vehPrimerTraspasoTelefono ? data.vehPrimerTraspasoTelefono : this.vehPrimerTraspasoTelefono;
        this.vehSegundoTraspasoId = data.vehSegundoTraspasoId ? data.vehSegundoTraspasoId : this.vehSegundoTraspasoId;
        this.vehSegundoTraspasoNombre = data.vehSegundoTraspasoNombre ? data.vehSegundoTraspasoNombre : this.vehSegundoTraspasoNombre;
        this.vehSegundoTraspasoDireccion = data.vehSegundoTraspasoDireccion ? data.vehSegundoTraspasoDireccion : this.vehSegundoTraspasoDireccion;
        this.vehSegundoTraspasoTelefono = data.vehSegundoTraspasoTelefono ? data.vehSegundoTraspasoTelefono : this.vehSegundoTraspasoTelefono;
        this.prdPiscina = data.prdPiscina ? new PrdPiscina(data.prdPiscina) : this.prdPiscina;
    }

}