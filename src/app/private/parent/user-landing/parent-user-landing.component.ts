import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ILoggedInUserDetails } from "src/app/shared/interfaces/dto/auth-service/auth";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { ParentMainMenuComponent } from "./main-menu/parent-main-menu.component";
import { ParentSecondMainMenuComponent } from "./second-main-menu/parent-second-main-menu.component";
import { AppRoutingAdminPrivateModule } from "src/app/app-routing-admin-private.module";

@Component({
  selector: "app-parent-user-landing",
  imports: [
    ParentMainMenuComponent,
    ParentSecondMainMenuComponent,
    AppRoutingAdminPrivateModule,
  ],
  templateUrl: "./parent-user-landing.component.html",
  styleUrls: ["./parent-user-landing.component.scss"],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ParentUserLandingComponent implements OnInit, OnDestroy {
  private userLoginEventSub: Subscription | null = null;

  private userLoggedIn: boolean = false;
  public get isUserLoggedIn(): boolean {
    return this.userLoggedIn;
  }

  private currentUserFullName: string | null = null;
  public get userFullName(): string | null {
    return this.currentUserFullName;
  }

  private currentUserType: string | null = null;
  public get userType(): string | null {
    return this.currentUserType;
  }

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  private handlePostLogin(user: ILoggedInUserDetails): void {
    this.currentUserFullName = `${user.firstName || ""} ${user.lastName || ""}`;
    this.currentUserType = user.userType;
    this.userLoggedIn = true;
    if (this.router.url === "/parent") {
      this.router.navigateByUrl("/parent/intro-page");
    }
  }

  ngOnInit(): void {
    // get user details
    const user: ILoggedInUserDetails | null = this.authService.currentUser;
    if (user !== null) {
      this.handlePostLogin(user);
    }

    // subscribe to further current user details updates
    this.userLoginEventSub = this.authService.UserLoginEvent.subscribe(
      (loggedIn) => {
        if (loggedIn && this.authService.currentUser !== null) {
          this.handlePostLogin(this.authService.currentUser);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.userLoginEventSub) {
      this.userLoginEventSub.unsubscribe();
      this.userLoginEventSub = null;
    }
  }
}
