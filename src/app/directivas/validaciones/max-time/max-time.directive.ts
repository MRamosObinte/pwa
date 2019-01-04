import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appMaxTime][formControlName],[appMaxTime][formControl],[appMaxTime][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxTimeDirective), multi: true }
  ]
})
export class MaxTimeDirective implements Validator {

  constructor(@Attribute('appMaxTime') public appMaxTime: string) { }

  validate(c: AbstractControl): { [key: string]: any } {
    // self value (e.g. retype mintime) 
    let horaInicioStr = c.value; 

    // control value (e.g. maxtime)
    let horaFinCtrl = c.root.get(this.appMaxTime);

    // Valida que tenga valores
    if (horaInicioStr && horaFinCtrl && horaFinCtrl.value) {
      let minTime = new Date(new Date().toDateString() + ' ' + horaInicioStr);
      let maxTime = new Date(new Date().toDateString() + ' ' + horaFinCtrl.value);
      if (minTime >= maxTime) {
        return {
          appMaxTime: false
        }
      }else{
        //Quita los errores al campo de tiempo inicio
        horaFinCtrl.errors?delete horaFinCtrl.errors['appMinTime']:null;
        horaFinCtrl.errors?horaFinCtrl.setErrors(null):null;
      }
    }
    return null;
  }
}