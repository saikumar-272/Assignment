import {Injectable} from "@angular/core";
import {BackendServiceTemplateAppBase} from "./backend.service.template-app.base";
import {HttpClient} from "@angular/common/http";
import {DomainService} from "./domain.service";

@Injectable()
export class BackendServiceTemplateApp  extends BackendServiceTemplateAppBase
{
  constructor(http: HttpClient, domainService: DomainService) {
    super(http, domainService);
  }
}
