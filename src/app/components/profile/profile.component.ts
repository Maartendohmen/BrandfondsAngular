import { Component, OnInit, Input } from "@angular/core";
import { ImageCroppedEvent, LoadedImage } from "ngx-image-cropper";
import { Router } from "@angular/router";
import { AlertService } from "@full-fledged/alerts";
import { UserControllerService } from "src/app/api/services";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserControllerService,
    private alertService: AlertService
  ) {}

  public loggedinUserId: number;

  imageChangedEvent: any = "";
  croppedImage: any = "";
  imageType: any = "";
  canSubmit: boolean = false;

  ngOnInit(): void {
    this.loggedinUserId = JSON.parse(localStorage.getItem("current_user")).id;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;

    this.imageType = event.target.files[0].type;

    if (this.imageType != "image/jpeg" && this.imageType != "image/png") {
      this.alertService.danger(
        "Op dit moment wordt alleen het JPG/PNG bestandstype ondersteund"
      );
      this.canSubmit = false;
    } else {
      this.canSubmit = true;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64.split(",")[1];
  }

  saveCroppedPicture() {
    var base64ImageWithoutImageType = this.croppedImage.split(",")[1];
    var blob = this.base64ToBlob(base64ImageWithoutImageType);

    var fileToUpload = this.blobToFile(blob, "temp_file");

    this.userService
      .setUserProfilePicture({
        id: this.loggedinUserId,
        file: fileToUpload,
      })
      .subscribe((response) => {
        this.router.navigateByUrl("main");
      });
  }

  private base64ToBlob(base64Image: String): Blob {
    const byteCharacters = atob(this.croppedImage);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: this.imageType });

    return blob;
  }

  private blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  };
}
