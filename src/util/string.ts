/**
 * Capitalizes the first letter of each word in a string.
 * @param str The input string to be capitalized.
 * @returns A new string with the first letter of each word capitalized.
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
* Truncates a string to a specified length and adds an ellipsis if truncated.
* @param str The input string to be truncated.
* @param maxLength The maximum length of the truncated string (including ellipsis).
* @returns A truncated string with ellipsis if necessary.
*/
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
      return str;
  }
  return str.slice(0, maxLength - 3) + '...';
}

/**
* Removes all whitespace from a string.
* @param str The input string to remove whitespace from.
* @returns A new string with all whitespace removed.
*/
export function removeWhitespace(str: string): string {
  return str.replace(/\s/g, '');
}

/**
 * Sorts strings alphanumerically, handling numbers within strings correctly.
 * For example: ["Unit 1", "Unit 10", "Unit 2"] will be sorted as ["Unit 1", "Unit 2", "Unit 10"]
 * 
 * @param a First string to compare
 * @param b Second string to compare
 * @returns Negative number if a should come before b, positive if b should come before a, 0 if equal
 */
export function alphanumericSort(a: string, b: string): number {
  // Split strings into chunks of text and numbers
  const chunksA = a.split(/(\d+)/).filter(Boolean);
  const chunksB = b.split(/(\d+)/).filter(Boolean);
  
  // Compare each chunk
  const minLength = Math.min(chunksA.length, chunksB.length);
  
  for (let i = 0; i < minLength; i++) {
    // If both chunks are numeric, compare as numbers
    const numA = parseInt(chunksA[i]);
    const numB = parseInt(chunksB[i]);
    
    if (!isNaN(numA) && !isNaN(numB)) {
      if (numA !== numB) {
        return numA - numB;
      }
    } else {
      // Otherwise compare as strings
      const comparison = chunksA[i].localeCompare(chunksB[i]);
      if (comparison !== 0) {
        return comparison;
      }
    }
  }
  
  // If all chunks so far are equal, the shorter string comes first
  return chunksA.length - chunksB.length;
}