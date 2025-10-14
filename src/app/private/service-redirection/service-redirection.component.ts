import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BackendService} from 'src/app/shared/services/backend.service';

@Component({
  selector: 'app-service-redirection',
  templateUrl: './service-redirection.component.html',
  styleUrls: ['./service-redirection.component.css']
})
export class ServiceRedirectionComponent {

  constructor(private currentRoute: ActivatedRoute, private router: Router, private backendService: BackendService) {
      let indexOfSecondSlash = this.router.url.split("/", 2).join("/").length;
      let serviceName = this.router.url.substring(1, indexOfSecondSlash);
      let urlPath = this.router.url.substring(indexOfSecondSlash);
      if (urlPath && urlPath.length > 0) {
        let contextPath = "/" + serviceName + "/";
        // Replace the first occurrence of '?' with the '&' character
        const indexOfMatchingChar = urlPath.indexOf("?");
        if (indexOfMatchingChar !== -1) {
          urlPath = urlPath.substring(0, indexOfMatchingChar) + "&" + urlPath.substring(indexOfMatchingChar + 1);
        }
        let externalUrl = contextPath + "?path=" +  urlPath
        document.location.href =  externalUrl;
      }
  }

}
