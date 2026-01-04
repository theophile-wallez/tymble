/**
 * Calculates the Levenshtein score between two strings.
 *
 * The score is calculated as the inverse of the Levenshtein distance.
 * The higher the score, the more similar the two strings are.
 * The score is between 0 and 1.
 * The score is 1 if the two strings are identical.
 * The score is 0 if the two strings are completely different.
 *
 * @param query - The query string.
 * @param value - The value string.
 * @returns The Levenshtein score between the two strings.
 */

export const levenshteinDistance = (query: string, value: string) => {
  const matrix = Array.from({ length: query.length + 1 }, () =>
    Array.from({ length: value.length + 1 }, () => 0)
  );
  return matrix[query.length][value.length];
};
