import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@full-fledged/alerts";
import { Receipt } from "src/app/api/models";
import { MDBModalService, MDBModalRef } from "angular-bootstrap-md";
import { ReceiptModalComponent } from "../receipt-modal/receipt-modal.component";
import { ReceiptControllerService } from "src/app/api/services";

@Component({
  selector: "app-admin-receipts",
  templateUrl: "./admin-receipts.component.html",
  styleUrls: ["./admin-receipts.component.css"],
})
export class AdminReceiptsComponent implements OnInit {
  // form controls
  public receiptUploadForm: FormGroup;
  uploading: boolean = false;

  //receipts
  allreceipts: Receipt[] = [];

  // selected file
  fileToUpload: File = null;

  //image to show
  selectedImageData: any = null;
  selectedImageName: String = null;

  modalRef: MDBModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private receiptControllerService: ReceiptControllerService,
    private alertService: AlertService,
    private _sanitizer: DomSanitizer,
    private modalService: MDBModalService
  ) {}

  ngOnInit(): void {
    this.receiptUploadForm = this.formBuilder.group({
      receipt_description: ["", Validators.required],
      receipt_date: [""],
      receipt_amount: ["", Validators.required],
      receipt_file: ["", Validators.required],
    });

    this.getAllReceipts();
  }

  get f() {
    return this.receiptUploadForm.controls;
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadReceipt() {
    this.uploading = true;

    // stop here if form is invalid
    if (this.receiptUploadForm.invalid) {
      this.alertService.warning("vul a.u.b. alle vereisten velden in");
      this.uploading = false;
      return;
    }

    var receipt_description = this.f.receipt_description.value;

    var convertedDate = undefined;
    var correctDateRegex = /^\s*(3[01]|[12][0-9]|0?[1-9])\-(1[012]|0?[1-9])\-((?:19|20)\d{2})\s*$/g;

    if (this.f.receipt_date.value) {
      if (correctDateRegex.test(this.f.receipt_date.value)) {
        var nonConvertedDate = this.f.receipt_date.value.split("-");
        convertedDate = new Date(
          nonConvertedDate[2],
          nonConvertedDate[1] - 1,
          nonConvertedDate[0]
        ).toUTCString();
      } else {
        this.alertService.warning(
          "Zorg dat de datum op de correcte manier is ingevoerd en geldig is"
        );
        this.uploading = false;
        return;
      }
    }

    var receipt_amount: number = this.checkPaidAmount(
      this.f.receipt_amount.value
    );

    this.receiptControllerService
      .uploadReceiptFile({
        file: this.fileToUpload,
        description: receipt_description,
        date: convertedDate,
        paidAmount: receipt_amount,
      })
      .subscribe(
        () => {
          this.alertService.success(
            "De bon met informatie is opgeslagen op de server"
          );
          this.uploading = false;
          this.getAllReceipts();
        },
        (error) => {
          this.uploading = false;
          this.alertService.danger(error.error.message);
        }
      );
  }

  checkPaidAmount(inputAmount): number {
    console.log(inputAmount);

    var paid_amount = inputAmount.toString();
    var inputsaldo = null;

    if (paid_amount.includes(",")) {
      inputsaldo = +paid_amount.replace(/,/g, "");
    } else {
      inputsaldo = +paid_amount * 100;
    }

    return inputsaldo;
  }

  retrieveImage(fileName) {
    this.receiptControllerService
      .getEncodedReceiptFileByName(fileName)
      .subscribe((encodedImage) => {
        this.selectedImageData = this._sanitizer.bypassSecurityTrustResourceUrl(
          "data:image/jpg;base64," + encodedImage
        );
        this.selectedImageName = fileName;
        this.openModal();
      });
  }

  getAllReceipts() {
    this.receiptControllerService.getAllReceipts().subscribe((receipts) => {
      this.allreceipts = receipts;
    });
  }

  openModal() {
    this.modalRef = this.modalService.show(ReceiptModalComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: false,
      class: "modal-fade modal-dialog-centered modal-dialog-scrollable",
      containerClass: "overflow-auto",
      animated: true,
      data: {
        imageData: this.selectedImageData,
        imageName: this.selectedImageName,
      },
    });
  }
}
