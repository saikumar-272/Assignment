import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";
import {Component, OnInit, Renderer2} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastNotificationService} from "../toast-notification-service";
import {BackendService} from "../shared/services/backend.service";
import {FormBuilder} from "@angular/forms";
import {AuthenticationService} from "../shared/services/authentication.service";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormFieldsImplComponent} from "../shared/forms-custom/form-fields-impl";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
selector: "app-root",
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./download-attachment.component.html",
  styleUrls: ["./download-attachment.component.scss"],
  standalone: true
})
export class DownloadAttachmentComponent
  extends FormFieldsImplComponent
  implements OnInit
{
  redirectUrl = "";
  attachmentUUID = "";
  fileName = "";
  imageEnabled = false;
  videoEnabled = false;
  imageUrl: any;
  videoUrl: any;
  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendService,
    private fb: FormBuilder,
    private currentRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {
    super();
    this.currentRoute.queryParams.subscribe((params) => {
      this.redirectUrl = params["redirectUrl"];
      this.attachmentUUID = params["attachmentUUID"];
      this.fileName = params["fileName"];
    });
  }

  async ngOnInit() {
    this.renderer.setStyle(
      document.body,
      "background-color",
      "rgb(14, 14, 14)"
    );
    this.renderer.setStyle(document.body, "height", "100%");
    this.renderer.setStyle(document.body, "margin", "auto");
    this.backendService
      .getAttachmentData(this.redirectUrl, this.attachmentUUID)
      .subscribe(
        (response: any) => {
          let attachmentType = response["type"];
          // Create a URL for the blob and assign it to the src
          const blob = new Blob([response], { type: attachmentType });
          let attachmentUrl = URL.createObjectURL(blob);
          if (attachmentType.startsWith("image")) {
            this.imageUrl =
              this.sanitizer.bypassSecurityTrustResourceUrl(attachmentUrl);
            this.imageEnabled = true;
          } else if (attachmentType.startsWith("video")) {
            this.videoUrl =
              this.sanitizer.bypassSecurityTrustResourceUrl(attachmentUrl);
            this.videoEnabled = true;
          } else {
            const a = document.createElement("a");
            a.href = attachmentUrl;
            a.download = this.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(attachmentUrl);
            window.close();
          }
        },
        (error: any) => {
          let errrorBlob = error.error;
          //Convert blob to json object
          const fileReader = new FileReader();
          fileReader.readAsText(errrorBlob);
          fileReader.onload = (event: any) => {
            const errorResonse = JSON.parse(event.target.result);
            if (errorResonse.hasOwnProperty("alert")) {
              alert(errorResonse["alert"]);
            } else {
              alert("Unhandled error response.");
            }
          };
        }
      );
  }
}
