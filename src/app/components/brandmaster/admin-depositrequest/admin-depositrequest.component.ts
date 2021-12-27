import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AlertService } from "@full-fledged/alerts";
import { DepositRequest } from "src/app/api/models";
import { UserControllerService } from "src/app/api/services";

@Component({
  selector: "app-admin-depositrequest",
  templateUrl: "./admin-depositrequest.component.html",
  styleUrls: ["./admin-depositrequest.component.css"],
})
export class AdminDepositrequestComponent implements OnInit {
  @Input() alldepositrequests: DepositRequest[];
  @Output() RefreshListOfDeposits = new EventEmitter<any>();
  @Output() RefreshListOfUsers = new EventEmitter<any>();

  constructor(
    private alertService: AlertService,
    private userService: UserControllerService
  ) {}

  ngOnInit() {}

  RejectDepositRequest(depositRequestid: number) {
    this.userService
      .setDepositStatus({ id: depositRequestid, approve: false })
      .subscribe(
        () => {
          this.RefreshListOfDeposits.emit();
          this.alertService.success("De inleg is afgekeurd");
        },
        (error) => {
          this.alertService.danger(error.error.message);
        }
      );
  }

  AcceptRepositRequest(depositRequestid: number) {
    this.userService
      .setDepositStatus({ id: depositRequestid, approve: true })
      .subscribe(
        () => {
          this.RefreshListOfDeposits.emit();
          this.RefreshListOfUsers.emit();
          this.alertService.success("De inleg is goedgekeurd");
        },
        (error) => {
          this.alertService.danger(error.error.message);
        }
      );
  }
}
