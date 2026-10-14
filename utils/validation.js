/**
 * Validates an email address using a standard regex.
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number for exactly 10 digits.
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  // Remove any non-digit characters (though we might handle formatting elsewhere)
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10;
};
