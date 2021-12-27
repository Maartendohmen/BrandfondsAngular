import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertService } from "@full-fledged/alerts";
import { AuthenticationControllerService } from "src/app/api/services";

@Component({
  selector: "app-resetpasswordrequest",
  templateUrl: "./resetpasswordrequest.component.html",
  styleUrls: ["./resetpasswordrequest.component.css"],
})
export class ResetpasswordrequestComponent implements OnInit {
  public forgotPasswordForm: FormGroup;

  error = "";
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private authService: AuthenticationControllerService
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      usermail_input: ["", Validators.required],
    });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmitConfirm() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService
      .resetPasswordRequest(this.f.usermail_input.value)
      .subscribe(
        (data) => {
          this.alertService.success(
            "Er is een mail naar je verstuurd met verdere instructies"
          );
        },
        (error) => {
          this.loading = false;

          if (error.error.message) {
            this.alertService.danger(error.error.message);
          }
        }
      );
  }
}
