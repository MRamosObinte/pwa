import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-chat',
  template: `
    <div #script style.display="none">
      <ng-content></ng-content>
    </div>
  `
})
export class ChatComponent {

  @Input()
  src: string;

  @Input()
  type: string;

  @ViewChild('script') script: ElementRef;

  convertToScript() {
    var element = this.script.nativeElement;
    var script = document.createElement("script");
    script.type = this.type ? this.type : "text/javascript";
    if (this.src) {
      script.src = this.src;
    }
    if (element.innerHTML) {
      script.innerHTML = element.innerHTML;
    }
    var parent = element.parentElement;
    parent.parentElement.replaceChild(script, parent);
  }

  ngAfterViewInit() {
    this.convertToScript();
  }

}
