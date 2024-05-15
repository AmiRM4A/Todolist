/**
 * Gets the current date in the format MM/DD/YYYY.
 *
 * @function
 * @name getCurrentDate
 *
 * @returns {string} - The current date.
 */
export function getCurrentDate() {
    const d = new Date();
    return `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
}

/**
 * Retrieves the current date and time in the format "YYYY-MM-DD HH:mm:ss".
 *
 * @function
 * @name getCurrentDateTime
 *
 * @returns {string} The current date and time as a string.
 */
export function getCurrentDateTime() {
    const d = new Date();
    const year = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;

    return `${year} ${time}`;
}


/**
 * Retrieves form inputs and their values as an object.
 *
 * @function
 * @name getFormInputs
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
 * @function
 * @name tooltip
 *
 * @param {string} selector - The CSS selector identifying the target element.
 * @param {string | Element} content - The content of the tooltip.
 * @param {boolean} [arrow=true] - Determines whether the tooltip arrow is displayed.
 * @param {string} [animation='scale'] - The animation effect for the tooltip.
 *   Possible values: 'scale', 'shift-toward', 'fade', etc.
 * @returns {void} This function does not return a value.
 */
export function tooltip(selector, content, arrow = true, animation = 'scale') {
    tippy(selector, {
        content: content,
        arrow: arrow,
        animation: animation
    });
}

/**
 * Makes an API request.
 *
 * @function
 * @name makeApiRequest
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
 *
 * @function
 * @name regexMatch
 *
 * @param {string} str The string to check.
 * @param {RegExp} regex The regular expression to match against.
 * @returns {boolean} True if the string matches the regular expression, otherwise false.
 *
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
 *
 * @function
 * @name sanitizeInput
 *
 * @param {string} str The string to sanitize.
 * @returns {string} The sanitized string.
 *
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
 *
 * @function
 * @name getCleanedInput
 *
 * @param {string} formId The ID of the form element containing the input field.
 * @param {string} inputId The ID of the input field to retrieve.
 * @returns {string} The sanitized value of the input field.
 *
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
 *
 * @function
 * @name redirectTo
 *
 * @param {string} url The URL to which the page will be redirected.
 * @returns {void} This function does not return a value.
 */
export function redirectTo(url) {
    window.location.href = url;
}

/**
 * Returns the current page's URL, including the protocol, domain name, and domain extension.
 *
 * @function
 * @name getCurrentPageUrl
 *
 * @returns {string} The current page's URL.
 */
export function getCurrentPageUrl() {
    const domainParts = window.location.hostname.split('.');
    const domain = domainParts.slice(-2).join('.');
    return `${window.location.protocol}//${domain}`;
}

/**
 * Changes the favicon of the website.
 *
 * @function
 * @name changeFavIcon
 *
 * @param {string} newIconPath - The path to the new favicon.
 * @returns {void} This function does not return a value.
 */
function changeFavIcon(newIconPath) {
    $('#favIcon').attr('href', newIconPath);
}

/**
 * Changes the website's logo.
 *
 * @function
 * @name changeLogo
 *
 * @param {string} newLogoPath - The path to the new logo image.
 * @returns {void} This function does not return a value.
 */
function changeLogo(newLogoPath) {
    $('#logo').attr('src', newLogoPath);
}

/**
 * Select a color theme and update the website's appearance.
 *
 * @function
 * @name selectThemeColor
 *
 * @param {string} color - The primary color code of the selected theme.
 *
 * @description Selects a color theme and updates the website's appearance, including favicon, logo, and theme color.
 */
export function selectThemeColor(color) {
    const themeColors = {
        'rgb(187, 134, 252)': 'pink',
        'rgb(0, 191, 165)': 'teal',
        'rgb(61, 90, 254)': 'indigo',
        'rgb(255, 82, 82)': 'red',
        'rgb(100, 221, 23)': 'green'
    };

    const colorName = themeColors[color];
    changeFavIcon(`'assets/images/icon/'fav-${colorName}.png`);
    changeLogo(`assets/images/logo/logo-${colorName}.png`);
    $('html').css('--theme-color', color);
}

