import { Directive, forwardRef, Attribute, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appEqual2list][formControlName],[appEqual2list][formControl],[appEqual2list][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => Equal2listDirective), multi: true }
  ]
})
export class Equal2listDirective implements Validator {
  @Input('appEqual2list') public appEqual2list: number;

  constructor(
    @Attribute('appEqual2Att1') public appEqual2Att1: string,
    @Attribute('appEqual2Att2') public appEqual2Att2: string
  ) { }

  validate(c: AbstractControl): { [key: string]: any } {
    var index = 0;
    var bandera = true;
    while (bandera) {
      let input = c.root.get(this.appEqual2Att1 + '_' + index);
      let input2 = c.root.get(this.appEqual2Att2 + '_' + index);
      let controlComp = c.root.get(this.appEqual2Att2 + '_' + this.appEqual2list);
      if (c && input && input2 && controlComp && input !== c && c.value && (input.value + input2.value) === (c.value + controlComp.value)) {
        return { appEqual2list: false }
      } else if (!input) {
        bandera = false;
      } else if (input) {
        input.errors ? delete input.errors['appEqual2list'] : null;
      }
      index = index + 1;
    }
    return null;
  }
}