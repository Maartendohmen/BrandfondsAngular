import { Component, OnInit } from "@angular/core";
import { AlertService } from "@full-fledged/alerts";
import { User, DepositRequest, Stock } from "src/app/api/models";
import UserStripe from "src/app/_custom_interfaces/UserStripe";
import {
  UserControllerService,
  StockControllerService,
  DayControllerService,
} from "src/app/api/services";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
  public loggedinUser: User;

  allusers: User[] = [];
  allusersstripes: UserStripe[] = [];
  alluserpunishmentstripes: UserStripe[] = [];

  alldepositrequests: DepositRequest[] = [];

  currentstock: Stock;

  //edit user Saldo
  selectedUser_Saldo = null; //not type safe cause typescript has no support for tuples
  selectedUserSaldo: number;

  selectedUser_PunishmentStripes = null;
  selectedUserPunishmentStripes: number;

  constructor(
    private alertService: AlertService,
    private userService: UserControllerService,
    private dayService: DayControllerService,
    private stockService: StockControllerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loggedinUser = JSON.parse(localStorage.getItem("current_user"));

    this.RefreshListOfUsers();
    this.RefreshListOfDeposits();
    this.RefreshStock();
  }

  RefreshListOfUsers() {
    this.allusers = [];
    this.allusersstripes = [];
    this.alluserpunishmentstripes = [];

    //gets all users
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.allusers = [];
        this.allusers = data;

        this.allusers.forEach((user) => {
          //foreach user, check total amount of stripes
          this.dayService
            .getTotalStripesForUser(user.id)
            .subscribe((totalstripes) => {
              this.allusersstripes.push({
                user: user,
                stripetotal: totalstripes,
              });
            });

          //foreach user, check amount of punishment stripes
          this.dayService
            .getStripesForOneUser({
              id: user.id,
              date: new Date(1900, 1).toUTCString(),
            })
            .subscribe((totalpunishmentstripes) => {
              if (totalpunishmentstripes[0]) {
                this.alluserpunishmentstripes.push({
                  user: user,
                  stripetotal: totalpunishmentstripes[0].stripes,
                });
              } else {
                this.alluserpunishmentstripes.push({
                  user: user,
                  stripetotal: 0,
                });
              }
            });
        });

        //print error if something goes wrong
      },
      (error) => {
        console.log(error.error.message);
      }
    );
  }

  RefreshListOfDeposits() {
    this.userService.getAllDeposits().subscribe(
      (result) => {
        this.alldepositrequests = result;
        this.alldepositrequests = this.alldepositrequests.filter(
          (depositrequest) => depositrequest.handledDate === null
        );
      },
      (error) => {
        console.log(error.error.message);
      }
    );
  }

  RefreshStock() {
    this.stockService.getCurrentStock().subscribe(
      (result) => {
        this.currentstock = result;
      },
      (error) => {
        console.log(error.error.message);
      }
    );
  }

  LogOut(e) {
    localStorage.removeItem("current_user");
    this.router.navigateByUrl("");
  }
}
