import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appMinNumber],[appMinNumber][formControlName],[appMinNumber][formControl],[appMinNumber][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MinNumberDirective), multi: true }
  ]
})

export class MinNumberDirective implements Validator {

  @Input('appMinNumber') appMinNumber: string;

  constructor() { }

  validate(c: AbstractControl): { [key: string]: any } {
    // Valor minimo
    let numero = c.value ? c.value : "0";
    // value is minus or equals
    let valorIngresado = Number(this.formatearString(numero))
    let numeroMinimo = Number(this.appMinNumber);
    if (valorIngresado < numeroMinimo) {
      return {
        appMinNumber: false
      }
    }
    return null;
  }

  private formatearString(numeroString) {
    return numeroString.toString().replace(/,/gi, "");
  }
}
