import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

import { AuthData } from "./auth-data.model";

import { TrainingService } from "../training/training.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UIService } from "../shared/ui.service";

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;;

    constructor(
        private router: Router,
        private authService: AngularFireAuth,
        private trainingService: TrainingService,
        private snackbar: MatSnackBar,
        private uiService: UIService
    ) { }

    initAuthListener() {
        this.authService.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;

            }
        });
    }

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChange.next(true);
        this.authService.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChange.next(false);
                console.log(result);

            })
            .catch(err => {
                this.uiService.loadingStateChange.next(false);
                this.uiService.showSnakbar(err.message, null, 3000);

            })

    }

    login(authData: AuthData) {
        this.uiService.loadingStateChange.next(true);
        this.authService.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChange.next(false);
                console.log(result);

            })
            .catch(err => {
                this.uiService.loadingStateChange.next(false);
                this.uiService.showSnakbar(err.message, null, 3000);

            })

    }

    logout() {

        this.authService.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }



}