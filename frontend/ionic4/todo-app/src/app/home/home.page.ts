import { Component, OnInit } from '@angular/core';
import { PACKAGE_VERSION } from '../../../version';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  version  = PACKAGE_VERSION;
  constructor( ) { }
  ngOnInit() { }
}
