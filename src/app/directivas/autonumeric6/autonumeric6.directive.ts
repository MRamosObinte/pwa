import { Directive, ElementRef, AfterViewInit, Input, OnInit, HostListener, EventEmitter, Output, OnChanges } from '@angular/core';
import AutoNumeric from 'autonumeric';
/**
 * Usar appAutonumeric en input type text como un atributo de entrada ejemeplo:
 * <input type="text" [appAutonumeric6]="{variable}" value="{variable}" (updateValue6)="{variable}=$event" [appAutoRead6]="true|false (dependiendo si es solo de lectura o no)"> 
 */
@Directive({
  selector: '[appAutonumeric6]'
})
export class Autonumeric6Directive implements OnChanges, OnInit, AfterViewInit {

  @Input('appAutonumeric6') public appAutonumeric6: boolean = false;
  @Input('appAutoRead6') public appAutoRead6: boolean = false;
  @Output() updateValue6: EventEmitter<any> = new EventEmitter();
  opciones: any = {};
  elementoAutonumeric: any;
  focus: boolean = false;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes) {
    if (changes.appAutonumeric6 && this.elementoAutonumeric && !this.focus) {
      this.opciones.readOnly = this.appAutoRead6;
      this.elementoAutonumeric.set(changes.appAutonumeric6.currentValue).update(this.opciones);
    }
  }

  ngOnInit(): void {
    this.opciones = {
      decimalCharacterAlternative: ".",
      decimalPlaces: "6",
      decimalPlacesRawValue: "6",
      decimalPlacesShownOnBlur: "2",
      decimalPlacesShownOnFocus: "6",
      minimumValue: "0",
      readOnly: this.appAutoRead6 ? true : false
    };
  }
  /**
   * Inicializa la mascara y produce el evento para dar los valores iniciales con formato.
   */
  ngAfterViewInit() {
    this.elementoAutonumeric = new AutoNumeric(this.el.nativeElement, this.opciones);
  }
  /** Reinicia el formato */
  ngAfterViewChecked() {
    if(this.appAutoRead6){
      this.elementoAutonumeric.reformat();
    }
    if(!this.focus){
      this.elementoAutonumeric.reformat();
    }
  }
  /** Indica si esta enfocado */
  @HostListener("focus", ["$event.target"])
  onFocus(target) {
    this.focus = true;
  }
  /**Infica si el enfoque se ha perdido */
  @HostListener("blur", ["$event.target"])
  onBlur(target) {
    this.updateValue6.emit(this.formatearString(this.appAutonumeric6));
    this.focus = false;
  }
  /** Retorna el valor sin comas */
  private formatearString(numeroString) {
    return numeroString.toString().replace(/,/gi, "");
  }
}
