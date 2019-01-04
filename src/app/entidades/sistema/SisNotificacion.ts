export class SisNotificacion {

    id: number = 0;
    mailEmisor: string = "";
    mailPasswordEmisor: string = "";
    mailSmtpHost: string = "";
    mailSmtpPort: string = "";
    mailSmtpUserName: string = "";
    mailSmtpPassword: string = "";
    mailSmtpSslTrust: string = "";
    mailSmtpAuth: boolean = false;
    mailSmtpStartTlsEnable: boolean = false;
    mailReceptor: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.mailEmisor = data.mailEmisor ? data.mailEmisor : this.mailEmisor;
        this.mailPasswordEmisor = data.mailPasswordEmisor ? data.mailPasswordEmisor : this.mailPasswordEmisor;
        this.mailSmtpHost = data.mailSmtpHost ? data.mailSmtpHost : this.mailSmtpHost;
        this.mailSmtpPort = data.mailSmtpPort ? data.mailSmtpPort : this.mailSmtpPort;
        this.mailSmtpUserName = data.mailSmtpUserName ? data.mailSmtpUserName : this.mailSmtpUserName;
        this.mailSmtpPassword = data.mailSmtpPassword ? data.mailSmtpPassword : this.mailSmtpPassword;
        this.mailSmtpSslTrust = data.mailSmtpSslTrust ? data.mailSmtpSslTrust : this.mailSmtpSslTrust;
        this.mailSmtpAuth = data.mailSmtpAuth ? data.mailSmtpAuth : this.mailSmtpAuth;
        this.mailSmtpStartTlsEnable = data.mailSmtpStartTlsEnable ? data.mailSmtpStartTlsEnable : this.mailSmtpStartTlsEnable;
        this.mailReceptor = data.mailReceptor ? data.mailReceptor : this.mailReceptor;
    }

}