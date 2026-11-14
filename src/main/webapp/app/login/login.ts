import { AfterViewInit, Component, ElementRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AccountService } from 'app/core/auth';
import { LoginOAuth2Service } from 'app/login/login-oauth2.service';
import { LoginService } from 'app/login/login.service';
import { SignInService } from 'app/login/sign-in.service';

@Component({
  selector: 'jhi-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export default class Login implements OnInit, AfterViewInit {
  readonly username = viewChild.required<ElementRef>('username');

  readonly authenticationError = signal(false);

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
  });

  private readonly accountService = inject(AccountService);
  private readonly loginService = inject(LoginService);
  private readonly loginOAuth2Service = inject(LoginOAuth2Service);
  private readonly signInService = inject(SignInService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // with the oauth2 profile, users sign in at the identity provider and this form cannot work
    this.signInService.usesOAuth2().subscribe(oauth2 => {
      if (oauth2) {
        this.loginOAuth2Service.login();
      }
    });
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.username().nativeElement.focus();
  }

  login(): void {
    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.authenticationError.set(false);
        if (!this.router.currentNavigation()) {
          // There were no routing during login (eg from navigationToStoredUrl)
          this.router.navigate(['']);
        }
      },
      error: () => this.authenticationError.set(true),
    });
  }
}
