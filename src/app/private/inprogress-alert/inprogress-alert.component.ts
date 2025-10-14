import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {BackendService} from 'src/app/shared/services/backend.service';
import {Constants} from 'src/app/shared/util/constants';
import {ToastNotificationService} from 'src/app/toast-notification-service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-service-redirection',
  templateUrl: './inprogress-alert.component.html',
  styleUrls: ['./inprogress-alert.component.css']
})
export class InprogressAlertComponent implements OnInit {


  statusCheckDelayinSeconds: number = environment.statusCheckDelay;

  constructor(private toastNotificationService: ToastNotificationService, private backendService: BackendService) {

  }

  private interval: any;

  async ngOnInit(): Promise<void> {
    this.interval = setInterval(() => {
      this.getAccountUpgradeStatus();
    }, this.statusCheckDelayinSeconds);
  }

  async getAccountUpgradeStatus(): Promise<void> {
    let response: any = await this.backendService.getAccountUpgradeStatus();
    if (response.success == 1) {
      let status = response.status;
      if (status == Constants.ERROR_CODE_USE_NEW_VERSION || status == Constants.UPGRADE_STATUS_UPGRADE_COMPLETED) {
        localStorage.setItem(Constants.BACKEND_DOMAIN_PREFIX, response.backendDomainPrefix);
        let errorCode: string = response.status;
        if (status == Constants.UPGRADE_STATUS_UPGRADE_COMPLETED) {
          errorCode = Constants.ERROR_CODE_TRANSITION_TO_STABLE_SERVER;
        }
        localStorage.setItem(Constants.ERROR_CODE, errorCode);
        localStorage.setItem(Constants.BACKEND_DOMAIN_PREFIX, response.backendDomainPrefix);
        localStorage.setItem(Constants.NEW_FRONTEND_DOMAIN, response.newFrontendDomain);
        window.location.reload();
      }
    } else {
      this.toastNotificationService.showError(response.alert);
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
