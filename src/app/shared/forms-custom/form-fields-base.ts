import {of} from 'rxjs';
import {Constants} from '../util/constants';
import {formatDateAsDDMMYYYY, parseDateFromYYYYMMDD} from '../util/date-util';
import {FileAttachmentDto, RetrieveListResponseModel} from '../interfaces/dto/dto-base';
import ApiMetadata from './ApiMetadata.json';
import OptionsList from './OptionsList.json';
import {ToastNotificationService} from 'src/app/toast-notification-service';
import {compareStringsIgnoreCase, getNumberWithCommaSeparated, isBlank, removeUUIDSuffix} from '../util/string-util';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfigPropertiesService} from '../services/config-properties.service';

export class FormFieldsBaseComponent
{
  //Used to build additional applicable properties for all possible scenarios on page load
  getAdditionalPropertiesOnLoad(apiName: string, toastNotificationService : ToastNotificationService, backendService: any, retrievedObjectInfo?: any)
  {
    let additionalProperties: any = {};
    return additionalProperties;
  }

  //Used to update line items list data
  modifyLineItemsListData(apiName: string, list : Array<any>, toastNotificationService : ToastNotificationService, backendService: any)
  {
    return list;
  }

  //Used to update the api payload
  getUpdatedPayload(apiName: string, payload : any, formFieldsDataModel : any, additionalProperties: any, toastNotificationService : ToastNotificationService, backendService: any, currentObjectRef : any)
  {
    return payload;
  }

  //Used to update the specific line item data
  modifyData(apiName: string, rowDataObject : any, additionalProperties: any, toastNotificationService : ToastNotificationService, backendService: any)
  {
    return rowDataObject;
  }

  getFormFieldList(apiName: String, sectionName?: string, objectRef?: any)
  {
    let formFieldList: any = [];
    let apiRequestParameterList = this.getApiRequestParameters(apiName);
    formFieldList = this.getFormFieldListFromRequestParams(apiName, sectionName, apiRequestParameterList, objectRef)
    return formFieldList;
  }

  getApiRequestParameters(apiName: String)
  {
    let apiRequestParameters: any = [];
    for (let apiInfo of ApiMetadata) {
      if (apiInfo.apiName == apiName) {
        apiRequestParameters = apiInfo.requestParameters
        break;
      }
    }
    return apiRequestParameters;
  }

  async getUpdatedApiParameters(apiName: string, apiParameters: any[], backendService: any, toastNotificationService : any, currentObjectRef? : any)
  {
    if(!this.checkFieldsInjectionEnabledToApi(apiName))
    {
      return apiParameters;
    }
    var requestModel: any = {};
    requestModel.apiName = apiName;
    requestModel.apiParameters = apiParameters;
    requestModel.additionalRequestParamsJsonText = this.getInjectionApiAdditionalRequestParams(apiName, currentObjectRef);
    let response : any = await backendService.getUpdatedApiParameters(requestModel);
    if(response.success != 1)
    {
      toastNotificationService.showSuccess(response.alert);
    }
    let updatedApiParameters = response.apiParameters;
    return updatedApiParameters;
  }

  getInjectionApiAdditionalRequestParams(apiName: String, currentObjectRef : any)
  {
    return "{}";
  }

  checkFieldsInjectionEnabledToApi(apiName: String)
  {
    if(apiName  == "retrieveStudentList")
      return true;
    if(apiName  == "createStudent")
      return true;
    if(apiName  == "retrieveStudent")
      return true;
    if(apiName  == "createCostCenterLineItem")
      return true;
    if(apiName  == "retrieveCostCenterLineItemList")
      return true;
    if(apiName  == "updateCostCenterLineItem")
      return true;
    if(apiName  == "retrieveCostCenterLineItem")
      return true;
    if(apiName  == "createEmployeeSection")
      return true;
    if(apiName  == "retrieveEmployeeSectionList")
      return true;
    if(apiName  == "updateEmployeeSection")
      return true;
    if(apiName  == "retrieveEmployeeSection")
      return true;
    return false;
  }

  getFormFieldListFromRequestParams(apiName: String, sectionName: any, requestParameters: Array<any>, objectRef?: any)
  {
    let formFieldList: any = [];
    for (let parameterInfo of requestParameters) {
      if ((sectionName === undefined || sectionName.length == 0) || sectionName !== undefined && compareStringsIgnoreCase(parameterInfo.sectionName, sectionName)) {
        let fieldInfo = this.getFieldInfo(parameterInfo, apiName, sectionName, objectRef);
        formFieldList.push(fieldInfo);
      }
    }
    return formFieldList;
  }

