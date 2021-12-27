import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChange,
} from "@angular/core";
import { AlertService } from "@full-fledged/alerts";
import UserStripe from "src/app/_custom_interfaces/UserStripe";
import { DayControllerService } from "src/app/api/services";

@Component({
  selector: "app-admin-editpunishmentstripe",
  templateUrl: "./admin-editpunishmentstripe.component.html",
  styleUrls: ["./admin-editpunishmentstripe.component.css"],
})
export class AdminEditpunishmentstripeComponent implements OnInit {
  @Input() alluserpunishmentstripes: UserStripe[];
  @Output() RefreshListOfUsers = new EventEmitter<any>();

  datasource: UserStripe[] = [];
  selectedamount: number = null;

  constructor(
    private alertService: AlertService,
    private dayservice: DayControllerService
  ) {}

  ngOnChanges(changes: SimpleChange): void {
    this.datasource = this.alluserpunishmentstripes;
  }

  ngOnInit() {
    this.datasource = this.alluserpunishmentstripes;
  }

  onNameChange(value) {
    if (value) {
      var copylist: UserStripe[] = this.alluserpunishmentstripes.filter(
        (userstripe) =>
          userstripe.user.forname
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          userstripe.user.surname
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
      );
      this.datasource = copylist;
    } else {
      this.datasource = this.alluserpunishmentstripes;
    }
  }

  SetSelectedAmount(amount) {
    this.selectedamount = amount;
  }

  SavePunishmentStripes(selectedUser: UserStripe, inputsaldo) {
    if (inputsaldo.toString() !== this.selectedamount.toString()) {
      if (inputsaldo || inputsaldo === 0) {
        var changedamount = inputsaldo - selectedUser.stripetotal;

        if (changedamount > 0) {
          this.dayservice
            .addMultipeStripesForUser({
              id: selectedUser.user.id,
              date: new Date(1900, 1).toUTCString(),
              amount: changedamount,
            })
            .subscribe(
              (data) => {
                this.alertService.success("Het aantal strepen is aangepast");
                this.RefreshListOfUsers.emit();
              },
              (error) => {
                this.alertService.warning(error.error.message);
              }
            );
        } else if (changedamount < 0) {
          this.dayservice
            .removeStripesForUser({
              id: selectedUser.user.id,
              amount: Math.abs(changedamount),
              date: new Date(1900, 1).toUTCString(),
            })
            .subscribe(
              (data) => {
                this.alertService.success("Het aantal strepen is aangepast");
                this.RefreshListOfUsers.emit();
              },
              (error) => {
                this.alertService.warning(error.error.message);
              }
            );
        }
      }
    }
  }
}
