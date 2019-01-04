import { Component, OnInit } from '@angular/core';
import { LS } from '../../../constantes/app-constants';
import { InvAdjuntosCompras } from '../../../entidades/inventario/InvAdjuntosCompras';

@Component({
  selector: 'app-subir-imagenes',
  templateUrl: './subir-imagenes.component.html'
})
export class SubirImagenesComponent implements OnInit {

  public archivoPerfilByte: any = null;
  public constantes: any = LS;
  /**Imágenes */
  public listadoImagenes: Array<InvAdjuntosCompras> = new Array();
  public listadoImagenesEliminados: Array<InvAdjuntosCompras> = new Array();
  public mostrarFileUploadNuevo: boolean = true;
  public visualizarImagen: boolean = false;
  public imagen: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  crearInvAdjuntosCompras(file): InvAdjuntosCompras {
    let imagen = new InvAdjuntosCompras();
    let archivBase64: any = file;
    imagen.adjArchivo = archivBase64;
    return imagen;
  }

  seleccionarImagenes(event) {
    if (event && event.files) {
      for (let i = 0; i < event.files.length; i++) {
        this.convertirFiles(event.files[i]);
      }
    }
  }

  convertirFiles(file) {
    if (file.size <= 1000000) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          let invAdjProducto = this.crearInvAdjuntosCompras(reader.result);
          if (this.listadoImagenes.length === 0) {
            this.listadoImagenes.push(invAdjProducto);
          } else {
            let imagenRepetida = this.listadoImagenes.find(img => img.adjArchivo === invAdjProducto.adjArchivo);
            !imagenRepetida ? this.listadoImagenes.push(invAdjProducto) : null;
          }
        }
      }
    }
  }

  eliminarItem(event) {
    if (event.adjArchivo) {
      let reader = new FileReader();
      reader.readAsDataURL(event.adjArchivo);
      reader.onload = () => {
        if (reader.result) {
          let invAdjProducto = this.crearInvAdjuntosCompras(reader.result);
          this.eliminar(invAdjProducto);
        }
      }
    }
  }

  eliminar(imagen) {
    if (imagen.adjSecuencial) {
      var indexTemp = this.listadoImagenes.findIndex(item => item.adjSecuencial === imagen.adjSecuencial);
    } else {
      var indexTemp = this.listadoImagenes.findIndex(item => item.adjArchivo === imagen.adjArchivo);
    }
    let listaTemporal = [...this.listadoImagenes];
    listaTemporal.splice(indexTemp, 1);
    this.listadoImagenes = listaTemporal;
    imagen.adjSecuencial ? this.listadoImagenesEliminados.push(imagen) : null;
  }

  visualizar(imagen) {
    this.imagen = imagen;
    this.visualizarImagen = true;
  }

}