  getFieldInfo(parameterInfo: any, apiName: String, sectionName?: String, objectRef?: any) {
    if(isBlank(sectionName))
    {
      sectionName = apiName;
    }
    let fieldInfo: any = { key: parameterInfo.key, label: parameterInfo.label, placeholder: parameterInfo.label, required: parameterInfo.isMandatory, hide: parameterInfo.hide, className: parameterInfo.className, isInjectedField: parameterInfo.isInjectedField, additionalProperties : parameterInfo.additionalProperties, apiName : apiName };
    switch (parameterInfo.uiFieldType) {
      case 'Input':
        fieldInfo.type = 'input';
        break;
      case 'Password':
        fieldInfo.type = 'password';
        break;
      case 'Text':
        fieldInfo.type = 'textarea';
        break;
      case 'Combo':
        fieldInfo.type = 'typeahead';
        fieldInfo.templateOptions = { options$: of(OptionsList[parameterInfo.optionsListName]) };
        fieldInfo.objectReference = objectRef;
        fieldInfo.showHideDependentFields = parameterInfo.showHideDependentFields;
        fieldInfo.showHideSections = parameterInfo.showHideSections;
        break;
      case 'Boolean':
        fieldInfo.type = 'typeahead';
        fieldInfo.templateOptions = { options$: of([{ id: true, value: 'Yes' }, { id: false, value: 'No' }]) };
        fieldInfo.objectReference = objectRef;
        fieldInfo.showHideDependentFields = parameterInfo.showHideDependentFields;
        fieldInfo.showHideSections = parameterInfo.showHideSections;
        break;
      case 'Calender':
        fieldInfo.type = 'date';
        break;
      case 'Time':
        fieldInfo.type = 'time';
        break;
      case 'DateTime':
        fieldInfo.type = 'datetime';
        break;
      case 'Lookup':
      case 'Flexfield':
        fieldInfo.type = 'typeahead';
        fieldInfo.uiFieldType = parameterInfo.uiFieldType;
        fieldInfo.objectReference = objectRef;
        fieldInfo.flexfieldName = parameterInfo.flexfieldName;
        fieldInfo.optionsMethod = parameterInfo.lookupApiName;
        fieldInfo.parentLookupModelName = parameterInfo.parentLookupModelName;
        fieldInfo.parentLookupFieldName = parameterInfo.parentLookupFieldName;
        fieldInfo.flexfieldCode = parameterInfo.flexfieldCode;
        fieldInfo.optionsMethod = parameterInfo.lookupApiName;
        if (parameterInfo.uiFieldType === 'Flexfield') {
          fieldInfo.isFlexfield = true;
        }
        fieldInfo.templateOptions = {
          // refreshData: true,
          realTimeData: true,
          suffixButtons: [{
            faIcon: 'fa-plus',
            internal: true,
            serviceName: parameterInfo.serviceName,
            url: parameterInfo.createPageUrl
          }]
        };
        if (!isBlank(parameterInfo.hideForUserType)) {
          const hideUserTypes = parameterInfo.hideForUserType.split(',').map((type: string) => type.trim());
          const loggedInUserType = localStorage.getItem(Constants.LOGGED_IN_USER_TYPE);
          if (hideUserTypes.includes(loggedInUserType)) {
            fieldInfo.hide = true;
          }
        }
        break;
      case 'SearchPopup':
        fieldInfo.type = 'searchpopup';
        fieldInfo.objectReference = objectRef;
        fieldInfo.sectionName = this.toInitLower(sectionName);
        fieldInfo.id = parameterInfo.key;
        break;
      case 'File':
        fieldInfo.type = 'file';
        fieldInfo.templateOptions = { accept: "image/*,.pdf" };
        fieldInfo.objectReference = objectRef;
        break;
      case 'RichText':
        fieldInfo.type = 'richtext';
        fieldInfo.objectReference = objectRef;
        fieldInfo.sectionName = this.toInitLower(sectionName);
        break;
    }
    return fieldInfo;
  }

  toInitLower(inputString?: String) {
    if (!inputString) {
      return inputString;
    }
    return inputString.charAt(0).toLowerCase() + inputString.slice(1);
  }

  getTableColumnListFromResponseParams(responseParameters: Array<any>)  : Array<any>
  {
    let tableColumnList: any = [];
    for (let parameterInfo of responseParameters) {
      let fieldInfo = this.getTableColumnInfo(parameterInfo);
      tableColumnList.push(fieldInfo);
    }
    return tableColumnList;
  }

  getTableColumnInfo(parameterInfo: any) {
    let columnInfo: any = { key: parameterInfo.key, label: parameterInfo.label, displayClassName : parameterInfo.displayClassName, dataType:parameterInfo.dataType, disableCommasInNumberDisplay: parameterInfo.disableCommasInNumberDisplay };
    switch (parameterInfo.uiFieldType) {
      case 'Input':
        columnInfo.type = 'input';
        break;
      case 'TextArea':
        columnInfo.type = 'textArea';
        break;
      case 'SearchPopup':
        columnInfo.type = 'input';
        break;
      case 'Combo':
        columnInfo.type = 'combo';
        columnInfo.optionsListName = parameterInfo.optionsListName;
        break;
      case 'Lookup':
        columnInfo.type = 'lookup';
        columnInfo.retrievePageUrl = parameterInfo.retrievePageUrl;
        columnInfo.isOtherService =  parameterInfo.isOtherService;
        columnInfo.otherServiceContextPath =  parameterInfo.otherServiceContextPath;
        break;
      case 'Calender':
        columnInfo.type = 'date';
        break;
      case 'DateTime':
        columnInfo.type = 'dateTime';
        break;
      case 'DateTimeWithSeconds':
        columnInfo.type = 'dateTimeWithSeconds';
        break;
      case 'Time':
        columnInfo.type = 'time';
        break;
      case 'TimeWithSeconds':
        columnInfo.type = 'timeWithSeconds';
        break;
      case 'Boolean':
        columnInfo.type = 'boolean';
        break;
      case 'File':
        columnInfo.type = 'file';
        columnInfo.enablePublicAccess = parameterInfo.enablePublicAccess;
        columnInfo.showImage = parameterInfo.showImage;
        break;
      case 'RichText':
        columnInfo.type = 'richtext';
        break;
    }
    return columnInfo;
  }

