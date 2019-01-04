import { Directive, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
/**
 * <input [appMaxNumber]="maxNumber">
 * @export
 * @class MaxNumberDirective
 * @implements {Validator}
 * @implements {OnChanges}
 */
@Directive({
  selector: '[appMaxNumber][formControlName],[appMaxNumber][formControl],[appMaxNumber][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxNumberDirective), multi: true }
  ]
})
export class MaxNumberDirective implements Validator, OnChanges {

  @Input('appMaxNumber') appMaxNumber: number;

  private control: AbstractControl;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appMaxNumber) {
      if (this.control) {
        this.control.updateValueAndValidity();
      }
    }
  }

  validate(c: AbstractControl): { [key: string]: any } {
    this.control = c;

    // Valor actual del control
    let numero = c.value;

    // Valida que tenga valores y si el numero actual es mayor al maximo establecido
    //entonces el appMaxNumber es false
    if (numero && this.appMaxNumber && numero > this.appMaxNumber) {
      return {
        appMaxNumber: false
      }
    }
    return null;
  }
}
