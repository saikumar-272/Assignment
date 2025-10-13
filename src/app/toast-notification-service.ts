import {Injectable} from '@angular/core';

import {ToastrService} from 'ngx-toastr';
import {Constants} from './shared/util/constants';
import {isBlank} from './shared/util/string-util';

@Injectable({
  providedIn: 'root'
})
export class ToastNotificationService {
  
  constructor(private toastr: ToastrService) { }
  
  showSuccess(message: any, title?: any){
    if (!isBlank(message)) {
      this.toastr.success(message, title)
    }
  }
  
  showError(message: any, title?: any){
    let skipErrorAlert = localStorage.getItem(Constants.SKIP_ERROR_ALERT);
    if (!isBlank(skipErrorAlert) && skipErrorAlert == Constants.YES_NO_YES) {
      return;
    }
    this.toastr.error(message, title)
  }
  
  showInfo(message: any, title?: any){
      this.toastr.info(message, title)
  }
  
  showWarning(message: any, title?: any){
      this.toastr.warning(message, title)
  } 
}
