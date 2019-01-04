import { Directive, AfterViewInit, ElementRef, OnChanges, HostListener, Input, OnInit, Output, EventEmitter } from '@angular/core';
import AutoNumeric from 'autonumeric';
/**
 * Usar appAutonumeric en input type text como un atributo de entrada ejemeplo:
 * <input type="text" [appAutonumeric2]="{variable}" value="{variable}" (updateValue)="{variable}=$event" [appAutoRead]="true|false (dependiendo si es solo de lectura o no)"> 
 */
@Directive({
  selector: '[appAutonumeric2]'
})
export class Autonumeric2Directive implements OnChanges, OnInit, AfterViewInit {

  @Input('appAutonumeric2') public appAutonumeric2: boolean = false;
  @Input('appAutoRead') public appAutoRead: boolean = false;
  @Output() updateValue: EventEmitter<any> = new EventEmitter();
  opciones: any = {};
  elementoAutonumeric: any;
  focus: boolean = false;
  currentValue = 0;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes) {
    if (changes.appAutonumeric2) {
      this.currentValue = changes.appAutonumeric2.currentValue;
      if (!this.focus) {
        this.establecerFomato();
      }
    }
    if(changes.appAutoRead){
      this.establecerFomato();
    }
  }

  ngOnInit(): void {
    this.opciones = {
      decimalCharacterAlternative: ".",
      decimalPlaces: "2",
      decimalPlacesRawValue: "2",
      decimalPlacesShownOnBlur: "2",
      decimalPlacesShownOnFocus: "2",
      minimumValue: "0",
      readOnly: this.appAutoRead ? true : false
    };
  }

  establecerFomato() {
    if (this.elementoAutonumeric) {
      this.opciones.readOnly = this.appAutoRead;
      this.elementoAutonumeric.set(this.currentValue).update(this.opciones);
    }
  }

  /**
   * Inicializa la mascara y produce el evento para dar los valores iniciales con formato.
   */
  ngAfterViewInit() {
    this.elementoAutonumeric = new AutoNumeric(this.el.nativeElement, this.opciones);
  }
  /** Reinicia el formato */
  ngAfterViewChecked() {
    if (this.appAutoRead) {
      this.elementoAutonumeric.reformat();
    }
    if (!this.focus) {
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
    this.updateValue.emit(this.formatearString(this.appAutonumeric2));
    this.focus = false;
  }
  /** Retorna el valor sin comas */
  private formatearString(numeroString) {
    return numeroString.toString().replace(/,/gi, "");
  }
}
