import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowSelectorDirective } from '../../directivas/row-selector/row-selector.directive';
import { FocusDirective } from '../../directivas/focus/focus.directive';
import { Autonumeric6Directive } from '../../directivas/autonumeric6/autonumeric6.directive';
import { Autonumeric2Directive } from '../../directivas/autonumeric2/autonumeric2.directive';
import { MaxTimeDirective } from '../../directivas/validaciones/max-time/max-time.directive';
import { MinTimeDirective } from '../../directivas/validaciones/min-time/min-time.directive';
import { MinNumberDirective } from '../../directivas/validaciones/min-number/min-number.directive';
import { DescripcionDirective } from '../../directivas/descripcion/descripcion.directive';
import { TricheckDirective } from '../../directivas/tricheck/tricheck.directive';
import { UppercaseDirective } from "../../directivas/uppercase/uppercase.directive";
import { LowercaseDirective } from '../../directivas/lowercase/lowercase.directive';
import { AutonumericDirective } from '../../directivas/autonumeric/autonumeric.directive';
import { Equal2listDirective } from '../../directivas/equal-2list/equal-2list.directive';
import { NoRepeatListDirective } from '../../directivas/validaciones/no-repeat-list/no-repeat-list.directive';
import { MaxDateDirective } from '../../directivas/validaciones/max-date/max-date.directive';
import { MinDateDirective } from '../../directivas/validaciones/min-date/min-date.directive';
import { TurbotableNavigationDirective } from '../../directivas/turbotable-navigation/turbotable-navigation.directive';
import { MaxNumberDirective } from '../../directivas/validaciones/max-number/max-number.directive';
import { EnteroPositivoDirective } from '../../directivas/entero-positivo/entero-positivo.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MaxTimeDirective,
    MinTimeDirective,
    FocusDirective,
    RowSelectorDirective,
    Autonumeric2Directive,
    Autonumeric6Directive,
    MinNumberDirective,
    DescripcionDirective,
    TricheckDirective,
    UppercaseDirective,
    LowercaseDirective,
    AutonumericDirective,
    Equal2listDirective,
    NoRepeatListDirective,
    MaxDateDirective,
    MinDateDirective,
    TurbotableNavigationDirective,
    MaxNumberDirective,
    EnteroPositivoDirective
  ],
  exports: [
    MaxTimeDirective,
    MinTimeDirective,
    FocusDirective,
    RowSelectorDirective,
    Autonumeric2Directive,
    Autonumeric6Directive,
    MinNumberDirective,
    DescripcionDirective,
    TricheckDirective,
    UppercaseDirective,
    LowercaseDirective,
    AutonumericDirective,
    Equal2listDirective,
    NoRepeatListDirective,
    MaxDateDirective,
    MinDateDirective,
    TurbotableNavigationDirective,
    MaxNumberDirective,
    EnteroPositivoDirective
  ],
})
export class DirectivasModule { }