  //Retrieve page apis
  getRetrievePageFieldList(apiName: String, sectionName : String)  : Array<any>
  {
    let retrievePageFieldList: any = [];
    let apiResponseParameterList = this.getApiResponseParameters(apiName);
    retrievePageFieldList = this.getRetrievePageFieldListFromResponseParams(apiName, sectionName, apiResponseParameterList);
    return retrievePageFieldList;
  }

  getRetrievePageFieldListFromResponseParams(apiName: String, sectionName : String, responseParameters: Array<any>)  : Array<any>
  {
    let retrievePageFieldList: any = [];
    for (let parameterInfo of responseParameters) {
      if (compareStringsIgnoreCase(parameterInfo.sectionName, sectionName)) {
        let fieldInfo = this.getRetrievePageFieldInfo(parameterInfo, apiName, sectionName);
        if (!isBlank(parameterInfo.hideForUserType)) {
          const hideUserTypes = parameterInfo.hideForUserType.split(',').map((type: string) => type.trim());
          const loggedInUserType = localStorage.getItem(Constants.LOGGED_IN_USER_TYPE);
          if (hideUserTypes.includes(loggedInUserType)) {
            continue;
          }
        }
        retrievePageFieldList.push(fieldInfo);
      }
    }
    return retrievePageFieldList;
  }

  getRetrievePageFieldInfo(parameterInfo: any, apiName: String, sectionName?: String) {
    let fieldInfo: any = { key: parameterInfo.key, label: parameterInfo.label, displayClassName: parameterInfo.displayClassName, dataType:parameterInfo.dataType, disableCommasInNumberDisplay: parameterInfo.disableCommasInNumberDisplay };
    switch (parameterInfo.uiFieldType) {
      case 'Input':
        fieldInfo.type = 'input';
        break;
      case 'TextArea':
        fieldInfo.type = 'textArea';
        break;
      case 'SearchPopup':
        fieldInfo.type = 'input';
        break;
      case 'Combo':
        fieldInfo.type = 'combo';
        fieldInfo.optionsListName = parameterInfo.optionsListName;
        break;
      case 'Lookup':
        fieldInfo.type = 'lookup';
        fieldInfo.retrievePageUrl = parameterInfo.retrievePageUrl;
        fieldInfo.isOtherService =  parameterInfo.isOtherService;
        fieldInfo.otherServiceContextPath =  parameterInfo.otherServiceContextPath;
        break;
      case 'Calender':
        fieldInfo.type = 'date';
        break;
      case 'DateTime':
        fieldInfo.type = 'dateTime';
        break;
      case 'DateTimeWithSeconds':
        fieldInfo.type = 'dateTimeWithSeconds';
        break;
      case 'Time':
        fieldInfo.type = 'time';
        break;
      case 'TimeWithSeconds':
        fieldInfo.type = 'timeWithSeconds';
        break;
      case 'Boolean':
        fieldInfo.type = 'boolean';
        break;
      case 'File':
        fieldInfo.type = 'file';
        fieldInfo.sectionName = this.toInitLower(sectionName);
        fieldInfo.enablePublicAccess = parameterInfo.enablePublicAccess;
        break;
      case 'RichText':
        fieldInfo.type = 'richtext';
        fieldInfo.sectionName = this.toInitLower(sectionName);
        break;
    }
    return fieldInfo;
  }

  getPropertyValue(searchResultObject : any, tableColumn : any, uiPageType? : string, apiName? : string)
  {
    if(tableColumn.type === "boolean"){
      var booleanValue = searchResultObject[tableColumn.key];
      if (booleanValue == null) {
        return "";
      }
      const valueStr = String(booleanValue).toLowerCase();
      return valueStr === 'true' ? "Yes" : "No";
    }
    else if(tableColumn.type === "date"){
      var dateValue = searchResultObject[tableColumn.key];
      if(dateValue == null || dateValue.length==0){
        return "";
      }
      return formatDateAsDDMMYYYY(parseDateFromYYYYMMDD(dateValue));
    }
    else if(tableColumn.type === "file"){
      var attachments : Array<FileAttachmentDto> = searchResultObject[tableColumn.key];
      if(attachments == null || attachments.length == 0){
        return "No Attachment";
      }
      let attachment : FileAttachmentDto =  attachments[0];
      if(uiPageType != null && uiPageType == "Search")
      {
        if(attachment.fileType == "Image")
        {
          let displayContent = attachment.fileName;
          if(tableColumn.showImage)
          {
            displayContent = '<img src="' + attachment.imageRenderingUrl + '" alt="' + attachment.fileName + '" width="60" height="60">'
          }
          var image1 = '<a href="' + attachment.fileUrl + '" target="_blank">' + displayContent + '</a>';
          return image1;
        }
      }
      var link1 = '<a href="' + attachment.fileUrl + '" target="_blank">' + attachment.fileName + '</a>';
      return link1;
    }
    const disableCommasInNumberDisplay = String(tableColumn.disableCommasInNumberDisplay).toLowerCase() === 'true' ? true : false;
    if(tableColumn.dataType == "BigDecimal" && !disableCommasInNumberDisplay){
      return getNumberWithCommaSeparated(searchResultObject[tableColumn.key]);
    }
    return searchResultObject[tableColumn.key];
  }

  
  
  
  
  
  
  
  
  

