(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{"2AoH":function(e,t,a){"use strict";a.r(t);var i=a("CcnG"),r=a("Q8hO"),o=a("ZYCi"),s=a("LlOB"),n=function(e,t,a,i){var r,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,i);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(o<3?r(s):o>3?r(t,a,s):r(t,a))||s);return o>3&&s&&Object.defineProperty(t,a,s),s},c=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},l=function(){function e(e,t){var a=this;this.router=e,this.appSistemaService=t,this.showIndex=!1,this.router.events.subscribe(function(e){a.showIndex="/modulos/sistema"===a.router.url})}return e.prototype.ngOnInit=function(){this.listaAccesoRapido=[{item:"Per\xedodo",url:"periodo",mostrar:this.appSistemaService.validarPermisoAccesoDirecto("Archivo","periodo")},{item:"Sucesos",url:"sucesos",mostrar:this.appSistemaService.validarPermisoAccesoDirecto("Consultas","sucesos")},{item:"Permisos",url:"permisosTrans",mostrar:this.appSistemaService.validarPermisoAccesoDirecto("Transacciones","permisosTrans")},{item:"Grupos",url:"grupo",mostrar:this.appSistemaService.validarPermisoAccesoDirecto("Archivo","grupo")},{item:"Usuario",url:"usuario",mostrar:this.appSistemaService.validarPermisoAccesoDirecto("Archivo","usuario")}]},e=n([Object(i.Component)({selector:"app-sistema",template:a("BFiK")}),c("design:paramtypes",[o.Router,s.a])],e)}(),d=a("8fiX"),u=a("EnEm"),p=a("mwBN"),m=a("z5Y/"),h=a("SZbH"),f=a("M+vq"),b=a("yccp"),S=a("CEfs"),v=a("nR5P"),g=function(e,t,a,i){var r,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,i);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(o<3?r(s):o>3?r(t,a,s):r(t,a))||s);return o>3&&s&&Object.defineProperty(t,a,s),s},R=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},A=function(){function e(e,t,a,i,r,o){this.route=e,this.atajoService=t,this.api=a,this.utilService=i,this.toastr=r,this.filasService=o,this.empresaSeleccionada=new d.a,this.listaEmpresas=[],this.cargando=!1,this.activar=!1,this.accion=null,this.listadoResultado=[],this.filasTiempo=new u.a,this.busquedaListado=null,this.vistaListado=!1,this.dataFormularioPerfil=null,this.deshabilitarOpciones=!1,this.operacionListado=null,this.constantes=p.a,this.listaEmpresas=this.route.snapshot.data.perfilFacturacion,this.listaEmpresas&&(this.empresaSeleccionada=this.utilService.seleccionarEmpresa(this.listaEmpresas),p.a.KEY_EMPRESA_SELECT=this.empresaSeleccionada.empCodigo)}return e.prototype.ngOnInit=function(){this.cambiarempresaSeleccionada(),this.iniciarAtajos()},e.prototype.iniciarAtajos=function(){this.atajoService.add(new f.Hotkey(p.a.ATAJO_BUSCAR,function(e){return document.getElementById("btnBuscar").click(),!1}))},e.prototype.cambiarempresaSeleccionada=function(){p.a.KEY_EMPRESA_SELECT=this.empresaSeleccionada.empCodigo,this.limpiarResultado()},e.prototype.limpiarResultado=function(){this.operacionListado={objeto:null,accion:p.a.LST_LIMPIAR},this.busquedaListado=null,this.vistaListado=!1,this.dataFormularioPerfil=null,this.filasService.actualizarFilas(0)},e.prototype.buscarPerfilFacturacion=function(){this.filasService.actualizarFilas(0),this.busquedaListado=this.generarObjetoListado(),this.vistaListado=!0,this.dataFormularioPerfil=null},e.prototype.generarObjetoListado=function(){return{empresa:p.a.KEY_EMPRESA_SELECT}},e.prototype.nuevoPerfilFacturacion=function(){this.utilService.verificarPermiso(p.a.ACCION_CREAR,this,!0)&&(this.dataFormularioPerfil=this.generarObjetoFormulario())},e.prototype.generarObjetoFormulario=function(){return{accion:p.a.ACCION_CREAR,cajCajaPK:null}},e.prototype.cancelar=function(){this.deshabilitarOpciones=!1,this.dataFormularioPerfil=null,this.vistaListado=!0},e.prototype.cancelarFormulario=function(){this.cancelar(),this.operacionListado={objeto:null,accion:p.a.LST_FILAS}},e.prototype.cambiarActivar=function(e){(e.activar||!1===e.activar)&&(this.activar=e.activar),(e.deshabilitarOpciones||!1===e.deshabilitarOpciones)&&(this.deshabilitarOpciones=e.deshabilitarOpciones),(e.vistaListado||!1===e.vistaListado)&&(this.vistaListado=e.vistaListado)},e.prototype.accionLista=function(e){this.operacionListado=e,this.cancelar()},e=g([Object(i.Component)({selector:"app-perfil-facturacion",template:a("AxcS"),styles:[a("wCVJ")]}),R("design:paramtypes",[o.ActivatedRoute,b.HotkeysService,m.a,v.a,h.b,S.a])],e)}(),y=a("DixL"),T=a("uSSg"),O=a("4b4a"),C=a("wd/R"),E=a("Ungd"),I=function(e,t,a,i){var r,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,i);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(o<3?r(s):o>3?r(t,a,s):r(t,a))||s);return o>3&&s&&Object.defineProperty(t,a,s),s},L=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},_=function(){function e(e,t,a){this.api=e,this.toastr=t,this.utilService=a}return e.prototype.listarSisSucesoTO=function(e,t,a){var i=this;this.api.post("todocompuWS/sistemaWebController/getListaSisSucesoTO",e,a).then(function(e){e&&e.extraInfo?t.despuesDeListarSisSucesoTO(e.extraInfo):(t.despuesDeListarSisSucesoTO([]),i.toastr.warning(e.operacionMensaje,"Aviso"),t.cargando=!1)}).catch(function(e){return i.utilService.handleError(e,t)})},e.prototype.listarSisSusTablaTO=function(e,t,a){var i=this;this.api.post("todocompuWS/sistemaWebController/getListaSisSusTablaTO",e,a).then(function(e){e&&e.extraInfo?t.despuesDeListarSisSusTablaTO(e.extraInfo):(t.despuesDeListarSisSusTablaTO([]),i.toastr.warning(e.operacionMensaje,"Aviso"),t.cargando=!1)}).catch(function(e){return i.utilService.handleError(e,t)})},e.prototype.generarColumnas=function(){return[{headerName:p.a.TAG_SECUENCIA,field:"susSecuencia",width:200},{headerName:p.a.TAG_TABLA,field:"susTabla",width:200},{headerName:p.a.TAG_CLAVE,field:"susClave",width:200},{headerName:p.a.TAG_SUCESOS,field:"susSuceso",width:200},{headerName:p.a.TAG_DETALLE,field:"susDetalle",width:200},{headerName:p.a.TAG_USUARIO,field:"usrCodigo",width:200}]},e=I([Object(i.Injectable)({providedIn:"root"}),L("design:paramtypes",[m.a,h.b,v.a])],e)}(),P=a("GGLN"),M=function(e,t,a,i){var r,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,i);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(o<3?r(s):o>3?r(t,a,s):r(t,a))||s);return o>3&&s&&Object.defineProperty(t,a,s),s},F=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},D=function(){function e(e,t,a,i,r,o,s,n,c){this.route=e,this.toastr=t,this.atajoService=a,this.filasService=i,this.archivoService=r,this.sucesosService=o,this.utilService=s,this.appSistemaService=n,this.sistemaService=c,this.es={},this.listadoSucesosCombo=p.a.LISTA_SUCESOS,this.listadoTablas=[],this.listadoUsuarios=[],this.listadoResultado=[],this.listadoEmpresas=[],this.constantes=p.a,this.filasTiempo=new u.a,this.cargando=!1,this.activar=!1,this.sucesoSelecionado=this.listadoSucesosCombo[0],this.screamXS=!0,this.columnDefs=[],this.columnDefsSelected=[],this.components={},this.filtroGlobal="",this.rowSelection=""}return e.prototype.ngOnInit=function(){this.listadoEmpresas=this.route.snapshot.data.sucesos,this.screamXS=window.innerWidth<p.a.WINDOW_WIDTH_XS,C.locale("es"),this.es=this.utilService.setLocaleDate(),this.empresaSeleccionada=this.utilService.seleccionarEmpresa(this.listadoEmpresas),this.listadoEmpresas&&this.cambiarEmpresaSeleccionada(),this.iniciarAgGrid(),this.generarAtajosTeclado()},e.prototype.cambiarEmpresaSeleccionada=function(){p.a.KEY_EMPRESA_SELECT=this.empresaSeleccionada.empCodigo,this.listarUsuario(),this.listarTablas(),this.obtenerFechaInicioFinMes()},e.prototype.generarAtajosTeclado=function(){},e.prototype.obtenerFechaInicioFinMes=function(){var e=this;this.appSistemaService.getFechaInicioFinMes(this,p.a.KEY_EMPRESA_SELECT).then(function(t){e.fechaDesde=t[0],e.fechaHasta=t[1]}).catch(function(t){return e.utilService.handleError(t,e)})},e.prototype.listarUsuario=function(){this.cargando=!0;var e={empresa:this.empresaSeleccionada.empCodigo};this.sistemaService.listarSisUsuario(e,this,p.a.KEY_EMPRESA_SELECT)},e.prototype.despuesDeListarSisUsuario=function(e){var t=this;this.cargando=!1,this.listadoUsuarios=e,this.listadoUsuarios.length>0?this.usuarioSeleccionado=this.usuarioSeleccionado&&this.usuarioSeleccionado.usrCodigo?this.listadoUsuarios.find(function(e){return e.usrCodigo===t.usuarioSeleccionado.usrCodigo}):this.listadoUsuarios[0]:this.usuarioSeleccionado=null},e.prototype.listarTablas=function(){this.cargando=!0;var e={empresa:this.empresaSeleccionada.empCodigo};this.sucesosService.listarSisSusTablaTO(e,this,p.a.KEY_EMPRESA_SELECT)},e.prototype.despuesDeListarSisSusTablaTO=function(e){var t=this;this.cargando=!1,this.listadoTablas=e,this.listadoTablas.length>0?this.tablaSeleccionada=this.tablaSeleccionada&&this.tablaSeleccionada.susTabla?this.listadoTablas.find(function(e){return e.susTabla===t.tablaSeleccionada.susTabla}):this.listadoTablas[0]:this.tablaSeleccionada=null},e.prototype.buscarSucesos=function(e){if(this.cargando=!0,this.utilService.establecerFormularioTocado(e)&&e&&e.valid){var t={empresa:this.empresaSeleccionada.empCodigo,desde:this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),hasta:this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta),usuario:this.usuarioSeleccionado?this.usuarioSeleccionado.usrCodigo:null,suceso:"TODOS"===this.sucesoSelecionado?"":this.sucesoSelecionado,cadenaGeneral:this.tablaSeleccionada?this.tablaSeleccionada.susTabla:null};this.filasTiempo.iniciarContador(),this.sucesosService.listarSisSucesoTO(t,this,p.a.KEY_EMPRESA_SELECT)}else this.toastr.error(p.a.MSJ_CAMPOS_INVALIDOS,p.a.MSJ_TITULO_INVALIDOS),this.cargando=!1},e.prototype.despuesDeListarSisSucesoTO=function(e){this.cargando=!1,this.filasTiempo.finalizarContador(),this.listadoResultado=e},e.prototype.limpiarResultado=function(){this.listadoResultado=[],this.filasService.actualizarFilas(0,0)},e.prototype.imprimirListadoSucesos=function(){var e=this;if(this.utilService.verificarPermiso(p.a.ACCION_IMPRIMIR,this,!0)){this.cargando=!0;var t={listado:this.listadoResultado};this.archivoService.postPDF("todocompuWS/sistemaWebController/imprimirReporteSucesos",t,this.empresaSeleccionada).then(function(t){t._body.byteLength>0?e.utilService.descargarArchivoPDF("listadoSucesos.pdf",t):e.toastr.warning(p.a.MSJ_ERROR_IMPRIMIR,p.a.MSJ_TITULO_REPORTE),e.cargando=!1}).catch(function(t){return e.utilService.handleError(t,e)})}},e.prototype.exportarSucesos=function(){var e=this;if(this.utilService.verificarPermiso(p.a.ACCION_EXPORTAR,this,!0)){this.cargando=!0;var t={listado:this.listadoResultado,desde:this.utilService.convertirFechaStringDDMMYYYY(this.fechaDesde),hasta:this.utilService.convertirFechaStringDDMMYYYY(this.fechaHasta)};this.archivoService.postExcel("todocompuWS/sistemaWebController/exportarReporteSucesos",t,this.empresaSeleccionada).then(function(t){t?e.utilService.descargarArchivoExcel(t._body,"Sucesos_"):e.toastr.warning("No se encontraron resultados"),e.cargando=!1}).catch(function(t){return e.utilService.handleError(t,e)})}},e.prototype.iniciarAgGrid=function(){this.columnDefs=this.sucesosService.generarColumnas(),this.columnDefsSelected=this.columnDefs.slice(),this.rowSelection="single",this.context={componentParent:this},this.components={}},e.prototype.onGridReady=function(e){this.gridApi=e.api,this.gridColumnApi=e.columnApi,this.actualizarFilas(),this.redimencionarColumnas(),this.seleccionarPrimerFila()},e.prototype.redimencionarColumnas=function(){this.gridApi&&this.gridApi.sizeColumnsToFit()},e.prototype.autoSizeAll=function(){var e=[];this.gridColumnApi.getAllColumns().forEach(function(t){e.push(t.colId)}),this.gridColumnApi.autoSizeColumns(e)},e.prototype.seleccionarPrimerFila=function(){if(this.gridApi){var e=this.gridColumnApi.getAllDisplayedColumns()[0];this.gridApi.setFocusedCell(0,e)}},e.prototype.filtrarRapido=function(){this.gridApi&&this.gridApi.setQuickFilter(this.filtroGlobal)},e.prototype.actualizarFilas=function(){this.filasTiempo.filas=this.gridApi?this.gridApi.getDisplayedRowCount():0,this.filasService.actualizarFilas(this.filasTiempo.filas,this.filasTiempo.getTiempo())},e.prototype.onresize=function(){this.screamXS=window.innerWidth<p.a.WINDOW_WIDTH_XS,this.redimencionarColumnas()},M([Object(i.HostListener)("window:resize",["$event"]),F("design:type",Function),F("design:paramtypes",[]),F("design:returntype",void 0)],e.prototype,"onresize",null),e=M([Object(i.Component)({selector:"app-sucesos",template:a("EzUK"),styles:[a("GzvS")]}),F("design:paramtypes",[o.ActivatedRoute,h.b,b.HotkeysService,S.a,E.a,_,v.a,s.a,P.a])],e)}(),w=function(e,t,a,i){var r,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,i);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(o<3?r(s):o>3?r(t,a,s):r(t,a))||s);return o>3&&s&&Object.defineProperty(t,a,s),s},j=[{path:"",component:l,children:[{path:"perfilFacturacion",component:A,resolve:{perfilFacturacion:y.a,breadcrumb:T.a},runGuardsAndResolvers:"always"},{path:"administracionEmpresa",component:O.a,resolve:{administracionEmpresa:y.a,breadcrumb:T.a},runGuardsAndResolvers:"always"},{path:"sucesos",component:D,resolve:{sucesos:y.a,breadcrumb:T.a},runGuardsAndResolvers:"always"}]}],x=function(){function e(){}return e=w([Object(i.NgModule)({imports:[o.RouterModule.forChild(j)],exports:[o.RouterModule]})],e)}(),N=function(e,t,a,i){var r,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,i);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(o<3?r(s):o>3?r(t,a,s):r(t,a))||s);return o>3&&s&&Object.defineProperty(t,a,s),s},U=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},G=function(){function e(){}return e.prototype.ngOnInit=function(){},e=N([Object(i.Component)({selector:"app-periodo",template:a("PYKW"),styles:[a("rOHK")]}),U("design:paramtypes",[])],e)}();a.d(t,"SistemaModule",function(){return B});var Y=function(e,t,a,i){var r,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,i);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(o<3?r(s):o>3?r(t,a,s):r(t,a))||s);return o>3&&s&&Object.defineProperty(t,a,s),s},B=function(){function e(){}return e=Y([Object(i.NgModule)({imports:[r.a,x],declarations:[l,G,A,D],exports:[],providers:[]})],e)}()},AxcS:function(e,t){e.exports='<div class="row">\r\n  <div [ngClass]="{\'sr-only\':activar}" class="col-lg-3 col-md-4 col-sm-5">\r\n    \x3c!--Card Filtro--\x3e\r\n    <div class="card mb-2">\r\n      <div class="card-header">\r\n        <i class=" {{constantes.ICON_FILTRAR}}"></i>\r\n        <b>{{constantes.TITULO_FILTROS}}</b>\r\n      </div>\r\n      <div class="card-body pb-0 pt-1">\r\n        <form #frmPerfilFacturacion="ngForm" autocomplete="off">\r\n          <div class="form-group form-group-sm">\r\n            <label class="control-label">\r\n              <b>{{constantes.TAG_EMPRESA}}</b>\r\n            </label>\r\n            <select [(ngModel)]="empresaSeleccionada" class="form-control input-sm" name="empresaSeleccionada" [disabled]="deshabilitarOpciones"\r\n              (change)="cambiarempresaSeleccionada();" required>\r\n              <option selected disabled value="">{{constantes.TAG_SELECCIONE}}</option>\r\n              <option [ngValue]="empresa" *ngFor="let empresa of listaEmpresas">{{empresa.empNombre}} ({{empresa.empCodigo}})</option>\r\n            </select>\r\n          </div>\r\n        </form>\r\n      </div>\r\n      <div class="card-footer" *ngIf="!deshabilitarOpciones">\r\n        <div class="text-right">\r\n          <button id="btnBuscar" type="button" class="btn btn-sm btn-primary mr-1" (click)="buscarPerfilFacturacion()" title="{{constantes.ATAJO_BUSCAR}}"\r\n            [disabled]="!frmPerfilFacturacion.form.valid">\r\n            <i class="{{constantes.ICON_BUSCAR}}" aria-hidden="true"></i> {{constantes.LABEL_BUSCAR}}</button>\r\n          <button id="btnNuevo" class="btn btn-sm btn-primary" type="button" (click)="nuevoPerfilFacturacion()" [disabled]="!frmPerfilFacturacion.form.valid || !empresaSeleccionada.listaSisPermisoTO.gruCrear"\r\n            title="{{constantes.ATAJO_NUEVO}}">\r\n            <i class="{{constantes.ICON_NUEVO}}" aria-hidden="true"></i> {{constantes.LABEL_NUEVO}}</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div [ngClass]="{\'col-lg-9 col-md-8 col-sm-7\':!activar,\'col-lg-12 col-md-12 col-sm-12\':activar}">\r\n    <app-perfil-facturacion-listado [hidden]="!vistaListado" [parametrosBusqueda]="busquedaListado" [empresaSeleccionada]="empresaSeleccionada"\r\n      [operacion]="operacionListado" (enviarCancelar)="cancelar()" (enviarActivar)="cambiarActivar($event)"></app-perfil-facturacion-listado>\r\n    <app-perfil-facturacion-formulario *ngIf="dataFormularioPerfil" [data]="dataFormularioPerfil" [empresaSeleccionada]="empresaSeleccionada"\r\n      (enviarCancelar)="cancelarFormulario()" (enviarActivar)="cambiarActivar($event)" (enviarLista)="accionLista($event)"></app-perfil-facturacion-formulario>\r\n  </div>\r\n</div>\r\n<div *ngIf="cargando">\r\n  <app-cargando></app-cargando>\r\n</div>'},BFiK:function(e,t){e.exports='<div class="row" *ngIf="showIndex">\r\n    <div class="col-lg-5 col-md-4 pt-5">\r\n        <h1 class="text-center">Lo m\xe1s usado:</h1>\r\n        <div class="form-group form-group-sm text-center" *ngFor="let acceso of listaAccesoRapido">\r\n            <a routerLink="{{acceso.url}}" *ngIf="acceso.mostrar">\r\n                <button type="button" class="btn btn-primary btn-ancho-250"> {{acceso.item}}</button>\r\n            </a>\r\n        </div>\r\n    </div>\r\n    <div class="col-lg-7 col-md-8">\r\n        <div class="text-center">\r\n            <img src="assets/images/configuracionSistema.png" class="img-thumbnail">\r\n        </div>\r\n    </div>\r\n</div>\r\n<router-outlet></router-outlet>'},EzUK:function(e,t){e.exports='<div class="row">\r\n  <div [ngClass]="{\'sr-only\':activar}" class="col-lg-3 col-md-4 col-sm-5">\r\n    <div class="card m-0 mb-2">\r\n      <div class="card-header">\r\n        <i class="{{constantes.ICON_FILTRAR}}"></i>\r\n        <b>{{constantes.TITULO_FILTROS}}</b>\r\n      </div>\r\n      <div class="card-body pb-0 pt-1">\r\n        \x3c!--FORMULARIO EMPRESA--\x3e\r\n        <form #frm=\'ngForm\' name="frm" autocomplete="off">\r\n          <div class="form-group form-group-sm">\r\n            <label class="control-label">\r\n              <b>{{constantes.TAG_EMPRESA}}</b>\r\n            </label>\r\n            <select class="form-control form-control-sm" name="empresa" required [(ngModel)]="empresaSeleccionada" (ngModelChange)="cambiarEmpresaSeleccionada()">\r\n              <option selected disabled value="">{{constantes.TAG_SELECCIONE}}</option>\r\n              <option [ngValue]="empresa" *ngFor="let empresa of listadoEmpresas"> {{empresa.empNombre}} ({{empresa.empCodigo}})</option>\r\n            </select>\r\n          </div>\r\n\r\n          <div class="form-group form-group-sm has-feedback">\r\n            <label class="control-label">\r\n              <strong>{{constantes.TAG_USUARIO}}</strong>\r\n              &nbsp;\r\n              <a (click)="listarUsuario()">\r\n                <span class="{{constantes.ICON_REFRESCAR}}" placement="top" ngbTooltip="{{constantes.MSJ_RECARGAR}}" container="body"></span>\r\n              </a>\r\n            </label>\r\n            <p-dropdown [options]="listadoUsuarios" name="usuario" [showClear]="true" [(ngModel)]="usuarioSeleccionado" (ngModelChange)="limpiarResultado()"\r\n              placeholder="{{constantes.TAG_TODOS}}" optionLabel="usrNombre" optionLabel="usrNombre">\r\n              <ng-template let-item pTemplate="selectedItem">\r\n                {{usuarioSeleccionado?.usrNombre}} ( {{usuarioSeleccionado?.usrCodigo}})\r\n              </ng-template>\r\n              <ng-template let-fs pTemplate="item">\r\n                <div> {{fs.value.usrNombre}} ({{fs.value.usrCodigo}})</div>\r\n              </ng-template>\r\n            </p-dropdown>\r\n          </div>\r\n\r\n          <div class="form-group form-group-sm has-feedback">\r\n            <label class="control-label">\r\n              <strong>{{constantes.TAG_TABLA}}</strong>\r\n              &nbsp;\r\n              <a (click)="listarTablas()">\r\n                <span class="{{constantes.ICON_REFRESCAR}}" placement="top" ngbTooltip="{{constantes.MSJ_RECARGAR}}" container="body"></span>\r\n              </a>\r\n            </label>\r\n            <p-dropdown [options]="listadoTablas" name="tabla" [showClear]="true" [(ngModel)]="tablaSeleccionada" (ngModelChange)="limpiarResultado()"\r\n              placeholder="{{constantes.TAG_TODOS}}" optionLabel="susTabla" optionLabel="susTabla">\r\n              <ng-template let-item pTemplate="selectedItem">\r\n                {{tablaSeleccionada?.susTabla}}\r\n              </ng-template>\r\n              <ng-template let-fs pTemplate="item">\r\n                <div> {{fs.value.susTabla}}</div>\r\n              </ng-template>\r\n            </p-dropdown>\r\n          </div>\r\n\r\n\r\n          <div class="form-group form-group-sm">\r\n            <label class="control-label">\r\n              <b>{{constantes.TAG_SUCESOS}}</b>\r\n            </label>\r\n            <select class="form-control form-control-sm" name="suceso" required [(ngModel)]="sucesoSelecionado" (ngModelChange)="limpiarResultado()">\r\n              <option [ngValue]="suc" *ngFor="let suc of listadoSucesosCombo"> {{suc}}</option>\r\n            </select>\r\n          </div>\r\n\r\n          <div class="form-group form-group-sm">\r\n            <label class="control-label">\r\n              <b>{{constantes.TAG_FECHA_DESDE}}</b>\r\n            </label>\r\n            <p-calendar inputId="fechaDesde" name="fechaDesde" [(ngModel)]="fechaDesde" (ngModelChange)="limpiarResultado()" dateFormat="dd/mm/yy"\r\n              [locale]="es" [showIcon]="true" [maxDate]="fechaHasta" [appMaxDate]="fechaHasta" [required]="true"></p-calendar>\r\n          </div>\r\n          <div class="form-group form-group-sm">\r\n            <label class="control-label">\r\n              <b>{{constantes.TAG_FECHA_HASTA}}</b>\r\n            </label>\r\n            <p-calendar inputId="fechaHasta" name="fechaHasta" [(ngModel)]="fechaHasta" (ngModelChange)="limpiarResultado()" dateFormat="dd/mm/yy"\r\n              [locale]="es" [showIcon]="true" [minDate]="fechaDesde" [appMinDate]="fechaDesde" [required]="true"></p-calendar>\r\n          </div>\r\n\r\n        </form>\r\n      </div>\r\n      <div class="card-footer text-muted">\r\n        <div class="text-right">\r\n          <button type="button" class="btn btn-sm btn-primary" id="btnBuscarSucesos" (click)="buscarSucesos(frm)">\r\n            <i class="{{constantes.ICON_BUSCAR}}" aria-hidden="true"></i> {{constantes.LABEL_BUSCAR}}</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div [ngClass]="{\'col-lg-9 col-md-8 col-sm-7\':!activar,\'col-lg-12 col-md-12 col-sm-12\':activar}">\r\n    <div class="card m-0" *ngIf="listadoResultado?.length>0">\r\n\r\n      <div class="card-header p-1">\r\n        <button id="btnActivarDiarioAuxiliar" class="btn btn-sm btn-primary mr-1" *ngIf="!screamXS" (click)="activar=!activar" type="button"\r\n          title="{{constantes.ATAJO_MOSTRAR_OCULTAR_FILTROS}}">\r\n          <i class="{{activar?constantes.ICON_MOSTRAR_FILTRO:constantes.ICON_OCULTAR_FILTRO}}" aria-hidden="true"></i>\r\n        </button>\r\n        <strong>{{constantes.SUCESOS_LISTADO}}</strong>\r\n        <div class="card-header-actions">\r\n          <div class="btn-group d-lg-none">\r\n            <button type="button" class="btn btn-sm btn-primary mr-1" id="btnImprimirListadoSucesos" (click)="imprimirListadoSucesos()"\r\n              placement="top" ngbTooltip="{{constantes.LABEL_IMPRIMIR}}" container="body" title="{{constantes.ATAJO_IMPRIMIR}}">\r\n              <i class="{{constantes.ICON_IMPRIMIR}}" aria-hidden="true"></i>\r\n            </button>\r\n            <button type="button" class="btn btn-sm btn-primary mr-1" id="btnExportarSucesos" (click)="exportarSucesos()" placement="top"\r\n              ngbTooltip="{{constantes.LABEL_EXPORTAR}}" container="body" title="{{constantes.ATAJO_EXPORTAR}}">\r\n              <i class="{{constantes.ICON_EXPORTAR}}" aria-hidden="true"></i>\r\n            </button>\r\n          </div>\r\n          <div class="btn-group d-none d-lg-block">\r\n            <button type="button" class="btn btn-sm btn-primary mr-1" id="btnImprimirListadoSucesos" (click)="imprimirListadoSucesos()"\r\n              placement="top" ngbTooltip="{{constantes.LABEL_IMPRIMIR}}" container="body" title="{{constantes.ATAJO_IMPRIMIR}}">\r\n              <i class="{{constantes.ICON_IMPRIMIR}}" aria-hidden="true"></i> {{constantes.LABEL_IMPRIMIR}}\r\n            </button>\r\n            <button type="button" class="btn btn-sm btn-primary mr-1" id="btnExportarSucesos" (click)="exportarSucesos()" placement="top"\r\n              ngbTooltip="{{constantes.LABEL_EXPORTAR}}" container="body" title="{{constantes.ATAJO_EXPORTAR}}">\r\n              <i class="{{constantes.ICON_EXPORTAR}}" aria-hidden="true"></i> {{constantes.LABEL_EXPORTAR}}\r\n            </button>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n      <div class="card-body" style="padding: 0 0 0 0">\r\n        <div class="row">\r\n          <div class="col-sm-5 col-md-6">\r\n            <div class="input-group p-1">\r\n              <input type="text" [(ngModel)]="filtroGlobal" (input)="filtrarRapido()" class="form-control form-control-sm input-filter mousetrap"\r\n                size="100" style="font-family: Arial, FontAwesome;" placeholder="&#xf0b0; {{constantes.TAG_FILTRAR}}..." size="100">\r\n              <div class="input-group-append">\r\n                <span class="input-group-text">\r\n                  <i class="{{constantes.ICON_BUSCAR}}"></i>\r\n                </span>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class="col-sm-7 col-md-6">\r\n            <div class="float-right pr-1">\r\n              <p-multiSelect [options]="columnDefs" [(ngModel)]="columnDefsSelected" optionLabel="headerName" maxSelectedLabels="1" selectedItemsLabel="{0} {{constantes.MSJ_COLUMNAS}}"\r\n                defaultLabel="{{constantes.TAG_SELECCIONE}}"></p-multiSelect>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        \x3c!--195px--\x3e\r\n        <ag-grid-angular #agGrid id="agGrid" style="width: 100%; height: calc(100vh - 203px);" class="ag-theme-balham" [rowData]="listadoResultado"\r\n          [columnDefs]="columnDefsSelected" [enableSorting]="true" [multiSortKey]="multiSortKey" [rowSelection]="rowSelection"\r\n          [enableColResize]="true" [components]="components" [context]="context" (gridReady)="onGridReady($event)" (filterChanged)="actualizarFilas()"\r\n          (gridColumnsChanged)="redimencionarColumnas()" [frameworkComponents]="frameworkComponents">\r\n        </ag-grid-angular>\r\n\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n<div *ngIf="cargando">\r\n  <app-cargando></app-cargando>\r\n</div>'},GzvS:function(e,t){e.exports=""},PYKW:function(e,t){e.exports="<p>\r\n  periodo works!\r\n</p>\r\n"},rOHK:function(e,t){e.exports=""},wCVJ:function(e,t){e.exports=""}}]);