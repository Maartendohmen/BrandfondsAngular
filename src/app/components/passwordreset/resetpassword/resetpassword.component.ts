import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationControllerService } from 'src/app/api/services';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  public newPasswordForm: FormGroup;

  passwordtoken = '';

  error = '';
  submitted = false;
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthenticationControllerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.passwordtoken = params['link'];
      this.authService.checkPasswordResetLinkUsingGET(this.passwordtoken).subscribe(active => {

      }, error => {
        this.router.navigateByUrl('/');
        this.alertService.danger(error.error.message);
      });
    })

    this.newPasswordForm = this.formBuilder.group({
      password_input: ['', Validators.required],
      passwordconformation_input: ['', Validators.required]
    });


  }

  get f() {
    return this.newPasswordForm.controls;
  }

  onSubmitPassword() {

    if (this.f.password_input.value == this.f.passwordconformation_input.value) {
      this.authService.changePasswordUsingPOST({ randomstring: "password", password: "sdaf" }).subscribe(data => {
        this.alertService.success('Het wachtwoord is veranderd, je wordt nu teruggebracht naar het inlogscherm')

        setTimeout(() => {
          this.router.navigate(['']);
        },
          5000);
      },
        error => {
          this.loading = false;
          this.alertService.warning(error.error.message)
        });
    } else {
      this.alertService.warning('Zorg dat in beide velden hetzelfde wachtwoord staat')
    }



  }

}
