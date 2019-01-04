import { Directive, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appMaxDate][formControlName],[appMaxDate][formControl],[appMaxDate][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxDateDirective), multi: true }
  ]
})
export class MaxDateDirective implements Validator, OnChanges {

  @Input('appMaxDate') appMaxDate: Date;

  private control: AbstractControl;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appMaxDate) {
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
    if (fechaActual && this.appMaxDate && fechaActual > this.appMaxDate) {
      return {
        appMaxDate: false
      }
    }
    return null;
  }
}
