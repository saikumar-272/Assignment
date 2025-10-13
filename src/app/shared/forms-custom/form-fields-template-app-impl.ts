import {FormFieldsTemplateAppBaseComponent} from './form-fields-template-app-base';
import {Router} from '@angular/router';
import {ToastNotificationService} from 'src/app/toast-notification-service';

export class FormFieldsTemplateAppImplComponent extends FormFieldsTemplateAppBaseComponent
{
  getUserActionsCustom(apiName : any)
  {
    let userActions : Array<any> = [];
    if(apiName == "RetrievePrivilegeGroupList")
    {
      userActions = [{'actionName' : "configurePrivileges", "actionLabel" : "Configure"}];
    }
    if(apiName == "RetrieveBuyer")
    {
      userActions = [{'actionName' : "registerBuyerAsSeller", "actionLabel" : "Register As Seller"}];
    }
    return userActions;
  }
  async executeUserActionCustom(actionName : any, apiName : any, router: Router, searchResultObject :  any, backendService?:any, toastNotificationService?:ToastNotificationService)
  {
    if(actionName == "configurePrivileges" && apiName =="RetrievePrivilegeGroupList")
    {
      router.navigate(['/in/privilege-group-items'], { queryParams: { id:  searchResultObject.privilegeGroupUUID} });
    }
    if(actionName == "registerBuyerAsSeller" && apiName =="RetrieveBuyer")
    {
        router.navigate(['/in/create-seller'], { queryParams: { "sourceType": "Buyer", "sourceUUID":  searchResultObject.id} });
    }    
  }

  async doAfterUrlParamsInitialised(apiName: any, urlQueryParamsObj: any, currentObjectRef : any, pageSectionNameList : any[]) 
  {
    if(apiName == "createSeller")
    {
      const sellerDataForRegistration : any = await currentObjectRef.backendService.getSellerDataForRegistration(urlQueryParamsObj["sourceType"], urlQueryParamsObj["sourceUUID"]);
      if(sellerDataForRegistration.hasOwnProperty('success') && sellerDataForRegistration['success'] == 0)
      {
        if(sellerDataForRegistration.hasOwnProperty('alert'))
        {
          if(currentObjectRef.toastNotificationService != null)
          {
              currentObjectRef.toastNotificationService.showError(sellerDataForRegistration.alert);
          }
        }
        return;
      }
      currentObjectRef.createSellerSectionData = sellerDataForRegistration;    
    }
  }
  getUpdatedPayload(apiName: string, payload : any, formFieldsDataModel : any, additionalProperties: any, toastNotificationService : ToastNotificationService, backendService: any, currentObjectRef? : any)
  {
    if(apiName =="createSeller")
    {
      let urlQueryParamsObj : any  = this.getUrlQueryParams(apiName, currentObjectRef.currentRoute);
      payload['sourceType'] = urlQueryParamsObj['sourceType'];
      payload['sourceUUID'] = urlQueryParamsObj['sourceUUID'];      
    }
    return payload;
  }  
}
