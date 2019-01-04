export class RhEmpleadoPK {
    empEmpresa: string = null;
    empId: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.empEmpresa = data.empEmpresa ? data.empEmpresa : this.empEmpresa;
        this.empId = data.empId ? data.empId : this.empId;
    }
}