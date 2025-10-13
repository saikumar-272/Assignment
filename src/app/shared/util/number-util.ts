import {Constants} from "./constants";

export function roundAmount(value: number): number {
  return Number(Math.round(Number(value + `e${Constants.MAX_DECIMAL_PLACES_AMOUNT}`)) + `e-${Constants.MAX_DECIMAL_PLACES_AMOUNT}`);
}

export function roundQuantity(value: number): number {
  return Number(Math.round(Number(value + `e${Constants.MAX_DECIMAL_PLACES_QUANTITY}`)) + `e-${Constants.MAX_DECIMAL_PLACES_QUANTITY}`);
}