  getComboParameterValue(inputValue : any)
  {
    return (inputValue !=  null && inputValue.length == 0) ? null : inputValue;
  }
  getBooleanParameterValue(inputValue : any)
  {
    return  inputValue != null ? (inputValue + '') : inputValue;
  }
  updateDisplayPropertyOfApiParameterDependentFields(apiName : string,  dataObject : any, pageSectionNameList: any[], currentObjectRef : any)
  {
    for(let apiInfo of ApiMetadata)
    {
      if(apiInfo.apiName == apiName)
      {
        for(let parameterInfo of apiInfo.showHideParameters)
        {
          let parameterName = parameterInfo['parameterName'];
          this.updateDependentFieldsDisplayProps(apiName, parameterName, dataObject[parameterName], currentObjectRef, pageSectionNameList);
        }
      }
    }
  }
  getApiParamShowHideInfo(apiName : string, key : string, selectedValue: any)
  {
    for(let apiInfo of ApiMetadata)
    {
      if(apiInfo.apiName == apiName)
      {
        for(let parameterInfo of apiInfo.showHideParameters)
        {
          if(parameterInfo.parameterName == key)
          {
            for(let showHideFieldInfo of parameterInfo.showHideParameterValueList)
            {
              selectedValue = selectedValue == null ? "" : selectedValue;
              if(null != selectedValue && showHideFieldInfo.value == selectedValue.toString())
              {
                return showHideFieldInfo;
              }
            }
            break;
          }
        }
        break;
      }
    }
    return null;
  }
  updateDisplayPropertyOfSections(apiName : string, key : string,  selectedValue : any, sectionsShowHideInfo: any)
  {
    let paramShowHideInfo = this.getApiParamShowHideInfo(apiName, key, selectedValue);
    if(paramShowHideInfo == null) return;
    let displaySectionsList = paramShowHideInfo.displaySectionsList;
    let hiddenSectionsList = paramShowHideInfo.hiddenSectionsList;
    for (let i = 0; i < displaySectionsList.length; i++)
    {
      let displaySectionName = displaySectionsList[i];
      if(sectionsShowHideInfo.hasOwnProperty(displaySectionName))
        sectionsShowHideInfo[displaySectionName] = true;
    }
    for (let i = 0; i < hiddenSectionsList.length; i++)
    {
      let hiddenSectionName = hiddenSectionsList[i];
      if(sectionsShowHideInfo.hasOwnProperty(hiddenSectionName))
        sectionsShowHideInfo[hiddenSectionName] = false;
    }
  }

  doCustomActionOnApiSuccess(apiName: any, router: Router, response?:any, backendService?: any, toastNotificationService?:ToastNotificationService) {
    setTimeout(() => { window.location.reload(); }, 1000);
  }
  async doAfterRowAdded(lineItemList: Array<any>, apiName: string, backendService: any, toastNotificationService: ToastNotificationService, objectRef?: any, formDataModel?: any, requestModel?: any, additionalProperties?: any) {
  }

  validateNumberFieldInputValue(numberFieldList : any[], requestModel: any)
  {
    let numberValidationErrorMessage : string = "";
    for(let numberFieldInfo of numberFieldList)
    {
      if(numberFieldInfo.conditionType == "Positive")
      {
        if(!isBlank(requestModel[numberFieldInfo.key]) && requestModel[numberFieldInfo.key] <= 0)
          {
            numberValidationErrorMessage += numberFieldInfo.label + " : Positive number only allowed.\n";
          }
      }
      if(numberFieldInfo.conditionType == "PositiveOrZero")
      {
        if(!isBlank(requestModel[numberFieldInfo.key]) && requestModel[numberFieldInfo.key] < 0)
        {
          numberValidationErrorMessage += numberFieldInfo.label + " : Negative value is not allowed.\n";
        }
      }
    }
    return numberValidationErrorMessage;
  }

  resetDependentLookupFieldsData(sectionDataObjectList : any, dependentLookupFieldKeyNameList :  any)
  {
    if(sectionDataObjectList ==  null || sectionDataObjectList === undefined ||
      dependentLookupFieldKeyNameList == null || dependentLookupFieldKeyNameList ===  undefined)
    {
      return;
    }
    for (let i = 0; i < dependentLookupFieldKeyNameList.length; i++)
    {
      for (let j = 0; j < sectionDataObjectList.length; j++)
      {
        let sectionDataObject = sectionDataObjectList[j];
        if(sectionDataObject.hasOwnProperty(dependentLookupFieldKeyNameList[i]))
        {
          sectionDataObject[dependentLookupFieldKeyNameList[i]] = null;
        }
      }
    }
  }

