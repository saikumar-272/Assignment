import {DropDownOption} from "../interfaces/dropdown_option";
import {convertCamelCaseToSentence} from "./string-util";

export class Constants {
  public static DATE_DELIMITER: string = '/';
  public static DATE_DELIMITER_HYPHEN: string = '-';
  public static TIME_DELIMITER_COLON: string = ':';
  public static MAX_DECIMAL_PLACES_AMOUNT: number = 2;
  public static MAX_DECIMAL_PLACES_QUANTITY: number = 3;
  public static REGEX_PAN_NUMBER: string = '^[A-Z]{5}\\d{4}[A-Z]{1}$';
  public static REGEX_AADHAR_NUMBER: string = '^[1-9]{1}\\d{11}$';
  public static REGEX_PINCODE: string = '^[1-9]{1}\\d{5}$';
  public static REGEX_IFSC: string = '^[A-Z]{4}0[A-Z0-9]{6}$';
  public static REGEX_PHONE_NUMBER: string = '^[6-9]{1}\\d{9}$';
  public static REGEX_DECIMAL_AMOUNT: string = `^((([1-9]{1}\\d{0,8})(\\.\\d{${Constants.MAX_DECIMAL_PLACES_AMOUNT}})?)|(0\\.\\d{${Constants.MAX_DECIMAL_PLACES_AMOUNT}}))$`;
  public static REGEX_DECIMAL_QUANTITY: string = `^((([1-9]{1}\\d{0,8})(\\.\\d{1,${Constants.MAX_DECIMAL_PLACES_QUANTITY}})?)|(0\\.\\d{1,${Constants.MAX_DECIMAL_PLACES_QUANTITY}}))$`;
  public static REGEX_DATE: string = '^[0-9]{1,2}/[0-1]?[0-9]{1}/[1-2]{1}[0-9]{3}$';
  public static NAME_FIELD_MAX_LENGTH: number = 50;
  public static DESCRIPTIVE_FIELD_MAX_LENGTH: number = 100;
  public static EMAIL_ID_FIELD_MAX_LENGTH: number = 128;
  public static NUMBER_FIELD_MAX_VALUE = 99999;
  public static AUTH_TOKEN_HEADER_NAME: string = 'X-Auth-Token';
  public static AUTH_SESSION_STORAGE_KEY: string = 'Auth-Session-Id';
  public static API_RESPONSE_TYPE_SUCCESS: number = 1;
  public static API_RESPONSE_TYPE_FAILED: number = 0;
  public static MIN_AGE_ALLOWED = 18;
  public static MAX_AGE_ALLOWED = 78;
  public static DEFAULT_PAGE_SIZE: number = 10;
  public static API_CUSTOM_FORM_FIELD_LIST: string = "Api-Custom-Form-Field-List";
  public static CONFIG_PROPERTIES: string = "Config-Properties";
  public static BACKEND_DOMAIN_PREFIX: string = "Backend-Domain-Prefix";
  public static ERROR_CODE_UPGRADE_IN_PROGRESS = "UPGRADE_IN_PROGRESS";
  public static ERROR_CODE_USE_NEW_VERSION = "USE_NEW_VERSION";
  public static ERROR_CODE_SERVICE_DOWN = "SERVICE_DOWN";
  public static ERROR_CODE_TRANSITION_TO_STABLE_SERVER = "TRANSITION_TO_STABLE_SERVER";
  public static UPGRADE_STATUS_UPGRADE_COMPLETED = "UPGRADE_COMPLETED";
  public static ERROR_CODE = "Error-Code";
  public static SKIP_ERROR_ALERT = "Skip-Error-Alert";
  public static SERVICE_DOWN_MAP: string = "Service-Down-Map";
  public static YES_NO_YES = "Yes";
  public static YES_NO_NO = "No";
  public static NEW_FRONTEND_DOMAIN = "New-Frontend-Domain";
  public static FLEXFIELD_LIST = "Flexfield-List";
  public static ERROR_CODE_USER_TYPE_REQUIRED = "USER_TYPE_REQUIRED";
  public static LOGGED_IN_USER_TYPE = "User-Type";
  public static RESPONSE_CODE_NO_USER_FOUND = "NO_USER_FOUND";
  public static RESPONSE_CODE_PROCEED_WITH_AUTHENTICATION = "PROCEED_WITH_AUTHENTICATION";
  public static RESPONSE_CODE_INCORRECT_DATA = "INCORRECT_DATA";
  public static NEXT_INPUT_USER_TYPE = "USER_TYPE";
}

export const enum UserType {
  STAFF = 'Staff'
}

export const USER_TYPE_OPTIONS: DropDownOption[] = [
  { id: UserType.STAFF, value: convertCamelCaseToSentence(UserType.STAFF) }
];

export const YES_NO_OPTIONS: DropDownOption[] = [
  { id: 1, value: 'Yes' },
  { id: 0, value: 'No' }
]

export const PAGE_SIZE_OPTIONS: DropDownOption[] = [
  { id: 10, value: '10' },
  { id: 25, value: '25' },
  { id: 50, value: '50' },
  { id: 100, value: '100' }];
