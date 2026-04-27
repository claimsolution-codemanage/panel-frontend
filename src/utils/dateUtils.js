// utils/dateUtils.js

/**
 * Convert UTC date string to local datetime-local input value
 * @param {string} utcDateString - UTC date string from API
 * @returns {string} - Formatted date for datetime-local input (YYYY-MM-DDThh:mm)
 */
export const utcToLocalDateTime = (utcDateString) => {
    if (!utcDateString) return '';

    const date = new Date(utcDateString);
    if (isNaN(date.getTime())) return '';

    // Get local datetime components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Convert local datetime to UTC ISO string for API
 * @param {string} localDateTime - Local datetime string from datetime-local input
 * @returns {string} - UTC ISO string
 */
export const localToUTC = (localDateTime) => {
    if (!localDateTime) return new Date().toISOString();

    // Parse local datetime string
    const [datePart, timePart] = localDateTime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');

    // Create date in local timezone
    const localDate = new Date(year, month - 1, day, hours, minutes);

    // Return UTC ISO string
    return localDate.toISOString();
};

/**
 * Format UTC date to local display string
 * @param {string} utcDateString - UTC date string
 * @param {string} format - 'datetime' | 'date' | 'time'
 * @returns {string} - Formatted local date string
 */
export const formatLocalDateTime = (utcDateString, format = 'datetime') => {
    if (!utcDateString) return 'N/A';

    const date = new Date(utcDateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const options = {
        datetime: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        },
        date: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
        time: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        },
        timezone: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata',
            timeZoneName: 'short'
        }
    };

    return date.toLocaleString(undefined, options[format]);
};

/**
 * Format UTC date to local date string for date input (YYYY-MM-DD)
 * @param {string} utcDateString - UTC date string
 * @returns {string} - Date in YYYY-MM-DD format
 */
export const utcToLocalDate = (utcDateString) => {
    if (!utcDateString) return '';

    const date = new Date(utcDateString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * Get current local datetime for datetime-local input default value
 * @returns {string} - Current local datetime in YYYY-MM-DDThh:mm format
 */
export const getCurrentLocalDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Check if a date is overdue (for next follow-up date)
 * @param {string} utcDateString - UTC date string to check
 * @returns {boolean} - True if date is in the past
 */
export const isDateOverdue = (utcDateString) => {
    if (!utcDateString) return false;

    const dateToCheck = new Date(utcDateString);
    const today = new Date();

    // Reset time part for date comparison
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);

    return dateToCheck < today;
};

/**
 * Compare two UTC dates (for sorting)
 * @param {string} dateA - First UTC date string
 * @param {string} dateB - Second UTC date string
 * @param {string} order - 'asc' or 'desc'
 * @returns {number} - Comparison result
 */
export const compareUTCDates = (dateA, dateB, order = 'desc') => {
    const timeA = new Date(dateA).getTime();
    const timeB = new Date(dateB).getTime();

    if (order === 'desc') {
        return timeB - timeA;
    }
    return timeA - timeB;
};