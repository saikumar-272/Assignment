import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Router, RouterModule} from "@angular/router";
import {Subscription} from "rxjs";
import {ILoggedInUserDetails} from "src/app/shared/interfaces/dto/auth-service/auth";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {
    SecondMainMenuComponent
} from "src/app/private/admin/user-landing/second-main-menu/admin-second-main-menu.component";
import {CommonModule} from "@angular/common";
import {MainMenuComponent} from "./main-menu/admin-main-menu.component";

@Component({
selector: "app-admin-user-landing",
  imports: [RouterModule, CommonModule, MainMenuComponent, SecondMainMenuComponent],
  templateUrl: "./admin-user-landing.component.html",
  styleUrls: ["./admin-user-landing.component.scss"],
  standalone: true
})
export class AdminUserLandingComponent implements OnInit, OnDestroy {
  @ViewChild(SecondMainMenuComponent)
  secondMainMenuComponent!: SecondMainMenuComponent;

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
    if (this.router.url === "/in") {
      this.router.navigateByUrl("/in/intro-page");
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

  mouseLeave(event: any): void {
    document
      .getElementById("page-wrapper-div")
      ?.classList.remove("sidebar-hovered");
  }

  mouseEnter(event: any): void {
    document
      .getElementById("page-wrapper-div")
      ?.classList.add("sidebar-hovered");
  }

  hideSideMenu(event: any): void {
    document.getElementById("page-wrapper-div")?.classList.add("toggled");
  }

  showSideMenu(event: any): void {
    document.getElementById("page-wrapper-div")?.classList.remove("toggled");
  }
}
