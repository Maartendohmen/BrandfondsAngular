import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MDBBootstrapModule } from "angular-bootstrap-md";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "./components/login/login.component";
import { MainmenuComponent } from "./components/mainmenu/mainmenu.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TitleCasePipe } from "@angular/common";

// Language settings for nl
import { registerLocaleData } from "@angular/common";
import localeNl from "@angular/common/locales/nl";
registerLocaleData(localeNl);

// Import BrowserAnimationsModule
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// Import your library
import { AlertModule } from "@full-fledged/alerts";
import { RegisterComponent } from "./components/registration/register/register.component";
import { RegisterconformationComponent } from "./components/registration/registerconformation/registerconformation.component";
import { ResetpasswordComponent } from "./components/passwordreset/resetpassword/resetpassword.component";
import { ResetpasswordrequestComponent } from "./components/passwordreset/resetpasswordrequest/resetpasswordrequest.component";
import { AdminComponent } from "./components/brandmaster/admin/admin.component";
import { NavbarComponent } from "./components/global/navbar/navbar.component";
import { AdminEditsaldoComponent } from "./components/brandmaster/admin-editsaldo/admin-editsaldo.component";
import { AdminEditpunishmentstripeComponent } from "./components/brandmaster/admin-editpunishmentstripe/admin-editpunishmentstripe.component";
import { AdminDepositrequestComponent } from "./components/brandmaster/admin-depositrequest/admin-depositrequest.component";
import { RegistrationActivationComponent } from "./components/registration/registration-activation/registration-activation.component";
import { AdminStockComponent } from "./components/brandmaster/admin-stock/admin-stock.component";
import { AuthInterceptor } from "./_interceptors/AuthInterceptor";
import { AdminReceiptsComponent } from "./components/brandmaster/admin-receipts/admin-receipts.component";
import { SafeHtml } from "./_custom_pipes/safeHtml";
import { ReceiptModalComponent } from "./components/brandmaster/receipt-modal/receipt-modal.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { ProfileComponent } from "./components/profile/profile.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainmenuComponent,
    RegisterComponent,
    AdminComponent,
    ResetpasswordComponent,
    ResetpasswordrequestComponent,
    RegisterconformationComponent,
    NavbarComponent,
    AdminEditsaldoComponent,
    AdminEditpunishmentstripeComponent,
    AdminDepositrequestComponent,
    RegistrationActivationComponent,
    AdminStockComponent,
    AdminReceiptsComponent,
    SafeHtml,
    ReceiptModalComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    NgbModule, // bootstrap ngx
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ImageCropperModule,
    AlertModule.forRoot({ maxMessages: 5, timeout: 5000, positionX: "right" }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: "nl-NL" },
    TitleCasePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
