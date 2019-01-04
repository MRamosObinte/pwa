import { RhXiiiSueldo } from './../../entidades/rrhh/RhXiiiSueldo';
import { RhComboFormaPagoBeneficioSocialTO } from './RhComboFormaPagoBeneficioSocialTO';
export class RhXiiiSueldoXiiiSueldoCalcular {
    public rhXiiiSueldo: RhXiiiSueldo = new RhXiiiSueldo();
    public formaPago: RhComboFormaPagoBeneficioSocialTO = new RhComboFormaPagoBeneficioSocialTO();
    public ingresosCalculados: number = 0;//editable
    public isFormaPagoValido: boolean = false;
    public isValorValido: boolean = false;
    public documentoRepetido: boolean = false;
    public errorEnDocumento: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.rhXiiiSueldo = data.rhXiiiSueldo ? data.rhXiiiSueldo : this.rhXiiiSueldo;
        this.formaPago = data.formaPago ? data.formaPago : this.formaPago;
        this.ingresosCalculados = data.ingresosCalculados ? data.ingresosCalculados : this.ingresosCalculados;
        this.isFormaPagoValido = data.isFormaPagoValido ? data.isFormaPagoValido : this.isFormaPagoValido;
        this.isValorValido = data.isValorValido ? data.isValorValido : this.isValorValido;
        this.documentoRepetido = data.documentoRepetido ? data.documentoRepetido : this.documentoRepetido;
        this.errorEnDocumento = data.errorEnDocumento ? data.errorEnDocumento : this.errorEnDocumento;
    }
}