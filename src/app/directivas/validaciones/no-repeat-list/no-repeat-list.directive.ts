import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms';
/**
 * Valida que no se repita un campo especificado de una lista
 * recibe como parametro el nombre del campo
 * Debe ser llamado {nombreDeCampo}_index, en donde index es el indice de la tabla
 * @export
 * @class NoRepeatListDirective
 */
@Directive({
  selector: '[appNoRepeatList][formControlName],[appNoRepeatList][formControl],[appNoRepeatList][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => NoRepeatListDirective), multi: true }
  ]
})

export class NoRepeatListDirective {
  @Input('appNoRepeatList') public appNoRepeatList: string;

  constructor() { }

  validate(miControl: AbstractControl): { [key: string]: any } {
    var index = 0;
    var bandera = true;
    while (bandera) {
      let otroInput = miControl.root.get(this.appNoRepeatList + '_' + index);
      if (miControl && otroInput && miControl != otroInput && miControl.value === otroInput.value) {
        return { appNoRepeatList: false }
      } else if (!otroInput) {
        bandera = false;
      } else if (otroInput && otroInput.errors) {
        
      }
      index = index + 1;
    }
    return null;
  }

}
