/**
 * Map a value from one range to another
 * @param fromMin The minimum value of the input range
 * @param fromMax The maximum value of the input range
 * @param toMin The minimum value of the output range
 * @param toMax The maximum value of the output range
 * @returns A function that takes a value in the input range and returns the mapped value in the output range
 * E.g. Map a value of 0 - 10 to 0.5 - 2
 */
export function map(fromMin: number, fromMax: number, toMin: number, toMax: number) {
  return (value: number) => {
    return ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin
  }
}
