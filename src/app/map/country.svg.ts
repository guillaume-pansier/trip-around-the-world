import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Country } from '../model/country/country';


export const STYLE_CLASS_NORMAL = 'landxx';
export const STYLE_CLASS_HOVER = 'landxxHover';
export const STYLE_CLASS_VISITED = 'visited';


@Component({
  selector: 'g',
  template: '<a [outerHTML]="xml"></a>',
  styleUrls: ['map.svg.css']
})
export class CountrySVGComponent implements OnInit {

  @Input() country: Country;
  xml: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.xml = this.sanitizer.bypassSecurityTrustHtml(this.country.pathSvgFormat);
  }

}