  updateDisplayPropertyOfContextFlexfields(selectedValue: any, sectionFields: any[], flexfieldCode:string, backendService?: any, sectionModel?: any, onChange?:boolean, isSearchForm?:boolean) {
    let flexfieldObj: any = this.getFlexfieldObj(flexfieldCode, backendService);
    if (flexfieldObj == null) {
      return;
    }
    let contextList: Array<any> = flexfieldObj.contextValueList;
    const combinedArray: any[] = [].concat(...contextList.map(context => context.segmentList));
    const uniqueKeys: Set<string> = new Set(combinedArray.map(obj => obj.key));
    const uniqueKeysArray: string[] = Array.from(uniqueKeys);
    for (let i = 0; i < sectionFields.length; i++) {
      let sectionFieldInfo = sectionFields[i];
      if (uniqueKeysArray.some(key => key.toLowerCase() === sectionFieldInfo.key.toLowerCase())) {
        sectionFieldInfo!.hide = true;
        sectionFieldInfo['displayClassName'] = 'hide';
        if(onChange){
          sectionModel[sectionFieldInfo.key] = '';
        }
      }
      sectionFields[i] = sectionFieldInfo;
    }
    if (isBlank(selectedValue)) {
      return;
    }
    let contextSegmentsObj = this.getSelectedContextSegmentList(selectedValue, contextList);
    for (let i = 0; i < sectionFields.length; i++) {
      let sectionFieldInfo = sectionFields[i];
      let matchingFlexField = this.getMatchingSegment(sectionFieldInfo.key, contextSegmentsObj.segmentList);
      if ((matchingFlexField != null && !isSearchForm) || (matchingFlexField != null && isSearchForm && this.isMatchingSegmentSearchEnabled(sectionFieldInfo.key, contextSegmentsObj.segmentList))) {
        sectionFieldInfo['displayClassName'] = '';
        if(sectionFieldInfo.templateOptions){
          sectionFieldInfo.templateOptions!.label = matchingFlexField.label;
          sectionFieldInfo.templateOptions!.placeholder = matchingFlexField.label;
        }
        else{
          sectionFieldInfo.label = matchingFlexField.label;
        }
        sectionFieldInfo!.hide = false;
      }
      sectionFields[i] = sectionFieldInfo;
    }
  }

  getMatchingSegment(key: string, selectedContextFieldList: any[]) {
    return selectedContextFieldList.find(item => item.key.toLowerCase() === key.toLowerCase()) || null;
  }

  getSelectedContextSegmentList(contextValue: string, contextSegments: any[]) {
    return contextSegments.find(item => item.contextValue === contextValue) || null;
  }

  isMatchingSegmentSearchEnabled(key: string, selectedContextFieldList: any[]) {
    return selectedContextFieldList.some(item => item.key === key && item.enableSearch === true);
  }

  getFlexfieldObj(flexfieldCode : any, backendService? : any) {
    let flexfieldListString: string = localStorage.getItem(Constants.FLEXFIELD_LIST) || '';
    if (isBlank(flexfieldListString)) {
      this.initializeContextSegements(backendService);
      flexfieldListString  = localStorage.getItem(Constants.FLEXFIELD_LIST) || '';
      console.log(flexfieldListString);
    }
    let flexfieldList : Array<any> = JSON.parse(flexfieldListString) ;
    return flexfieldList.find(item => item.flexfieldCode === flexfieldCode) || null;
  }

  async initializeContextSegements(backendService ?: any) {
    if (backendService != undefined ) {
      let searchResponse = <RetrieveListResponseModel>await backendService.retrieveFlexfieldContextSegmentsMap({});
      if (searchResponse.success == 1) {
        let flexfieldList : Array<any> = [];
        flexfieldList = flexfieldList.concat(searchResponse.list);
        localStorage.setItem(Constants.FLEXFIELD_LIST, JSON.stringify(flexfieldList));
      }
    }
  }
  getLookupSearchData(fieldConfig: any, lookupAdditionalInputs : any)
  {
    const objectReference = fieldConfig.objectReference;
    return lookupAdditionalInputs;
  }

  getLookupInputsFromAdditionalProperties(fieldConfig: any)
  {
    if(fieldConfig.hasOwnProperty("additionalProperties") && !isBlank(fieldConfig.additionalProperties))
    {
      let additionalProperties = fieldConfig.additionalProperties;
      try {
        return JSON.parse(additionalProperties);
      } catch (error) {
        console.error('Error parsing additionalProperties:', error);
        alert("Error while parsing lookup 'additionalProperties'.");
        return;
      }
    }
    return {};
  }

  getUpdatedInjectedFieldsDataJsonText(injectedFieldsDataJsonText: string, sectionFields: any, sectionDataModel: any)
  {
    let updatedInjectedFieldsData = injectedFieldsDataJsonText ? JSON.parse(injectedFieldsDataJsonText) : {};
    for(let field of sectionFields)
    {
      if (field.hasOwnProperty("isInjectedField") && compareStringsIgnoreCase(field.isInjectedField, "true")) {
        if (sectionDataModel.hasOwnProperty(field.key)) {
          updatedInjectedFieldsData[field.key] = sectionDataModel[field.key];
        }
      }
    }
    return JSON.stringify(updatedInjectedFieldsData);
  }

  getApiResponseParameters(apiName: String)
  {
    let apiResponseParameters: any = [];
    for (let apiInfo of ApiMetadata) {
      if (apiInfo.apiName == apiName) {
        apiResponseParameters = apiInfo.responseParameters
        break;
      }
    }
    return apiResponseParameters;
  }

  updateRetrieveApiDataObjectWithInjectedFieldsData(retrieveApiDataObject: any, toastNotificationService : ToastNotificationService)
  {
    return this.updateDataObjectWithInjectedFieldsData(retrieveApiDataObject, toastNotificationService);
  }

