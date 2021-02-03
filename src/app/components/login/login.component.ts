import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '@full-fledged/alerts';
import { TitleCasePipe } from '@angular/common';
import { AuthenticationControllerService } from 'src/app/api/services';
import { AuthenticationRequest } from 'src/app/api/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  submitted = false;
  loading = false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private authservice: AuthenticationControllerService,
    private titlecasePipe: TitleCasePipe,
    private alertService: AlertService) { }

  LogIn(e) {
    this.router.navigateByUrl('main');
  }

  ngOnInit() {
    localStorage.clear();

    this.loginForm = this.formBuilder.group({
      forname_input: ['', Validators.required],
      password_input: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmitLogin() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    var username = this.titlecasePipe.transform(this.f.forname_input.value);
    var password = this.f.password_input.value;

    this.loading = true;

    this.authservice.login({ username, password })
      .pipe(first())
      .subscribe(
        authresponse => {
          if (authresponse != null) {

            localStorage.setItem('current_user', JSON.stringify(authresponse.user));
            localStorage.setItem('jwt_token', JSON.stringify(authresponse.jwt))

            if (authresponse.user.userRole == 'BRANDMASTER') {
              this.router.navigateByUrl('admin')
            }
            else {
              this.router.navigateByUrl('main');
            }

          }
        },
        error => {

          this.alertService.danger(error.error.message);

          this.loading = false;
        });
  }

  Register() {
    this.router.navigateByUrl('register');
  }

  ForgotPassword() {
    this.router.navigateByUrl('resetpasswordrequest');
  }
}
