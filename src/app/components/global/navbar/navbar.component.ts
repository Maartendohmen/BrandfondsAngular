import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "src/app/api/models";
import { UserControllerService } from "src/app/api/services";
import { DomSanitizer } from "@angular/platform-browser";
import { ImageCroppedEvent, LoadedImage } from "ngx-image-cropper";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  @Input() loggedinUser: User;
  profilePicture: any;

  constructor(
    private router: Router,
    private _sanitizer: DomSanitizer,
    private userControllerService: UserControllerService
  ) {}

  ngOnInit() {
    this.getProfilePicture();
  }

  getProfilePicture(): void {
    this.userControllerService
      .getUserProfilePictureUsingGET(this.loggedinUser.id)
      .subscribe((encodedImage) => {
        this.profilePicture = this._sanitizer.bypassSecurityTrustResourceUrl(
          "data:image/jpg;base64," + encodedImage
        );
      });
  }

  navigateToProfilePage() {
    this.router.navigateByUrl("profile");
  }

  LogOut(e) {
    localStorage.clear();
    this.router.navigateByUrl("");
  }
}
