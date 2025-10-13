import {Injectable} from '@angular/core';
import {Constants} from '../util/constants';
import {isBlank} from '../util/string-util';

@Injectable()
export class DomainService {

  constructor() { }

  redirectToNewDomain(): Boolean {
    let redirect = false;
    let currentDomain : any = (window.location.origin).trim();
    let newFrontendDomain  = localStorage.getItem(Constants.NEW_FRONTEND_DOMAIN);
    if (!isBlank(newFrontendDomain) && newFrontendDomain != currentDomain) {
      redirect = true;
    }
    return redirect;
  }
}
