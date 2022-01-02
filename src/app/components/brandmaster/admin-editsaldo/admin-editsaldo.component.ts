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
import { UserControllerService } from "src/app/api/services";

@Component({
  selector: "app-admin-editsaldo",
  templateUrl: "./admin-editsaldo.component.html",
  styleUrls: ["./admin-editsaldo.component.css"],
})
export class AdminEditsaldoComponent implements OnInit {
  @Input() allusersstripes: UserStripe[];
  @Output() RefreshListOfUsers = new EventEmitter<any>();

  datasource: UserStripe[] = [];
  selectedamount: number = null;

  constructor(
    private alertService: AlertService,
    private userService: UserControllerService
  ) {}

  ngOnChanges(changes: SimpleChange): void {
    this.datasource = this.allusersstripes;
  }

  ngOnInit() {
    this.datasource = this.allusersstripes;
  }

  onNameChange(value) {
    if (value) {
      var copylist: UserStripe[] = this.allusersstripes.filter(
        (userstripe) =>
          userstripe.user.forename
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          userstripe.user.surname
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
      );
      this.datasource = copylist;
    } else {
      this.datasource = this.allusersstripes;
    }
  }

  SetSelectedAmount(amount) {
    this.selectedamount = amount;
  }

  //todo check if other stuff then numbers, points or comma's are given in, and reject those
  SaveSaldo(selectedUser: UserStripe, inputsaldo) {
    if (inputsaldo.toString() !== this.selectedamount.toString()) {
      if (inputsaldo != null || inputsaldo === 0) {
        var selectedUserSaldo = inputsaldo.toString();
        var inputsaldo = null;

        if (selectedUserSaldo.includes(",")) {
          inputsaldo = +selectedUserSaldo.replace(/,/g, "");
        } else {
          inputsaldo = +selectedUserSaldo * 100;
        }

        this.userService
          .setUserSaldoUsingPUT({
            id: selectedUser.user.id,
            amount: +inputsaldo,
          })
          .subscribe(
            (data) => {
              this.alertService.success("Het saldo is aangepast");
              this.RefreshListOfUsers.emit();
            },
            (error) => {
              this.alertService.danger(error.error.message);
            }
          );
      }
    }
  }
}
