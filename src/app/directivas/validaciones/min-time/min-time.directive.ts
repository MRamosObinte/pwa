import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appMinTime][formControlName],[appMinTime][formControl],[appMinTime][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MinTimeDirective), multi: true }
  ]
})
export class MinTimeDirective implements Validator {

  constructor(@Attribute('appMinTime') public appMinTime: string) { }

  validate(c: AbstractControl): { [key: string]: any } {
    // self value (e.g. retype maxtime)
    let horaFinStr = c.value;

    // control value (e.g. mintime)
    let horaInicioCtrl = c.root.get(this.appMinTime);

    // Valida que tenga valores
    if (horaFinStr && horaInicioCtrl && horaInicioCtrl.value) {
      let date = new Date();
      let maxTime = new Date(date.toDateString() + ' ' + horaFinStr);
      let minTime = new Date(date.toDateString() + ' ' + horaInicioCtrl.value);
      if (maxTime <= minTime) {
        return {
          appMinTime: false
        }
      }else{
        //Quita los errores al campo de tiempo de fin
        horaInicioCtrl.errors?delete horaInicioCtrl.errors['appMaxTime']:null;
        horaInicioCtrl.errors?horaInicioCtrl.setErrors(null):null;
      }
    }
    return null;
  }
}