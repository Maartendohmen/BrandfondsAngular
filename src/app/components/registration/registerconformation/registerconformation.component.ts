import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "@full-fledged/alerts";
import { AuthenticationControllerService } from "src/app/api/services";

@Component({
  selector: "app-registerconformation",
  templateUrl: "./registerconformation.component.html",
  styleUrls: ["./registerconformation.component.css"],
})
export class RegisterconformationComponent implements OnInit {
  doneloading = false;
  registertoken = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    protected authService: AuthenticationControllerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.registertoken = params["link"];

      this.authService.registerConformation(this.registertoken).subscribe(
        (response) => {
          this.doneloading = true;

          setTimeout(() => {
            this.router.navigate([""]);
          }, 7000);
        },
        (error) => {
          if (error.status == 404) {
            this.router.navigateByUrl("/");
            this.alertService.danger(
              "De gebruikte link is ongeldig of verlopen"
            );
          } else {
            this.alertService.danger(error.error.message);
          }
        }
      );
    });
  }
}
