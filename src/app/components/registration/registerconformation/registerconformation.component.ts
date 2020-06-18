import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registerconformation',
  templateUrl: './registerconformation.component.html',
  styleUrls: ['./registerconformation.component.css']
})
export class RegisterconformationComponent implements OnInit {

  doneloading = false;
  registertoken = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    protected userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.registertoken = params['link'];

      this.userService.confirmRegistration(this.registertoken).subscribe(active => {

        this.doneloading = true;

        setTimeout(() => {
          this.router.navigate(['']);
        },
          7000);

      }, error => {
        if (error.error.type == "LinkExpiredException") {
          this.router.navigateByUrl('/');
          this.alertService.danger(error.error.message);
        }
      });
    }
    );
  }
}
