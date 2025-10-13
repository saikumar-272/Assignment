export function convertToKebabCase(value: string) {
  return value.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index)
  {
      return index == 0 ? word.toLowerCase() : '-' + word.toLowerCase();
  }).replace(/\s+/g, '');
}

export function convertCamelCaseToSentence(value: string) {
  return value.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index)
  {
      return index == 0 ? word : ' ' + word;
  }).replace(/\s+/g, ' '); //replace multiple whitespaces with single space
}

export function convertToUpperCase(value: string) {
  if(value == null)
  {
    value = "";
  }
  return value.toUpperCase();
}

export function isBlank(value: any) {
  if(value == null || value === undefined || value === "undefined" || value.length == 0)
  {
    return true;
  }
  return false;
}

export function isNotBlank(value: any) {
  return !isBlank(value);
}

export function compareStringsIgnoreCase(str1: String, str2: String): boolean {
  if(str1 == null || str1 === undefined || str1 === "undefined")
  {
    return false;
  }
  if(str2 == null || str2 === undefined || str2 === "undefined")
  {
    return false;
  }
  return str1.toLowerCase() === str2.toLowerCase();
}
export function removeUUIDSuffix(text: string): string {
  // Check if 'UUID' is the last part of the string
  if (!isBlank(text) && text.endsWith("UUID")) {
    // Remove 'UUID' only if it is at the end
    text = text.slice(0, -4);// it slices off the last 4 characters
  }
  return text;
}

export function getNumberWithCommaSeparated(amountInput: string | number): string {
  if (amountInput == null || amountInput === '') return '';
  const amountStr = amountInput.toString().trim();
  // Check if the input is a valid number
  if (!/^\d+(\.\d+)?$/.test(amountStr)) {
    console.warn('Invalid amount format:', amountStr);
    return amountStr;
  }
  const [integerPartRaw, decimalPartRaw] = amountStr.split('.');
  const integerPart = integerPartRaw;
  // Handle decimal logic: truncate or pad
  let decimalPart = '';
  if (decimalPartRaw !== undefined) {
    decimalPart = decimalPartRaw.substring(0, 2).padEnd(2, '0');
  } else {
    decimalPart = '00';
  }
  const formattedInteger = getIndianCurrencyFormat(integerPart);
  return `${formattedInteger}.${decimalPart}`;
}

export function getIndianCurrencyFormat(amount: string): string {
  if (!amount) return '';
  const len = amount.length;
  if (len <= 3) return amount;
  const lastThree = amount.slice(-3);
  const rest = amount.slice(0, -3);
  const formattedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return formattedRest + ',' + lastThree;
}


export function equalsIgnoreCase(str1: string | null | undefined, str2: string | null | undefined): boolean {
  if (!str1 || !str2) return false;  // handles null, undefined, and empty string
  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
}
