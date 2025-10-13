import {Component, OnInit} from '@angular/core';
import {BackendService} from 'src/app/shared/services/backend.service';
import {Constants} from 'src/app/shared/util/constants';
import {isBlank} from 'src/app/shared/util/string-util';
import {environment} from 'src/environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-service-redirection',
  templateUrl: './service-down-alert.component.html',
  styleUrls: ['./service-down-alert.component.css']
})
export class ServiceDownAlertComponent implements OnInit {


  statusCheckDelayinSeconds: number = environment.statusCheckDelay;

  constructor(private route: ActivatedRoute, private router: Router, private backendService: BackendService) {

  }

  private interval: any;

  async ngOnInit(): Promise<void> {
    this.interval = setInterval(() => {
      this.redirectToPageIfAuthServiceUp();
    }, this.statusCheckDelayinSeconds);
  }

  async redirectToPageIfAuthServiceUp(): Promise<void> {
    let isServiceUp: boolean = await this.backendService.isAuthServiceUp();
    if (isServiceUp) {
      let errorCode = localStorage.getItem(Constants.ERROR_CODE);
      if (!isBlank(errorCode) && errorCode == Constants.ERROR_CODE_SERVICE_DOWN) {
        localStorage.removeItem(Constants.ERROR_CODE);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/in';
        window.location.href = returnUrl;
      }
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
