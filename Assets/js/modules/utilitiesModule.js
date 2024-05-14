/**
 * Gets the current date in the format MM/DD/YYYY.
 *
 * @function
 * @name getCurrentDate
 *
 * @returns {string} - The current date.
 *
 * @description Retrieves the current date in the MM/DD/YYYY format.
 */
export function getCurrentDate() {
    const d = new Date();
    return `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
}

export function getCurrentDateTime() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Retrieves form inputs and their values as an object.
 *
 * @param {string} selector - The CSS selector identifying the form element.
 * @returns {Object} - An object containing input names as keys and their corresponding values.
 */
export function getFormInputs(selector) {
    if (typeof selector !== 'string') {
        return {};
    }

    // Retrieve form inputs and values using jQuery serializeArray()
    return $(selector).serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
}

/**
 * Initializes a tooltip on the specified element using Tippy.js.
 *
 * @param {string} selector - The CSS selector identifying the target element.
 * @param {string | Element} content - The content of the tooltip.
 * @param {boolean} [arrow=true] - Determines whether the tooltip arrow is displayed.
 * @param {string} [animation='scale'] - The animation effect for the tooltip.
 *   Possible values: 'scale', 'shift-toward', 'fade', etc.
 * @returns {void} This function does not return a value.
 */
export function tooltip(selector, content, arrow= true, animation = 'scale') {
    tippy(selector, {
        content: content,
        arrow: arrow,
        animation: animation
    });
}

/**
 * Makes an API request.
 *
 * @param {string} method - The HTTP method for the request (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} [data] - The data to be sent with the request (for 'POST' or 'PUT' methods).
 * @param {Object} [headers] - Additional headers to include in the request.
 * @returns {Promise} - A Promise that resolves to the response data or rejects with an error.
 */
export function makeApiRequest(method, url, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: method,
            url: url,
            data: data,
            headers: headers,
            success: (response) => {
                resolve(response);
            },
            error: (xhr) => {
                reject(xhr);
            }
        });
    });
}

/**
 * Checks if a string matches a specified regular expression.
 * @param {string} str The string to check.
 * @param {RegExp} regex The regular expression to match against.
 * @returns {boolean} True if the string matches the regular expression, otherwise false.
 * @throws {Error} If the second parameter is not a regular expression object.
 */
export function regexMatch(str, regex) {
    if (regex instanceof RegExp) {
        return regex.test(str);
    }

    throw new Error('The second parameter must be a regular expression object.');
}

/**
 * Sanitizes a string by replacing HTML entities and removing HTML tags and scripts.
 * @param {string} str The string to sanitize.
 * @returns {string} The sanitized string.
 * @throws {Error} If the input is not a string.
 */
export function sanitizeInput(str) {
    if (typeof str !== 'string') {
        throw new Error('The (str) parameter must be a string');
    }

    // Replace HTML entities with their corresponding characters
    const cleanedInput = str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    // Remove any remaining HTML tags and scripts
    return cleanedInput.replace(/(<([^>]+)>)/gi, '');
}

/**
 * Retrieves and sanitizes the value of an input field within a specified form.
 * @param {string} formId The ID of the form element containing the input field.
 * @param {string} inputId The ID of the input field to retrieve.
 * @returns {string} The sanitized value of the input field.
 * @throws {Error} If the form or input field is not found.
 */
export function getCleanedInput(formId, inputId) {
    // Find the form element
    const form = $(`#${formId}`);
    if (!form.length) {
        throw new Error(`Form with ID "${formId}" not found.`);
    }

    // Find the input element within the form
    const input = form.find(`#${inputId}`);
    if (!input.length) {
        throw new Error(`Input with ID "${inputId}" not found in form "${formId}".`);
    }

    // Get the input value and sanitize it
    return sanitizeInput(input.val());
}

/**
 * Redirects the current web page to the specified URL.
 * @param {string} url The URL to which the page will be redirected.
 * @returns {void} This function does not return a value.
 */
export function redirectTo(url) {
    window.location.href = url;
}

/**
 * Returns the current page's URL, including the protocol, domain name, and domain extension.
 * @returns {string} The current page's URL.
 */
export function getCurrentPageUrl() {
    const domainParts = window.location.hostname.split('.');
    const domain = domainParts.slice(-2).join('.');
    return `${window.location.protocol}//${domain}`;
}