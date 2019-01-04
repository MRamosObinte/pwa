import { Directive, forwardRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator } from '@angular/forms';

@Directive({
  selector: '[appMinDate][formControlName],[appMinDate][formControl],[appMinDate][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MinDateDirective), multi: true }
  ]
})
export class MinDateDirective implements Validator, OnChanges {

  @Input('appMinDate') appMinDate: Date;

  private control: AbstractControl;


  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appMinDate) {
      if (this.control) {
        this.control.updateValueAndValidity();
      }
    }
  }

  validate(c: AbstractControl): { [key: string]: any } {
    this.control = c;

    // Valor actual del control
    let fechaActual = c.value;

    // Valida que tenga valores
    if (fechaActual && this.appMinDate && fechaActual < this.appMinDate) {
      return {
        appMinDate: false
      }
    }
    return null;
  }

}