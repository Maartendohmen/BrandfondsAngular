import { Component, OnInit, SimpleChange } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '@full-fledged/alerts';
import { User, StripesMonth } from 'src/app/api/models';
import { UserControllerService, DayControllerService } from 'src/app/api/services';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements OnInit {

  //global param
  public loggedinUser: User;
  public groupstripesmenu: boolean = false;
  public personalstripesnumber: number;

  //individual striping param
  public selectedDate: Date = new Date();
  currentdate: NgbDateStruct = this.calendar.getToday();

  //group striping param
  public selectedUserID: number;
  public allusers: User[];

  //Selected users with stripes for current day todo maybe wanna change this back to make use off userstripe interface, not sure yet
  public selectedUsers: Map<User, number> = new Map();

  //Overview
  public saldoColor: string = null;
  public totalStripes: Number = undefined;
  public totalstripesPerMonth: StripesMonth[] = [];

  //paymentrequest
  paid_amount: number;

  constructor(private calendar: NgbCalendar,
    private userService: UserControllerService,
    private dayService: DayControllerService,
    private alertService: AlertService) { }

  ngOnInit() {

    this.loggedinUser = JSON.parse(localStorage.getItem('current_user'));

    this.onDateSelection(this.currentdate);

    this.RefreshAllUsers();
    this.RefreshTotalStripesFromUser();
    this.RefreshSaldoFromUser();
    this.RefreshTotalStripesPerMonthFromUser();
  }


  /* #region  SetScreens */
  SetGroupScreen(e) {
    this.onDateSelection(this.currentdate);
    this.RefreshOwnTodayStripes();
    this.groupstripesmenu = true;
  }

  SetPersonalScreen(e) {
    this.onDateSelection(this.currentdate);
    this.groupstripesmenu = false;
  }
  /* #endregion */


  /* #region  Edit stripes */
  RemoveStripe(e) {

    if (this.personalstripesnumber > 0) {
      this.dayService.removeStripeForUser({ id: this.loggedinUser.id, date: this.selectedDate.toUTCString() }).subscribe(data => {
        this.dayService.getStripesForOneUser({ id: this.loggedinUser.id, date: this.selectedDate.toUTCString() }).subscribe(days => {
          if (days[0]) { //if day still exist after striping
            this.personalstripesnumber = days[0].stripes;
          }
          else {
            this.personalstripesnumber = 0;
          }

          this.RefreshTotalStripesFromUser();
          this.RefreshSaldoFromUser();
          this.RefreshTotalStripesPerMonthFromUser();
        })
      });
    }
  }

  AddStripe(e) {

    this.dayService.addStripeForUser({ id: this.loggedinUser.id, date: this.selectedDate.toUTCString() }).subscribe(data => {
      this.dayService.getStripesForOneUser({ id: this.loggedinUser.id, date: this.selectedDate.toUTCString() }).subscribe(days => {
        this.personalstripesnumber = days[0].stripes;

        this.RefreshTotalStripesFromUser();
        this.RefreshSaldoFromUser();
        this.RefreshTotalStripesPerMonthFromUser();
      })
    });

  }
  /* #endregion */

  onDateSelection(date: NgbDateStruct) {

    this.selectedDate = new Date(date.year, date.month, date.day);

    //correction for month enum starting at 0
    this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);

    this.dayService.getStripesForOneUser({ id: this.loggedinUser.id, date: this.selectedDate.toUTCString() }).subscribe(days => {
      if (days[0]) { //if day still exist after striping
        this.personalstripesnumber = days[0].stripes;
      }
      else {
        this.personalstripesnumber = 0;
      }
    })
  }


  /* #region  Add/Remove user to group */
  AddToGroup(e) {

    //check if user is correctly selected and not already in group
    if (this.selectedUserID != undefined && Array.from(this.selectedUsers.keys()).find(x => x.id == this.selectedUserID) == undefined) {

      var selecteduser = this.allusers.find(x => x.id == this.selectedUserID);

      //determain stripe count on current day
      this.dayService.getStripesForOneUser({ id: selecteduser.id, date: this.selectedDate.toString() }).subscribe(days => {

        if (days[0]) {
          //add user to list
          this.selectedUsers.set(selecteduser, days[0].stripes);
        }
        else {
          this.selectedUsers.set(selecteduser, 0);
        }
      });



    }
    //user is already in group
    else if (Array.from(this.selectedUsers.keys()).find(x => x.id == this.selectedUserID) != undefined) {
      this.alertService.warning('Deze gebruiker is al toegevoegd')
    }
    //user is not selected
    else {
      this.alertService.danger("Selecteer a.u.b een gebruiker");
    }
  }

  RemoveFromGroup(userdid: number) {
    var selecteduser = Array.from(this.selectedUsers.keys()).find(x => x.id == userdid);

    this.selectedUsers.delete(selecteduser);
  }
  /* #endregion */

  /* #region  Add/Remove stripe to user in group */
  /**
   * Add stripe from user in group
   * @param user User to which stripe will be added
   */
  AddGroupStripe(user: User) {

    this.dayService.addStripeForUser({ id: user.id, date: this.selectedDate.toUTCString() }).subscribe(data => {
      this.dayService.getStripesForOneUser({ id: user.id, date: this.selectedDate.toUTCString() }).subscribe(days => {

        this.selectedUsers.set(user, days[0].stripes)

        //update own values after transaction
        if (user.id === this.loggedinUser.id) {
          this.RefreshTotalStripesFromUser();
          this.RefreshSaldoFromUser();
          this.RefreshTotalStripesPerMonthFromUser();
        }
      })
    });
  }

  /**
   * Remove stripe from user in group
   * @param user user which stripe will be deleted
   */
  RemoveGroupStripe(user: User) {

    if (this.selectedUsers.get(user) > 0) {
      this.dayService.removeStripeForUser({ id: user.id, date: this.selectedDate.toUTCString() }).subscribe(data => {
        this.dayService.getStripesForOneUser({ id: user.id, date: this.selectedDate.toUTCString() }).subscribe(days => {
          if (days[0]) { //if day still exist after striping
            this.selectedUsers.set(user, days[0].stripes)
          }
          else {
            this.selectedUsers.set(user, 0)
          }
        });

        //update own values after transaction
        if (user.id === this.loggedinUser.id) {
          this.RefreshTotalStripesFromUser();
          this.RefreshSaldoFromUser();
          this.RefreshTotalStripesPerMonthFromUser();
        }
      });
    }
  }
  /* #endregion */

  /* #region  Refreshes values of current session */
  /**
   * Refresh list of all available users
   */
  RefreshAllUsers() {
    this.userService.getAllUsers().subscribe(data => {

      data.sort(function (a, b) {
        var name1 = a.forname.toUpperCase();
        var name2 = b.forname.toUpperCase();
        return (name1 < name2) ? -1 : (name1 > name2) ? 1 : 0;
      });

      this.allusers = data;
    });
  }

  /**
   * Refreshes the number of stripes for current data for loggedin user
   */
  RefreshOwnTodayStripes() {

    if (Array.from(this.selectedUsers.keys()).find(x => x.id == this.loggedinUser.id) != undefined) {
      var selecteduser = Array.from(this.selectedUsers.keys()).find(x => x.id == this.loggedinUser.id);
      this.dayService.getStripesForOneUser({ id: selecteduser.id, date: this.selectedDate.toUTCString() }).subscribe(days => {
        if (days[0]) { //if day still exist after striping
          this.selectedUsers.set(selecteduser, days[0].stripes)
        }
        else {
          this.selectedUsers.set(selecteduser, 0)
        }

      });
    }
  }

  /**
   * Refreshes the current total stripes from user
   */
  RefreshTotalStripesFromUser() {
    this.dayService.getTotalStripesForUser(this.loggedinUser.id).subscribe(data => {
      this.totalStripes = data;
    });
  }

  /**
   * Refreshes the saldo from the logged in user
   */
  RefreshSaldoFromUser() {
    this.userService.getSaldoFromUser(this.loggedinUser.id).subscribe(data => {

      this.loggedinUser.saldo = data;

      if (this.loggedinUser.saldo < 0) {
        this.saldoColor = 'red'
      }
      else {
        this.saldoColor = 'green'
      }

    });

  }


  RefreshTotalStripesPerMonthFromUser() {
    this.totalstripesPerMonth = [];
    this.dayService.getTotalStripesForUserPerMonth(this.loggedinUser.id).subscribe(data => {

      data.forEach((stripemonth) => {
        this.totalstripesPerMonth.push({ date: stripemonth.date, stripeamount: stripemonth.stripeamount });
      });

    });
  }
  /* #endregion */


  NotifyOfPayment() {

    if (this.paid_amount) {
      var inputsaldo = null;

      var paid_amount = this.paid_amount.toString();

      if (paid_amount.includes(',')) {
        inputsaldo = +paid_amount.replace(/,/g, '');
      }
      else {
        inputsaldo = +paid_amount * 100;
      }

      this.userService.createDepositRequest({ id: this.loggedinUser.id, amount: inputsaldo }).subscribe(result => {
        this.alertService.success('Je verzoek is naar de brandmeester gestuurd');
        this.paid_amount = null;
      }, error => {
        this.alertService.danger(error.error.message);
        this.paid_amount = null;
      });
    }
    else {
      this.alertService.warning('Vul a.u.b het bedrag in wat je overgemaakt hebt');
    }

  }
}
