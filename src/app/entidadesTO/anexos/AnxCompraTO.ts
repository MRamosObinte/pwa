export class AnxCompraTO {

    empCodigo: string = null;
    perCodigo: string = null;
    motCodigo: string = null;
    compNumero: string = null;
    compSustentotributario: string = null;
    compAutorizacion: string = null;
    compEmision: string = null;
    compCaduca: string = null;
    compBase0: number = 0;
    compBaseimponible: number = 0;
    compBasenoobjetoiva: number = 0;
    compMontoice: number = 0;
    compMontoiva: number = 0;
    compBaseivabienes: number = 0;
    compBaseivaservicios: number = 0;
    compBaseivaserviciosprofesionales: number = 0;
    compPorcentajebienes: number = 0;
    compPorcentajeservicios: number = 0;
    compPorcentajeserviciosprofesionales: number = 0;
    compValorbienes: number = 0;
    compValorservicios: number = 0;
    compValorserviciosprofesionales: number = 0;
    compRetencionNumero: string = null;
    compRetencionClaveAcceso: string = null;
    compRetencionAutorizacion: string = null;
    compRetencionFechaEmision: string = null;
    compModificadoDocumentoTipo: string = null;
    compModificadoDocumentoNumero: string = null;
    compModificadoAutorizacion: string = null;
    valorRetencion: number = 0;
    retImpreso: boolean = false;
    retEntregado: boolean = false;
    retElectronica: boolean = false;
    retAmbienteProduccion: boolean = false;
    retMostrarDialogoImpresion: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
        this.perCodigo = data.perCodigo ? data.perCodigo : this.perCodigo;
        this.motCodigo = data.motCodigo ? data.motCodigo : this.motCodigo;
        this.compNumero = data.compNumero ? data.compNumero : this.compNumero;
        this.compSustentotributario = data.compSustentotributario ? data.compSustentotributario : this.compSustentotributario;
        this.compAutorizacion = data.compAutorizacion ? data.compAutorizacion : this.compAutorizacion;
        this.compEmision = data.compEmision ? data.compEmision : this.compEmision;
        this.compCaduca = data.compCaduca ? data.compCaduca : this.compCaduca;
        this.compBase0 = data.compBase0 ? data.compBase0 : this.compBase0;
        this.compBaseimponible = data.compBaseimponible ? data.compBaseimponible : this.compBaseimponible;
        this.compBasenoobjetoiva = data.compBasenoobjetoiva ? data.compBasenoobjetoiva : this.compBasenoobjetoiva;
        this.compMontoice = data.compMontoice ? data.compMontoice : this.compMontoice;
        this.compMontoiva = data.compMontoiva ? data.compMontoiva : this.compMontoiva;
        this.compBaseivabienes = data.compBaseivabienes ? data.compBaseivabienes : this.compBaseivabienes;
        this.compBaseivaservicios = data.compBaseivaservicios ? data.compBaseivaservicios : this.compBaseivaservicios;
        this.compBaseivaserviciosprofesionales = data.compBaseivaserviciosprofesionales ? data.compBaseivaserviciosprofesionales : this.compBaseivaserviciosprofesionales;
        this.compPorcentajebienes = data.compPorcentajebienes ? data.compPorcentajebienes : this.compPorcentajebienes;
        this.compPorcentajeservicios = data.compPorcentajeservicios ? data.compPorcentajeservicios : this.compPorcentajeservicios;
        this.compPorcentajeserviciosprofesionales = data.compPorcentajeserviciosprofesionales ? data.compPorcentajeserviciosprofesionales : this.compPorcentajeserviciosprofesionales;
        this.compValorbienes = data.compValorbienes ? data.compValorbienes : this.compValorbienes;
        this.compValorservicios = data.compValorservicios ? data.compValorservicios : this.compValorservicios;
        this.compValorserviciosprofesionales = data.compValorserviciosprofesionales ? data.compValorserviciosprofesionales : this.compValorserviciosprofesionales;
        this.compRetencionNumero = data.compRetencionNumero ? data.compRetencionNumero : this.compRetencionNumero;
        this.compRetencionClaveAcceso = data.compRetencionClaveAcceso ? data.compRetencionClaveAcceso : this.compRetencionClaveAcceso;
        this.compRetencionAutorizacion = data.compRetencionAutorizacion ? data.compRetencionAutorizacion : this.compRetencionAutorizacion;
        this.compModificadoDocumentoTipo = data.compModificadoDocumentoTipo ? data.compModificadoDocumentoTipo : this.compModificadoDocumentoTipo;
        this.compModificadoDocumentoNumero = data.compModificadoDocumentoNumero ? data.compModificadoDocumentoNumero : this.compModificadoDocumentoNumero;
        this.compModificadoAutorizacion = data.compModificadoAutorizacion ? data.compModificadoAutorizacion : this.compModificadoAutorizacion;
        this.valorRetencion = data.valorRetencion ? data.valorRetencion : this.valorRetencion;
        this.retImpreso = data.retImpreso ? data.retImpreso : this.retImpreso;
        this.retEntregado = data.retEntregado ? data.retEntregado : this.retEntregado;
        this.retElectronica = data.retElectronica ? data.retElectronica : this.retElectronica;
        this.retAmbienteProduccion = data.retAmbienteProduccion ? data.retAmbienteProduccion : this.retAmbienteProduccion;
        this.retMostrarDialogoImpresion = data.retMostrarDialogoImpresion ? data.retMostrarDialogoImpresion : this.retMostrarDialogoImpresion;
    }

}