  updateDataObjectWithInjectedFieldsData(dataObject: any, toastNotificationService : ToastNotificationService)
  {
    // Check if injectedFieldsDataJsonText exists and is a valid JSON string
    if (dataObject && dataObject.injectedFieldsDataJsonText) {
      try {
        const injectedFieldsData = JSON.parse(dataObject.injectedFieldsDataJsonText);
        // Iterate through the properties of the parsed object and add them to retrieveApiDataObject
        for (const key in injectedFieldsData) {
          if (injectedFieldsData.hasOwnProperty(key)) {
            dataObject[key] = injectedFieldsData[key];
          }
        }
      } catch (error) {
        console.error('Error parsing injectedFieldsDataJsonText:', error);
        toastNotificationService.showError("Error while parsing 'injectedFieldsDataJsonText'.");
        return;
      }
    }
    return dataObject;
  }

  updateLookupDisplayTextMapWithInjectedFieldsDisplayText(dataObject: any, lookupDisplayTextMap: any,toastNotificationService : ToastNotificationService)
  {
    if (dataObject && dataObject.injectedFieldsDataJsonText) {
      try {
        const injectedFieldsData = JSON.parse(dataObject.injectedFieldsDataJsonText);
        for (const key in injectedFieldsData) {
          let lookupFieldKeyName = removeUUIDSuffix(key) + "DisplayText";
          lookupDisplayTextMap[key] = dataObject[lookupFieldKeyName];
        }
      } catch (error) {
        console.error('Error parsing injectedFieldsDataJsonText:', error);
        toastNotificationService.showError("Error while parsing 'injectedFieldsDataJsonText'.");
        return;
      }
    }
    return lookupDisplayTextMap;
  }

  updateListApiDataWithInjectedFieldsData(dataList: Array<any>, toastNotificationService : ToastNotificationService)
  {
    for (let i = 0; i < dataList.length; i++) {
      let dataObject = dataList[i];
      this.updateDataObjectWithInjectedFieldsData(dataObject, toastNotificationService);
      dataList[i] = dataObject;
    }
    return dataList;
  }

  updatePayloadWithInjectedLookupFieldDisplayText(payload : any, apiFormFields: any, lookupDisplayTextMap: any)
  {
    for(let field of apiFormFields)
    {
      if (field.hasOwnProperty("isInjectedField") && compareStringsIgnoreCase(field.isInjectedField, "true")) {
        if(field.uiFieldType == "Lookup")
        {
          if (lookupDisplayTextMap.hasOwnProperty(field.key)) {
            let lookupFieldKeyName = removeUUIDSuffix(field["key"]) + "DisplayText";
            payload[lookupFieldKeyName] = lookupDisplayTextMap[field["key"]];
          }
        }
      }
    }
    return payload;
  }

  updateInjectedFieldsSelectedLookupData(selectedLookupsDataListObj : any, dataObjectInfo : any){
    //Set injected fields selected data
    if (!isBlank(dataObjectInfo.injectedFieldsDataJsonText))
    {
      const injectedFieldsData = JSON.parse(dataObjectInfo.injectedFieldsDataJsonText);
      for (const injectedFieldKeyName in injectedFieldsData) {
        if (injectedFieldsData.hasOwnProperty(injectedFieldKeyName)) {
          if(!isBlank(dataObjectInfo[injectedFieldKeyName]))
          {
            let selectedLookupDisplayText = dataObjectInfo[(injectedFieldKeyName + "DisplayText")];
            if(dataObjectInfo[(injectedFieldKeyName + "SelectedLookupDisplayText")])
            {
              selectedLookupDisplayText = dataObjectInfo[(injectedFieldKeyName + "SelectedLookupDisplayText")];
            }
            selectedLookupsDataListObj[injectedFieldKeyName] = of([{"id" : dataObjectInfo[injectedFieldKeyName], "value": selectedLookupDisplayText}]);
          }
        }
      }
    }
  }

  setDataToFormOnload(apiName: any, router : Router, currentRoute: ActivatedRoute, currentObjectRef : any) {

  }

  updateDisplayClassNameForFields(fieldList: any[], fieldListToHide : string[]): any[] {
    for(let fieldToHide of fieldListToHide)
    {
      for(let field of fieldList)
      {
        let fieldKeyName = field["key"];
        if(fieldKeyName == fieldToHide)
        {
          //For form fields
          field['className'] = "hide";
          //For view page fields and table columns
          field['displayClassName'] = "hide";
          field['hide'] = true;
          break;
        }
      }
    }
    return fieldList;
  }

  onPageInit(apiName: any, currentRoute: ActivatedRoute, currentObjectRef : any, pageSectionNameList : any[]) {
    let urlQueryParamsObj : any  = this.getUrlQueryParams(apiName, currentRoute);
    this.initialiseFieldsFromUrlParams(apiName, urlQueryParamsObj, pageSectionNameList, currentObjectRef);
  }

  getUrlQueryParams(apiName: any, currentRoute: ActivatedRoute)
  {
    let urlQueryParamsObj : any  = {};
    currentRoute.queryParams.subscribe(params => {
      for (const key in params) {
        // Convert string "true"/"false" values to actual boolean types
        if ("true" === params[key] || "false" === params[key]) {
          urlQueryParamsObj[key] = ("true" === params[key]);
        } else {
          urlQueryParamsObj[key] = params[key];
        }
      }
    });
    return urlQueryParamsObj;
  }

  doAfterUrlParamsInitialised(apiName: any, urlQueryParamsObj: any, currentObjectRef : any, pageSectionNameList : any[]) {
  }

  doAfterModelLoaded(apiName: any, currentObjectRef : any, retrievedObjectInfo: any) {
  }

