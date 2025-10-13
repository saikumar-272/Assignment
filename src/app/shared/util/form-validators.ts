import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Constants} from './constants';

export class CustomFormValidators {
  static passwordMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password1 = control.get(controlName)?.value;
      const password2 = control.get(matchingControlName)?.value;
      if (password1 == password2) {
        return null;
      }
      const errors = { passwordMismatch: true };
      control.get(matchingControlName)?.setErrors(errors);
      return errors;
    };
  }

  static required(): ValidatorFn { 
    return (control: AbstractControl): ValidationErrors | null => {
      const requiredValidation = Validators.required(control);
      // use standard validators where possible
      if (requiredValidation?.required) {
        return {errorMessage: 'is required'};
      }
      return null;
    };
  }

  static notBlank(): ValidatorFn { 
    return (control: AbstractControl): ValidationErrors | null => {
      const requiredValidation = Validators.required(control);
      // use standard validators where possible
      if (requiredValidation?.required) {
        return {errorMessage: 'is required'};
      }
      if (control.value.trim().length === 0) {
        return {errorMessage: 'cannot be blank'};
      }
      return null;
    };
  }

  static minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const minLengthValidation = Validators.minLength(minLength)(control);
      // ignore required/blank validation
      if (minLengthValidation?.minlength) {
        return {errorMessage: `should have ${minLength} characters minimum`};
      }
      return null;
    };
  }

  static maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const maxLengthValidation = Validators.maxLength(maxLength)(control);
      // ignore required/blank validation
      if (maxLengthValidation?.maxlength) {
        return {errorMessage: `cannot exceed ${maxLength} characters`};
      }
      return null;
    };
  }

  static min(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const minValidation = Validators.min(min)(control);
      // ignore required/blank validation
      if (minValidation?.min) {
        return {errorMessage: `value should be greater than or equal to ${min}`};
      }
      return null;
    };
  }

  static max(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const maxValidation = Validators.max(max)(control);
      // ignore required/blank validation
      if (maxValidation?.max) {
        return {errorMessage: `value should be less than or equal to ${max}`};
      }
      return null;
    };
  }

  static amount(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const patternValidation = Validators.pattern(Constants.REGEX_DECIMAL_AMOUNT)(control);
      // ignore required/blank validation
      if (patternValidation?.pattern) {
        return {errorMessage: `is invalid, enter a valid number with optional ${Constants.MAX_DECIMAL_PLACES_AMOUNT} decimals`};
      }
      return null;
    };
  }

  static quantity(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const patternValidation = Validators.pattern(Constants.REGEX_DECIMAL_QUANTITY)(control);
      // ignore required/blank validation
      if (patternValidation?.pattern) {
        return {errorMessage: `is invalid, enter a valid number with upto ${Constants.MAX_DECIMAL_PLACES_QUANTITY} decimals`};
      }
      return null;
    };
  }

  static decimal(fractionValue : number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const patternValidation = Validators.pattern(`^((([1-9]{1}\\d{0,8})(\\.\\d{1,${fractionValue}})?)|(0\\.\\d{1,${fractionValue}}))$`)(control);
      // ignore required/blank validation
      if (patternValidation?.pattern) {
        return {errorMessage: `is invalid, enter a valid number with upto ${fractionValue} decimals`};
      }
      return null;
    };
  }
  
  static pattern(pattern: string | RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const patternValidation = Validators.pattern(pattern)(control);
      // use standard validators where possible
      // ignore required/blank validation
      if (patternValidation?.pattern) {
        return {errorMessage: 'is invalid'};
      }
      return null;
    };
  }

  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailValidation = Validators.email(control);
      // use standard validators where possible
      // ignore required/blank validation
      if (emailValidation?.email) {
        return {errorMessage: 'is invalid'};
      }
      return null;
    };
  }
}

export function validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      validateAllFormFields(control);
    }
  });
}

export function validateIEntityAttachmentDto(value: any) {
  // check if value represents IEntityAttachmentDto instance populated from backend and return null
  if ( value?.length > 0 && value[0] && value[0].fileName && value[0].id ) {
    return null;
  } 
  // return the selected File instance
  return value; 
}

export function validateAttachmentSize(fieldName: string, attachment: any, allowedSizeMB: number): string {
  let errorMessage :string  = "";
  let totalAttachmentSizeInBytes = 0;
  if (attachment instanceof File) {
    totalAttachmentSizeInBytes = attachment.size;
    // Convert bytes to megabytes
    const totalAttachmentSizeInMB = totalAttachmentSizeInBytes / (1024 * 1024);
    // Validate against the allowed size
    if (totalAttachmentSizeInMB > allowedSizeMB) {
      errorMessage = " => " + fieldName  + " : Uploaded size(" + totalAttachmentSizeInMB.toFixed(2) + " MB) exceeds the allowed size("
          + allowedSizeMB + " MB).";
    }
  }
  return errorMessage;
}
