import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { ILoggedInUserDetails } from "src/app/shared/interfaces/dto/auth-service/auth";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { isBlank } from "src/app/shared/util/string-util";

@Component({
  selector: "app-main-menu",
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./admin-main-menu.component.html",
  styleUrls: ["./admin-main-menu.component.scss"],
  standalone: true,
})
export class MainMenuComponent implements OnInit {
  @Output() hideSideMenu = new EventEmitter<string>();
  @Input() userDisplayName: string | null = "";
  userImageUrl: string = "";
  isProfilePicPresent: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userDetails: ILoggedInUserDetails | null =
      this.authService.currentUser;
    if (userDetails != null) {
      if (!isBlank(userDetails.profilePicUrl)) {
        this.userImageUrl = userDetails.profilePicUrl;
        this.isProfilePicPresent = true;
      }
    }
  }

  handleSignout(): void {
    if (this.authService.signoutUser()) {
      this.router.navigateByUrl("/public/login");
    }
  }

  hideChildSideMenu(): void {
    this.hideSideMenu.next("hide");
  }
}