  initialiseFieldsFromUrlParams(apiName: any, urlQueryParamsObj: any, pageSectionNameList : any[], currentObjectRef : any)
  {
    // Skip empty object
    if (Object.keys(urlQueryParamsObj).length === 0) return;
    //Set url param values to forms
    setTimeout(() => {
      for(let sectionName of pageSectionNameList)
      {
        //Copy url query params into section data object
        const sectionDataObject = currentObjectRef[sectionName + "SectionData"];
        const sectionFields  = currentObjectRef[sectionName + "SectionFields"];
        for (let sectionFieldInfo of sectionFields) {
          let fieldKeyName = sectionFieldInfo.key;
          if (urlQueryParamsObj.hasOwnProperty(fieldKeyName)) {
            sectionDataObject[fieldKeyName] = urlQueryParamsObj[fieldKeyName];
          }
        }
      }
      this.doAfterUrlParamsInitialised(apiName, urlQueryParamsObj, currentObjectRef, pageSectionNameList);
    }, 100);
    //Hide dependent fiels
    for (const key in urlQueryParamsObj) {
      currentObjectRef.updateDisplayPropertyOfAField?.(apiName, key, urlQueryParamsObj[key]);
    }
  }

  updateDependentFieldsDisplayProps(apiName : string, parentFieldKeyName : string,  parentFieldSelectedValue : any, currentObjectRef: any, pageSectionNameList : any[])
  {
    let paramShowHideInfo = this.getApiParamShowHideInfo(apiName, parentFieldKeyName, parentFieldSelectedValue);
    if(paramShowHideInfo == null) return;
    let dependentDisplayFieldList = paramShowHideInfo.displayFieldsList;
    let dependentHiddenFieldsList = paramShowHideInfo.hiddenFieldsList;

    for(let sectionName of pageSectionNameList)
    {
      let sectionFieldList = [];
      let sectionDataObject : any = {};
      sectionFieldList = currentObjectRef[sectionName + "SectionFields"];
      sectionDataObject = currentObjectRef[sectionName + "SectionData"];
      if(!sectionFieldList)
      {
        sectionFieldList = currentObjectRef[sectionName + "FieldList"];//Used to get retrieve page fields
      }
      if(!sectionFieldList){
        return;
      }
      for (let i = 0; i < sectionFieldList.length; i++)
      {
        let sectionFieldInfo = sectionFieldList[i];
        // Show the field if it is in the display list
        if(dependentDisplayFieldList.includes(sectionFieldInfo.key))
        {
          sectionFieldInfo!.hide = false;
          sectionFieldInfo['displayClassName'] = '';
        }
        // Hide the field if it's in the hidden list and clear its value in the model
        if(dependentHiddenFieldsList.includes(sectionFieldInfo.key))
        {
          sectionFieldInfo!.hide = true;
          sectionFieldInfo['displayClassName'] = 'hide';
          if(sectionDataObject)
          {
            sectionDataObject[sectionFieldInfo.key] = '';// Clear field value when hiding
          }
        }
        sectionFieldList[i] = sectionFieldInfo;
      }
    }
  }

  hideAField(key : string,  sectionFields: any[])
  {
    for (let i = 0; i < sectionFields.length; i++)
    {
      let sectionFieldInfo = sectionFields[i];
      if(sectionFieldInfo.key==key)
      {
        sectionFieldInfo!.hide = true;
        sectionFieldInfo['displayClassName'] = 'hide';
        sectionFields[i] = sectionFieldInfo;
      }
    }
  }

  displayAField(key : string,  sectionFields: any[])
  {
    for (let i = 0; i < sectionFields.length; i++)
    {
      let sectionFieldInfo = sectionFields[i];
      if(sectionFieldInfo.key==key)
      {
        sectionFieldInfo!.hide = false;
        sectionFieldInfo['displayClassName'] = '';
        sectionFields[i] = sectionFieldInfo;
      }
    }
  }

  doAfterPageDataLoaded(apiName: any, currentRoute: ActivatedRoute, currentObjectRef : any, retrievedObjectInfo: any) {

  }

  getPageErrors(errors : any)
  {
    let pageErrors: any = [];
    if(!errors) {
        return pageErrors;
    }
    for(let error of errors)
    {
      pageErrors.push(error.message)
    }
    return pageErrors;
  }

  populateFieldLevelErrors(apiName: any, errors : any)
  {
    let pageErrors: any = [];
    if(!errors) {
        return pageErrors;
    }
    for(let error of errors)
    {
        if(error.field) {
            let divElement = document.getElementById(apiName + '_' + error.field + '_error_div');
            if(divElement) {
                divElement.innerHTML = error.message;
            }
        }
    }
    return pageErrors;
  }

  resetFormErrors(apiName: String)
  {
    let apiRequestParameters: any = this.getApiRequestParameters(apiName);
    for (let apiRequestParameter of apiRequestParameters) {
        let divElement = document.getElementById(apiName + '_' + apiRequestParameter.key + '_error_div');
        if(divElement) {
            divElement.innerHTML = '';
        }
    }
  }

  getListApiTableColumnListCustom(apiName: string, responseParameterList: Array<any>, currentObjectRef : any)
  {
    let tableColumnList = this.getTableColumnListFromResponseParams(responseParameterList);
    return tableColumnList;
  }

