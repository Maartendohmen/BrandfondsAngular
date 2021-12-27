import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { MainmenuComponent } from "./components/mainmenu/mainmenu.component";
import { RegisterComponent } from "./components/registration/register/register.component";
import { AdminComponent } from "./components/brandmaster/admin/admin.component";
import { ResetpasswordrequestComponent } from "./components/passwordreset/resetpasswordrequest/resetpasswordrequest.component";
import { ResetpasswordComponent } from "./components/passwordreset/resetpassword/resetpassword.component";
import { UserGuard } from "./_guards/user.guard";
import { AdminGuard } from "./_guards/admin.guard";
import { RegisterconformationComponent } from "./components/registration/registerconformation/registerconformation.component";
import { RegistrationActivationComponent } from "./components/registration/registration-activation/registration-activation.component";
import { ProfileComponent } from "./components/profile/profile.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "profile", component: ProfileComponent, canActivate: [UserGuard] },
  { path: "main", component: MainmenuComponent, canActivate: [UserGuard] },
  { path: "admin", component: AdminComponent, canActivate: [AdminGuard] },
  { path: "resetpasswordrequest", component: ResetpasswordrequestComponent },
  { path: "resetpassword/:link", component: ResetpasswordComponent },
  {
    path: "registerconformation/:link",
    component: RegisterconformationComponent,
  },
  { path: "activate-user/:userid", component: RegistrationActivationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
