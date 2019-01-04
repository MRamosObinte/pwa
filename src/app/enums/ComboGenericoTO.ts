export class ComboGenericoTO {

    value: string = "";
    label: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.value = data.value ? data.value : this.value;
        this.label = data.label ? data.label : this.label;
    }
}