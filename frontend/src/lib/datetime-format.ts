/**
 * Formats a given date and time string to a local date string in ISO format.
 *
 * @param {string | null} dateTimeString - The date and time string to be formatted.
 * @returns {string} - The formatted date string in ISO format or the original string if parsing fails. e.g 2024-01-01T00:00:00.000Z
 */
export const formatLocalDateTime = (dateTimeString: string | null) => {
  if (!dateTimeString) return "";
  try {
    const date = new Date(dateTimeString);
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error parsing date:", error);
    return dateTimeString; // Return the original string if parsing fails
  }
};

/**
 * Formats a given date to a time string in the format "HH:MM".
 *
 * @param {number} date - The date to be formatted.
 * @returns {string} - The formatted time string. e.g 00:00
 */
export const formatTimeForInput = (date: number) => {
  const d = new Date(date);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Formats a given date to a date string in the format "YYYY-MM-DD".
 *
 * @param {number} date - The date to be formatted.
 * @returns {string} - The formatted date string. e.g 2024-01-01
 */
export const formatDateForInput = (date: number) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};
