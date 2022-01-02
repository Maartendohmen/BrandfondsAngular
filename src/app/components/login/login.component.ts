import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AlertService } from "@full-fledged/alerts";
import { AuthenticationControllerService } from "src/app/api/services";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  submitted = false;
  loading = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authservice: AuthenticationControllerService,
    private alertService: AlertService
  ) {}

  LogIn(e) {
    this.router.navigateByUrl("main");
  }

  ngOnInit() {
    localStorage.clear();

    this.loginForm = this.formBuilder.group({
      usermail_input: ["", Validators.required],
      password_input: ["", Validators.required],
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

    var mailadres: string = this.f.usermail_input.value.toLowerCase();
    var password: string = this.f.password_input.value;

    this.loading = true;

    this.authservice
      .login({ mailadres, password })
      .pipe(first())
      .subscribe(
        (authresponse) => {
          if (authresponse != null) {
            localStorage.setItem(
              "current_user",
              JSON.stringify(authresponse.user)
            );
            localStorage.setItem("jwt_token", JSON.stringify(authresponse.jwt));

            if (authresponse.user.userRole == "BRANDMASTER") {
              this.router.navigateByUrl("admin");
            } else {
              this.router.navigateByUrl("main");
            }
          }
        },
        (error) => {
          if (error.status == 404) {
            this.alertService.danger(
              "De gebruikersnaam of wachtwoord is incorrect"
            );
          } else {
            this.alertService.danger(error.error.message);
          }
          this.loading = false;
        }
      );
  }

  Register() {
    this.router.navigateByUrl("register");
  }

  ForgotPassword() {
    this.router.navigateByUrl("resetpasswordrequest");
  }
}
