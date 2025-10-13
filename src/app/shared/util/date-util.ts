import {Injectable} from "@angular/core";
import {NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {Constants} from "./constants";
import {isBlank} from "./string-util";

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  parse(value: string): NgbDateStruct | null {
    if (value && (new RegExp(Constants.REGEX_DATE)).test(value)) {
      return parseDateFromDDMMYYYY(value);
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? formatDateAsDDMMYYYY(date) : '';
  }
}

/**
 * Converts a database-formatted date string (YYYY-MM-DD)
 * into a user interface-friendly format (DD/MM/YYYY).
 *
 * @param dateValue - The date string from the database (e.g., "2025-07-25")
 * @returns A formatted date string for display (e.g., "25/07/2025"), or an empty string if input is invalid
 */
export function convertDBDateToUI(dateValue: string): string {
  if (isBlank(dateValue)) {
    return '';
  }
  return formatDateAsDDMMYYYY(parseDateFromYYYYMMDD(dateValue));
}

/**
 * Converts a database-formatted datetime string (YYYY-MM-DD HH:MM)
 * into a user interface-friendly format (DD/MM/YYYY HH:MM).
 *
 * @param dateValue - The dateTime string from the database (e.g., "2025-07-25 18:04")
 * @returns A formatted date string for display (e.g., "25/07/2025 18:04"), or an empty string if input is invalid
 */
export function convertDBDateTimeToUI(dateValue: string): string {
  if (isBlank(dateValue)) return '';

  const [datePart, timePart] = dateValue.split(' ');
  const formattedDate = formatDateAsDDMMYYYY(parseDateFromYYYYMMDD(datePart));
  return timePart ? `${formattedDate} ${timePart}` : formattedDate;
}

/**
 * Converts a database-formatted dateTimeWithSeconds string (YYYY-MM-DD HH:MM:SS)
 * into a user interface-friendly format (DD/MM/YYYY HH:MM:SS).
 *
 * @param dateValue - The dateTime string from the database (e.g., "2025-07-25 18:04:03")
 * @returns A formatted date string for display (e.g., "25/07/2025 18:04:03"), or an empty string if input is invalid
 */
export function convertDBDateTimeWithSecondsToUI(dateValue: string): string {
  if (isBlank(dateValue)) return '';

  const [datePart, timePart] = dateValue.split(' ');
  const formattedDate = formatDateAsDDMMYYYY(parseDateFromYYYYMMDD(datePart));
  return timePart ? `${formattedDate} ${timePart}` : formattedDate;
}

export function parseDateFromDDMMYYYY(value: string): NgbDateStruct {
  const date = value.split(Constants.DATE_DELIMITER);
  return {
    day: parseInt(date[0], 10),
    month: parseInt(date[1], 10),
    year: parseInt(date[2], 10)
  };
}

export function formatDateAsDDMMYYYY(date: NgbDateStruct): string {
  return `${date.day}`.padStart(2, '0') + Constants.DATE_DELIMITER + `${date.month}`.padStart(2, '0') + Constants.DATE_DELIMITER + `${date.year}`;
}

export function dateNYearsAgo(n: number): NgbDateStruct {
  const today = new Date();
  return { year: today.getFullYear() - n, month: today.getMonth() + 1, day: today.getDate() };
}

export function dateNDaysAfter(n: number): NgbDateStruct {
  const today = new Date();
  today.setDate(today.getDate() + n);
  return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
}

export function formatDateAsYYYYMMDD(date: NgbDateStruct): string {
  if(date == null || String(date).length == 0) return "";
  return `${date.year}` + Constants.DATE_DELIMITER_HYPHEN + `${date.month}`.padStart(2, '0') + Constants.DATE_DELIMITER_HYPHEN + `${date.day}`.padStart(2, '0');
}

export function getToday(): NgbDateStruct {
  let today = new Date();
  return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() }
}

export function getYear1900(): NgbDateStruct {
  let today = new Date();
  return { year: 1900, month: 1, day: 1 }
}

export function getYear2100(): NgbDateStruct {
  let today = new Date();
  return { year: 2100, month: 12, day: 31 }
}

export function getDateOfDifferentTimezoneByOffset(offset: number): Date {
  // create Date object for current location
  let d = new Date();
 
  // convert to msec, add local time zone offset & get UTC time in msec
  let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
 
  // create new Date object for different timezone using supplied offset
  let nd = new Date(utc + (3600000*offset));
  nd.setHours(0);
  nd.setMinutes(0);
  nd.setSeconds(0);

  return nd;
}

export function parseDateFromYYYYMMDD(value: any): NgbDateStruct {
  const date = value.split(Constants.DATE_DELIMITER_HYPHEN);
  return {
    day: parseInt(date[2], 10),
    month: parseInt(date[1], 10),
    year: parseInt(date[0], 10)
  };
}

export function parseDateObjFromYYYYMMDD(value: string): Date {
  if(value) 
    return new Date(value + " 00:00:00")
  return new Date();
}

export function getTodayDate(): Date {
  return getDateOfDifferentTimezoneByOffset(5.5);
}

export function getCurrentDateInYYYYMMDDFormat(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}${Constants.DATE_DELIMITER_HYPHEN}${month}${Constants.DATE_DELIMITER_HYPHEN}${day}`;
  // Output format: YYYY-MM-DD
}

export function getCurrentDateTimeInYYYYMMDDHHMMFormat(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');

  return (
    `${year}${Constants.DATE_DELIMITER_HYPHEN}${month}${Constants.DATE_DELIMITER_HYPHEN}${day} ` +
    `${hours}${Constants.TIME_DELIMITER_COLON}${minutes}`
  );
  // Output format: YYYY-MM-DD HH:MM
}

export function getCurrentDateTimeInYYYYMMDDHHMMSSFormat(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const seconds = String(today.getSeconds()).padStart(2, '0');

  return (
    `${year}${Constants.DATE_DELIMITER_HYPHEN}${month}${Constants.DATE_DELIMITER_HYPHEN}${day} ` +
    `${hours}${Constants.TIME_DELIMITER_COLON}${minutes}${Constants.TIME_DELIMITER_COLON}${seconds}`
  );
  // Output format: YYYY-MM-DD HH:MM:SS
}

export function getCurrentTimeInHHMMFormat(): string {
  const today = new Date();

  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');

  return `${hours}${Constants.TIME_DELIMITER_COLON}${minutes}${Constants.TIME_DELIMITER_COLON}`;
  // Output format: HH:MM
}

export function getCurrentTimeInHHMMSSFormat(): string {
  const today = new Date();

  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const seconds = String(today.getSeconds()).padStart(2, '0');

  return `${hours}${Constants.TIME_DELIMITER_COLON}${minutes}${Constants.TIME_DELIMITER_COLON}${seconds}`;
  // Output format: HH:MM:SS
}
