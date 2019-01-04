import { RhXivSueldo } from './../../entidades/rrhh/RhXivSueldo';
import { RhComboFormaPagoBeneficioSocialTO } from './RhComboFormaPagoBeneficioSocialTO';
export class RhxivSueldoxivSueldoCalcular {
    public rhXivSueldo: RhXivSueldo = new RhXivSueldo();
    public formaPago: RhComboFormaPagoBeneficioSocialTO = new RhComboFormaPagoBeneficioSocialTO();
    public diasLaborados: number = 0;
    public isFormaPagoValido: boolean = false;
    public isValorValido: boolean = false;
    public documentoRepetido: boolean = false;
    public errorEnDocumento: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.rhXivSueldo = data.rhXivSueldo ? data.rhXivSueldo : this.rhXivSueldo;
        this.formaPago = data.formaPago ? data.formaPago : this.formaPago;
        this.diasLaborados = data.diasLaborados ? data.diasLaborados : this.diasLaborados;
        this.isFormaPagoValido = data.isFormaPagoValido ? data.isFormaPagoValido : this.isFormaPagoValido;
        this.isValorValido = data.isValorValido ? data.isValorValido : this.isValorValido;
        this.documentoRepetido = data.documentoRepetido ? data.documentoRepetido : this.documentoRepetido;
        this.errorEnDocumento = data.errorEnDocumento ? data.errorEnDocumento : this.errorEnDocumento;
    }
}