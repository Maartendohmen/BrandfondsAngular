import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertService } from "@full-fledged/alerts";
import { TitleCasePipe } from "@angular/common";
import { AuthenticationControllerService } from "src/app/api/services";
import { User } from "src/app/api/models";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;

  error = "";
  submitted = false;
  loading = false;
  verificationCode = null;

  constructor(
    private authService: AuthenticationControllerService,
    private formBuilder: FormBuilder,
    private titlecasePipe: TitleCasePipe,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      usermail_input: ["", Validators.required],
      forename_input: ["", Validators.required],
      surname_input: ["", Validators.required],
      password_input: ["", Validators.required],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmitRegister() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const registerUser: User = {
      mailadres: this.f.usermail_input.value,
      forename: this.titlecasePipe.transform(this.f.forename_input.value),
      surname: this.titlecasePipe.transform(this.f.surname_input.value),
      password: this.f.password_input.value,
    };

    this.authService.register(registerUser).subscribe(
      (response) => {
        this.alertService.success(
          "Check je mail om je registratie te voltooien"
        );
      },
      (error) => {
        if (error.status == 409) {
          this.alertService.danger(
            "Er bestaat al een gebruiker met dit mailadres"
          );
        } else {
          this.alertService.danger(error.error.message);
        }
        this.loading = false;
      }
    );
  }
}
