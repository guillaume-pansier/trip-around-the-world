import { Directive, Input, ElementRef, Inject } from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective {

  @Input()
  focus: boolean;
  constructor( @Inject(ElementRef) private element: ElementRef) { }


  setFocus() {
      this.element.nativeElement.focus();
    }

}
