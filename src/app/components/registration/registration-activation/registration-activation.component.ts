import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "@full-fledged/alerts";
import { AuthenticationControllerService } from "src/app/api/services";

@Component({
  selector: "app-registration-activation",
  templateUrl: "./registration-activation.component.html",
  styleUrls: ["./registration-activation.component.css"],
})
export class RegistrationActivationComponent implements OnInit {
  doneloading = false;
  userid = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    protected authService: AuthenticationControllerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.userid = params["userid"];

      this.authService
        .setUserActivation({ id: this.userid, isActivated: true })
        .subscribe(
          (data) => {
            this.doneloading = true;

            setTimeout(() => {
              this.router.navigate([""]);
            }, 7000);
          },
          (error) => {
            if (error.status == 404) {
              this.router.navigateByUrl("/");
              this.alertService.danger(
                "De gebruiker die je wilt activeren staat niet meer in het systeem"
              );
            } else {
              this.alertService.danger(error.error.message);
            }
          }
        );
    });
  }
}