  async getApiRequestParameterListCustom(apiName: string, backendService : any, toastNotificationService : ToastNotificationService)
  {
    let apiRequestParameterList = this.getApiRequestParameters(apiName);
    apiRequestParameterList = this.updateApiFieldsDisplayClassNameFromConfig(apiName, apiRequestParameterList);
    apiRequestParameterList = await this.getUpdatedApiParameters(apiName, apiRequestParameterList, backendService, toastNotificationService);
    //Update apiName in request params
    apiRequestParameterList = apiRequestParameterList.map((param : any) => ({
      ...param,
      apiName: apiName
    }));
    return apiRequestParameterList;
  }

  getSectionFormFieldListCustom(apiName: string, sectionName: string, requestParamList: Array<any>, objectRef: any, backendService : any)
  {
    let sectionFormFieldList = this.getFormFieldListFromRequestParams(apiName, sectionName, requestParamList, objectRef)
    return backendService.convertPageFieldsFromApi(sectionFormFieldList);
  }

  getUpdatedTableColumns(tableBaseColumnList : Array<any>, columnName : string, insertionType : string, newTableColumnList : Array<any>) : Array<any>
  {
      let tableColumnList = [];
      for(let tableBaseColumn of tableBaseColumnList)
      {
          if(tableBaseColumn["key"] == columnName)
          {
              if(insertionType == "After")
                tableColumnList.push(tableBaseColumn);
              for(let newTableColumn of newTableColumnList)
              {
                tableColumnList.push(newTableColumn);
              }
              if(insertionType == "Before")
                tableColumnList.push(tableBaseColumn);
          }
          else
            tableColumnList.push(tableBaseColumn);
      }
      return tableColumnList;
  }
  //Retrieve page apis
  async getApiResponseParameterListCustom(apiName: string, backendService : any, toastNotificationService : ToastNotificationService, currentObjectRef? : any)
  {
    let apiResponseParameterList = this.getApiResponseParameters(apiName);
    apiResponseParameterList = this.updateApiFieldsDisplayClassNameFromConfig(apiName, apiResponseParameterList);
    apiResponseParameterList = await this.getUpdatedApiParameters(apiName, apiResponseParameterList, backendService, toastNotificationService, currentObjectRef);
    return apiResponseParameterList;
  }

  getRetrievePageSectionFieldListCustom(apiName: string, sectionName : String, responseParamList: Array<any>, additionalProperties? : any)  : Array<any>
  {
    let sectionFieldList = this.getRetrievePageFieldListFromResponseParams(apiName, sectionName, responseParamList);
    return sectionFieldList;
  }

  getRetrievePageFieldListCustom(pageName: string, sectionName : String, additionalProperties? : any)  : Array<any>
  {
    let retrievePageFieldsList = this.getRetrievePageFieldList(pageName, sectionName);
    return retrievePageFieldsList;
  }

  async doAfterLookupValueSelected(selectedValue : string, apiName : string, currentObjectRef : any, field : any)
  {

  }
  getUserActionsCustom(apiName : any)
  {
    let userActions : Array<any> = [];
    if(apiName == "RetrievePrivilegeGroupList")
    {
      userActions = [{'actionName' : "configurePrivileges", "actionLabel" : "Configure"}];
    }
    return userActions;
  }
  executeUserActionCustom(actionName : any, apiName : any, router: Router, searchResultObject :  any, backendService?:any, toastNotificationService?:ToastNotificationService)
  {
    if(actionName == "configurePrivileges" && apiName =="RetrievePrivilegeGroupList")
    {
      router.navigate(['/in/privilege-group-items'], { queryParams: { id:  searchResultObject.privilegeGroupUUID} });
    }
  }
  doAfterSave(apiName: string, requestModel: any, responseModel : any, currentObjectRef: any, router: Router, currentRoute: ActivatedRoute, backendService: any, toastNotificationService:ToastNotificationService)
  {
    return true;
  }
  getSectionFieldsFromApiRequestParams(sectionName: string, apiRequestParamList: Array<any>, currentObjectRef: any)
  {
    if(isBlank(sectionName)){
      return apiRequestParamList;
    }
    return apiRequestParamList.filter(parameterInfo => compareStringsIgnoreCase(parameterInfo.sectionName, sectionName));
  }

  updateApiFieldsDisplayClassNameFromConfig(apiName: string, apiFieldList: any[]): any[] {
    let configPropertiesService : ConfigPropertiesService = new ConfigPropertiesService();
    let fieldListToHide = configPropertiesService.getApiFieldListToHide(apiName);
    apiFieldList = this.updateDisplayClassNameForFields(apiFieldList, fieldListToHide);
    return apiFieldList;
  }

  getAdditionalLoginFields() {
      return [];
  }

  updateWithCustomLoginParams(requestModel: any, sesctionData:any) { }

  rearrangeFields(fields: any[]): any[] {
      return fields;
  }

  updateDisplayProperties(nextInput: string, loginSectionFields : any[]) {
    return loginSectionFields.map((field: any) => {
      const updatedField = { ...field, disable: true }; // default: all disabled
      // Enable/unhide based on conditions
      if (nextInput === Constants.NEXT_INPUT_USER_TYPE && field.key === "userType") {
        Object.assign(updatedField, { hide: false, disable: false, displayClassName: '' });
      }
      else if (isBlank(nextInput) && field.key === "password") {
        Object.assign(updatedField, { hide: false, disable: false, displayClassName: '' });
      }
      return updatedField;
    });
  }

}
