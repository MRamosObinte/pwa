import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, URLSearchParams, RequestMethod, ResponseContentType } from '@angular/http';
import { AppConfig } from './app-config';
import { ObjetoJWT } from './api-request.service';
import { UsuarioEmpresaReporteTO } from '../entidadesTO/UsuarioReporte/UsuarioEmpresaReporteTO';
import { LS } from '../constantes/app-constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private responseContentType: ResponseContentType;
  private almacenamiento: Storage = localStorage;
  private usuarioEmpresa: UsuarioEmpresaReporteTO;

  constructor(
    private appConfig: AppConfig,
    private http: Http,
    private auth: AuthService
  ) {
    this.responseContentType = ResponseContentType.ArrayBuffer;
    this.usuarioEmpresa = new UsuarioEmpresaReporteTO();
  }

  appendAuthHeader(): Headers {
    let headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8' });
    let objJWT: ObjetoJWT = JSON.parse(this.almacenamiento.getItem(LS.KEY_CURRENT_USER));
    if (objJWT !== null) {
      let token = objJWT.token;
      if (token !== null) {
        headers.append("Authorization", token);
      }
    }
    return headers;
  }

  getRequestOptions(requestMethod, url: string, empresa: string, urlParam?: URLSearchParams, body?: Object): RequestOptions {
    let options = new RequestOptions({
      headers: this.appendAuthHeader(),
      method: requestMethod,
      url: this.appConfig.baseApiPath + url,
      responseType: this.responseContentType
    });
    if (urlParam) {
      options = options.merge({ params: urlParam });
    }
    if (body) {
      body["sisInfoTO"] = JSON.parse(localStorage.getItem(LS.KEY_SISINFOTO));
      body["sisInfoTO"] ? body["sisInfoTO"].empresa = empresa : null;
      options = options.merge({ body: JSON.stringify(body) });
    }
    return options;
  }

  postTxt(url: string, parametro: Object, empresaSelect: any): Promise<any> {
    let codigoEmpresa = "";
    this.completarInformacionReporte(parametro, empresaSelect, codigoEmpresa);
    let requestOptions = this.getRequestOptions(RequestMethod.Post, url, codigoEmpresa, undefined, parametro);
    return this.http.request(new Request(requestOptions))
      .toPromise()
      .catch(err => this.handleError(err));
  }
  postExcel(url: string, parametro: Object, empresaSelect: any): Promise<any> {
    let codigoEmpresa = "";
    this.completarInformacionReporte(parametro, empresaSelect, codigoEmpresa);
    let requestOptions = this.getRequestOptions(RequestMethod.Post, url, codigoEmpresa, undefined, parametro);
    return this.http.request(new Request(requestOptions))
      .toPromise()
      .catch(err => this.handleError(err));
  }

  postPDF(url: string, parametro: Object, empresaSelect: any): Promise<any> {
    let codigoEmpresa = "";
    this.completarInformacionReporte(parametro, empresaSelect, codigoEmpresa);
    let requestOptions = this.getRequestOptions(RequestMethod.Post, url, codigoEmpresa, undefined, parametro);
    return this.http.request(new Request(requestOptions))
      .toPromise()
      .catch(err => this.handleError(err));
  }

  postZip(url: string, parametro: Object, empresaSelect: any): Promise<any> {
    let codigoEmpresa = "";
    this.completarInformacionReporte(parametro, empresaSelect, codigoEmpresa);
    let requestOptions = this.getRequestOptions(RequestMethod.Post, url, codigoEmpresa, undefined, parametro);
    return this.http.request(new Request(requestOptions))
      .toPromise()
      .catch(err => this.handleError(err));
  }

  appendAuthHeaderFile(): Headers {
    let headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    let objJWT: ObjetoJWT = JSON.parse(this.almacenamiento.getItem(LS.KEY_CURRENT_USER));
    if (objJWT !== null) {
      let token = objJWT.token;
      if (token !== null) {
        headers.append("Authorization", token);
      }
    }
    return headers;
  }

  getRequestOptionsFile(requestMethod, url: string, empresa: string, urlParam?: URLSearchParams, body?: Object): RequestOptions {
    let options = new RequestOptions({
      headers: this.appendAuthHeaderFile(),
      method: requestMethod,
      url: this.appConfig.baseApiPath + url,
      responseType: this.responseContentType
    });
    if (urlParam) {
      options = options.merge({ params: urlParam });
    }
    if (body) {
      body["sisInfoTO"] = JSON.parse(localStorage.getItem(LS.KEY_SISINFOTO));
      body["sisInfoTO"] ? body["sisInfoTO"].empresa = empresa : null;
      options = options.merge({ body: JSON.stringify(body) });
    }
    return options;
  }

  postFile(url: string, parametro: Object, empresaSelect: any): Promise<any> {
    let codigoEmpresa = "";
    this.completarInformacionReporte(parametro, empresaSelect, codigoEmpresa);
    let requestOptions = this.getRequestOptionsFile(RequestMethod.Post, url, codigoEmpresa, undefined, parametro);
    return this.http.request(new Request(requestOptions))
      .toPromise()
      .catch(err => this.handleError(err));
  }

  completarInformacionReporte(parametro, empresaSelect, codigoEmpresa) {
    if (empresaSelect) {
      codigoEmpresa = empresaSelect.empCodigo;
      this.usuarioEmpresa.empCodigo = codigoEmpresa;
      this.usuarioEmpresa.empDireccion = empresaSelect.empDireccion;
      this.usuarioEmpresa.empNombre = empresaSelect.empNombre;
      this.usuarioEmpresa.empRazonSocial = empresaSelect.empRazonSocial;
      this.usuarioEmpresa.empRuc = empresaSelect.empRuc;
      this.usuarioEmpresa.usrNick = this.auth.getUserName();
      this.usuarioEmpresa.empTelefono = empresaSelect.empTelefono;
    }
    if (parametro) {
      parametro['usuarioEmpresaReporteTO'] = this.usuarioEmpresa;
    }
  }

  handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
