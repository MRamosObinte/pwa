export interface AppAutonumeric {
    createLocalList?: boolean,
    decimalPlaces?: number,//Cantidad de decimales que se mostraran en el valor formateado
    decimalPlacesRawValue?: number,//Cantidad de decimales que se guardaran en el rawvalue
    decimalPlacesShownOnBlur?: number,//Cantidad de decimales que se mostraran cuando el input reciba el focus
    decimalPlacesShownOnFocus?: number,//Cantidad de decimals que se mostraran cuando el input pierda el focus
    maximumValue?: string,//Valor maximo a ingresar
    minimumValue?: string,//Valor minimo a ingresar
    negativeSignCharacter?: string,//Simbolo de negativo
    outputFormat?: string,//Formato del numero qu se guarda number|string
    readOnly?: boolean//Define si el input es o no de solo lectura
  }