/**
 * Shows or hides the validation error message for a given input field.
 * @param {string} inputId - The ID of the input field.
 * @param {boolean} isValid - Whether the input value is valid or not.
 * @returns {void} This function does not return a value.
 */
export function toggleInputValidationError(inputId, isValid = false) {
    const inputField = $(`#${inputId}-input #${inputId}`);
    const errorMessage = $(`#${inputId}-input .form-group__message`);

    if (isValid) {
        inputField.removeClass('is-invalid-input');
        errorMessage.removeClass('show-invalid-input-message');
    } else {
        inputField.addClass('is-invalid-input');
        errorMessage.addClass('show-invalid-input-message');
    }
}

/**
 * Handles input validation for a given input field.
 * @param {string} inputId - The ID of the input field to be validated.
 * @param {Function} validationFunction - The function to be used for validating the input value.
 * @param {RegExp} [regexPattern] - Optional regular expression pattern for additional validation.
 * @returns {void} This function does not return a value.
 */
export function handleInputValidation(inputId, validationFunction, regexPattern) {
    $(`#${inputId}-input #${inputId}`).on('input', (event) => {
        const value = event.target.value;
        let isValid;
        if (regexPattern) {
            isValid = value && validationFunction(value) && regexPattern.test(value);
        } else {
            isValid = value && validationFunction(value);
        }
        toggleInputValidationError(inputId, isValid);
    });
}