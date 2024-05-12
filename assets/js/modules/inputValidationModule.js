/**
 * Shows or hides the validation error message for a given input field.
 * @param {string} inputId - The ID of the input field.
 * @param {boolean} isValid - Whether the input value is valid or not.
 */
function toggleInputValidationError(inputId, isValid = false) {
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
 *
 * @param {string} inputId - The ID of the input field to be validated.
 * @param {Function} validationFunction - The function to be used for validating the input value.
 *
 * @returns {void} This function does not return a value.
 *
 * @description
 * This function attaches an event listener to the 'input' event of the specified input field.
 * When the input value changes, the provided validationFunction is called with the new input value.
 *
 */
function handleInputValidation(inputId, validationFunction) {
    $(`#${inputId}-input #${inputId}`).on('input', (event) => {
        const value = event.target.value;
        const isValid = (value && validationFunction(value));
        toggleInputValidationError(inputId, isValid);
    });
}

export {handleInputValidation, toggleInputValidationError};