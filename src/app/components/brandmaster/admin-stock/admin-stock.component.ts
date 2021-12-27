import { Component, OnInit, Input } from "@angular/core";
import { AlertService } from "@full-fledged/alerts";
import { Stock } from "src/app/api/models";
import { StockControllerService } from "src/app/api/services";

@Component({
  selector: "app-admin-stock",
  templateUrl: "./admin-stock.component.html",
  styleUrls: ["./admin-stock.component.css"],
})
export class AdminStockComponent implements OnInit {
  @Input() currentstock: Stock;

  constructor(
    private alertService: AlertService,
    private stockService: StockControllerService
  ) {}

  ngOnInit() {}

  EditCurrentBottles(amount) {
    // check if the user has entered a new value
    if (amount) {
      this.stockService.updateCurrentBottles(amount).subscribe(
        (result) => {
          this.alertService.success(
            "Huidig aantal flessen succesvol aangepast"
          );
        },
        (error) => {
          this.alertService.warning(
            "Er is iets fout gegaan, probeer het later opnieuw"
          );
        }
      );
    }
  }

  EditReturnedBottles(amount) {
    // check if the user has entered a new value
    if (amount) {
      this.stockService.updateReturnedBottles(amount).subscribe(
        (result) => {
          this.alertService.success(
            "Het aantal ingeleverde flessen is succesvol aangepast"
          );
        },
        (error) => {
          this.alertService.warning(
            "Er is iets fout gegaan, probeer het later opnieuw"
          );
        }
      );
    }
  }

  EditNotStripedBottles(amount) {
    // check if the user has entered a new value
    if (amount) {
      this.stockService.updateNotStripedBottles(amount).subscribe(
        (result) => {
          this.alertService.success(
            "Het aantal niet gestreepte flessen is succesvol aangepast"
          );
        },
        (error) => {
          this.alertService.warning(
            "Er is iets fout gegaan, probeer het later opnieuw"
          );
        }
      );
    }
  }
}
