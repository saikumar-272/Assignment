import {Injectable} from "@angular/core";
import {BackendServiceBase} from "./backend.service.base";
import {HttpClient} from "@angular/common/http";
import {DomainService} from "./domain.service";

@Injectable()
export class BackendService  extends BackendServiceBase
{
  constructor(http: HttpClient, domainService: DomainService) {
    super(http, domainService);
  }
}
