export class CarListaMayorAuxiliarClienteProveedorTO {

	id:number=0;
	maContable:string="";
	maFecha:string="";
	maClavePrincipal:string="";
	maCp:string="";
	maDocumento:string="";
	maDebe:number=0;
	maHaber:number=0;
	maSaldo:number=0;
	maObservaciones:string="";
	maOrden:number=0;

	constructor(data?) {
		data ? this.hydrate(data) : null;
	}

	hydrate(data) {
		this.maContable = data.maContable ? data.maContable : this.maContable;
		this.maFecha = data.maFecha ? data.maFecha : this.maFecha;
		this.maClavePrincipal = data.maClavePrincipal ? data.maClavePrincipal : this.maClavePrincipal;
		this.maCp = data.maCp ? data.maCp : this.maCp;
		this.maDocumento = data.maDocumento ? data.maDocumento : this.maDocumento;
		this.maDebe = data.maDebe ? data.maDebe : this.maDebe;
		this.maHaber = data.maHaber ? data.maHaber : this.maHaber;
		this.maSaldo = data.maSaldo ? data.maSaldo : this.maSaldo;
		this.maObservaciones = data.maObservaciones ? data.maObservaciones : this.maObservaciones;
		this.maOrden = data.maOrden ? data.maOrden : this.maOrden;
		this.id = data.id ? data.id : this.id;
	}

}
