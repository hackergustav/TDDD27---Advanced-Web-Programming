import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

    constructor(private authService: AuthService, public router: Router) { }

    ngOnInit() {
        this.authService.handleLoginCallback();
        this.authService.loggedIn = true;
    }

}
