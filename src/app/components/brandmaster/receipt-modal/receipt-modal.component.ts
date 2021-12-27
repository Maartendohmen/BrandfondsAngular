import { Component, OnInit, Renderer2, ChangeDetectorRef } from "@angular/core";
import { MDBModalRef } from "angular-bootstrap-md";
import { ReceiptControllerService } from "src/app/api/services";
import { saveAs as importedSaveAs } from "file-saver";

@Component({
  selector: "app-receipt-modal",
  templateUrl: "./receipt-modal.component.html",
  styleUrls: ["./receipt-modal.component.css"],
})
export class ReceiptModalComponent implements OnInit {
  imageData: any;
  imageName: string;
  imageAngle = 0;

  constructor(
    public modalRef: MDBModalRef,
    private renderer: Renderer2,
    private receiptControllerService: ReceiptControllerService
  ) {}

  ngOnInit(): void {}

  rotateImage(direction) {
    //this.angle = this.angle + 90;
    this.imageAngle += direction == "left" ? -90 : 90;
    this.renderer.setStyle(
      document.querySelector(".image-preview"),
      "transform",
      `rotate(${this.imageAngle}deg)`
    );
  }

  downloadImage() {
    this.receiptControllerService
      .getRawReceiptFileByNameResponse(this.imageName)
      .subscribe((result) => {
        let blob = new Blob([result.body], { type: "jpeg" });
        importedSaveAs(
          blob,
          this.getFileNameFromHeader(result.headers.get("Content-Disposition"))
        );
      });
  }

  getFileNameFromHeader(contentDispositionHeader: any) {
    var result = contentDispositionHeader.split(";")[1].trim().split("=")[1];
    return result.replace(/"/g, "");
  }
}
