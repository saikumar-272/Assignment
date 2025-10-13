import { Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class TimeZoneService {
  constructor(private datePipe: DatePipe) {}

  getTimeZoneTime(utcDateTime: string): string {
    if (utcDateTime == null) return "";
    let trimmedUtcDateTime: string = utcDateTime.trim().replace(/\s+/g, "T");
    let utcDateTimeDateObj: Date = new Date(trimmedUtcDateTime);
    // Get the time zone offset in minutes.
    const timeZoneOffset = utcDateTimeDateObj.getTimezoneOffset();

    // Create a new Date object from the local time in milliseconds.
    const localDateTime = new Date(
      utcDateTimeDateObj.getTime() - timeZoneOffset * 60 * 1000
    );
    let convertedDateTime = this.datePipe.transform(
      localDateTime,
      "yyyy-MM-dd HH:mm:ss"
    );
    if (convertedDateTime != null) {
      return convertedDateTime;
    } else {
      return "";
    }
  }
}
