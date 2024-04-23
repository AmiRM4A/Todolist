/**
 * Validates an email address using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
function validateEmail(email) {
    const re = /^[\w.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
}

/**
 * Validates a name using a regular expression.
 * The name must consist of alphabetic characters and spaces, with a minimum length of 3 characters.
 * @param {string} name - The name to validate.
 * @returns {boolean} - Returns true if the name is valid, otherwise false.
 */
function validateName(name) {
    const re = /^[a-zA-Z\s]{3,}$/;
    return re.test(name);
}

/**
 * Validates a password using a regular expression.
 * The password must meet the following criteria:
 * At least 8 characters long
 * Contains at least one digit
 * Contains at least one lowercase letter
 * Contains at least one uppercase letter
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns true if the password is valid, otherwise false.
 */
function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return re.test(password);
}

/**
 * Validates a username using a regular expression.
 * The username must consist of alphanumeric characters and underscores, with a minimum length of 3 characters.
 * @param {string} username - The username to validate.
 * @returns {boolean} - Returns true if the username is valid, otherwise false.
 */
function validateUsername(username) {
    const re = /^[a-zA-Z0-9_]{3,}$/;
    return re.test(username);
}

export {validateEmail, validateName, validatePassword, validateUsername}