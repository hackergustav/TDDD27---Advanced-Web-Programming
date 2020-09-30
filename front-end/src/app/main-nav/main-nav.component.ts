import { Component } from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  opened: boolean;
  constructor(public authService: AuthService) {}
}
