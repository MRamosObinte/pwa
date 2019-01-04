import { ES } from "./local-es";
import { EN } from "./local-en";

export class Languages {

    public static setLanguage(idioma: string): void {
        switch (idioma) {
            case "es": {
                ES.traducir();
                break;
            }
            case "en": {
                EN.traducir();
                break;
            }
            default: {
                
            }
        }
    }

}