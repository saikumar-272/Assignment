import {HttpParams} from "@angular/common/http";

export function toFormData<T extends Record<string, any>>(data: T): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && 'id' in value) {
      formData.append(`${key}.id`, String(value.id));
    } else {
      formData.append(key, value ?? "");
    }
  }
  return formData;
}

export function toHttpParams<T extends Record<string, any>>(data: T): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(data)) {
    params = params.append(key,  String(value));
  }
  return params;
}

export function trimTrailingSlash(str: string): string {
  if (str.charAt(str.length - 1) == '/') {
    return str.slice(0, -1);
  }
  else {
    return str;
  }
}
