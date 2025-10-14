import {Component, OnInit} from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Router} from "@angular/router";
import {BackendService} from "src/app/shared/services/backend.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsImplComponent} from "src/app/shared/forms-custom/form-fields-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
  selector: "app-retrieve-counry-for-upload-list-component",
  templateUrl: "./UI_PAGE_NAME_LOWER_CASE_HYPHENATED.component.html",
  styleUrls: ["./UI_PAGE_NAME_LOWER_CASE_HYPHENATED.component.scss"],
})
export class RetrieveCounryForUploadListComponent
  extends FormFieldsImplComponent
  implements OnInit
{
  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendService,
    private route: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private customisationService: CustomisationService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    super();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {}
}
