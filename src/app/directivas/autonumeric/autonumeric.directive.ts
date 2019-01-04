import { Directive, AfterViewInit, ElementRef, OnChanges, HostListener, SimpleChanges, Input, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import AutoNumeric from 'autonumeric';
import { AppAutonumeric } from './AppAutonumeric';

@Directive({
  selector: '[ngModel][appAutonumeric]'
})
export class AutonumericDirective implements OnChanges, AfterViewChecked, AfterViewInit {
  @Input('appAutonumeric') public appAutonumeric: AppAutonumeric;
  @Input('appAutonumericValue') public appAutonumericValue: number = 0;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  opcionesDefault: AppAutonumeric;
  opciones: any = {};
  elementoAutonumeric: any;
  focus: boolean = false;
  currentValue = 0;
  reformat: boolean = false;

  constructor(private el: ElementRef) {
    this.opcionesDefault = {
      createLocalList: false,
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: "9999999999999999999999.99",
      minimumValue: "0",
      negativeSignCharacter: "−",
      outputFormat: "number",
      readOnly: false
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appAutonumeric) {
      this.establecerFomato();
    }
    if (changes.appAutonumericValue) {
      this.establecerFomatoValor();
    }
  }
  
  ngAfterViewChecked() {
    if(!this.focus && this.elementoAutonumeric){
      this.reformartear();
    }
  }

  ngAfterViewInit(): void {
    if (!this.elementoAutonumeric) {
      this.iniciarAutonumeric();
    }
  }

  @HostListener("focus", ["$event.target"])
  onFocus(target) {
    this.focus = true;
  }

  @HostListener("blur", ["$event.target"])
  onBlur(target) {
    let value = this.formatearString(this.el.nativeElement.value);
    this.ngModelChange.emit(value);
    this.focus = false;
    this.reformartear();
  }


  establecerFomato() {
    if (this.elementoAutonumeric) {
      this.opciones = this.generarOpciones();
      this.elementoAutonumeric.update(this.opciones);
    }
  }

  iniciarAutonumeric() {
    this.opciones = this.generarOpciones();
    this.elementoAutonumeric = new AutoNumeric(this.el.nativeElement, this.opciones);
  }

  establecerFomatoValor() {
    if (!this.focus && this.elementoAutonumeric && this.appAutonumericValue != null) {
      this.opciones = this.generarOpciones();
      let value = this.formatearString(this.appAutonumericValue + "");
      this.elementoAutonumeric.set(value, this.opciones);
    }
  }


  private reformartear() {
    if (this.elementoAutonumeric) {
      this.elementoAutonumeric.reformat();
    }
  }

  private formatearString(numeroString) {
    return numeroString.toString().replace(/,/gi, "");
  }

  generarOpciones(): any {
    return {
      createLocalList: this.appAutonumeric.createLocalList ? this.appAutonumeric.createLocalList : this.opcionesDefault.createLocalList,
      decimalPlaces: this.appAutonumeric.decimalPlaces >= 0 ? this.appAutonumeric.decimalPlaces : this.opcionesDefault.decimalPlaces,
      decimalPlacesRawValue: this.appAutonumeric.decimalPlacesRawValue >= 0 ? this.appAutonumeric.decimalPlacesRawValue : this.opcionesDefault.decimalPlacesRawValue,
      decimalPlacesShownOnBlur: this.appAutonumeric.decimalPlacesShownOnBlur >= 0 ? this.appAutonumeric.decimalPlacesShownOnBlur : this.opcionesDefault.decimalPlacesShownOnBlur,
      decimalPlacesShownOnFocus: this.appAutonumeric.decimalPlacesShownOnFocus >= 0 ? this.appAutonumeric.decimalPlacesShownOnFocus : this.opcionesDefault.decimalPlacesShownOnFocus,
      maximumValue: this.appAutonumeric.maximumValue ? this.appAutonumeric.maximumValue : this.opcionesDefault.maximumValue,
      minimumValue: this.appAutonumeric.minimumValue ? this.appAutonumeric.minimumValue : this.opcionesDefault.minimumValue,
      negativeSignCharacter: this.appAutonumeric.negativeSignCharacter ? this.appAutonumeric.negativeSignCharacter : this.opcionesDefault.negativeSignCharacter,
      outputFormat: this.appAutonumeric.outputFormat ? this.appAutonumeric.outputFormat : this.opcionesDefault.outputFormat,
      readOnly: this.appAutonumeric.readOnly ? this.appAutonumeric.readOnly : this.opcionesDefault.readOnly,
    }
  }
}

