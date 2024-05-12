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
function getCurrentDate() {
    const d = new Date();
    return `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
}

/**
 * Resets the input field.
 *
 * @function
 * @name resetInput
 *
 * @param {HTMLElement} taskInput - The input field element to reset.
 *
 * @description Clears the value of the input field.
 */
function resetInput(taskInput) {
    $(taskInput).val('');
}

/**
 * Change the website's favicon to match a selected color theme.
 *
 * @function
 * @name changeFavIcon
 *
 * @param {string} newIconPath - The path to the new favicon.
 *
 * @description Updates the website's favicon to match a selected color theme.
 */
function changeFavIcon(newIconPath) {
    $('#favIcon').attr('href', newIconPath);
}

/**
 * Change the website's logo to match a selected color theme.
 *
 * @function
 * @name changeLogo
 *
 * @param {string} newLogoPath - The path to the new logo image.
 *
 * @description Updates the website's logo to match a selected color theme.
 */
function changeLogo(newLogoPath) {
    $('#logo').attr('src', newLogoPath);
}

/**
 * Finds and returns the closest parent element with a specific class name.
 *
 * @param {Element} element - The starting HTML element to begin the search from.
 * @param {string} parentElementClassName - The class name to search for in parent elements.
 * @returns {Element} - The closest parent element with the specified class name, or null if not found.
 * @description
 * This function searches for the closest parent element with a specific class name.
 */
function getParentElementByClassName(element, parentElementClassName) {
    return $(element).closest(`.${parentElementClassName}`);
}

/**
 * Toggles class names on elements to switch between two states.
 *
 * @param {string} to - The target state ('completed' or 'incomplete').
 * @param {Element} taskElem - The task element to manipulate.
 * @returns {void}
 * @description
 * This function toggles class names on elements to switch between two states, typically for task completion.
 */
function swapTaskIconsTo(to = 'completed', taskElem) {
    const spanIconElem = $(taskElem).find('.done-span');
    const btnIconElem = $(taskElem).find('.done-btn');

    if (to === 'completed') {
        spanIconElem.addClass('fa-undo');
        btnIconElem.addClass('fa-undo');
        spanIconElem.removeClass('fa-check');
        btnIconElem.removeClass('fa-check');
    } else {
        spanIconElem.addClass('fa-check');
        btnIconElem.addClass('fa-check');
        spanIconElem.removeClass('fa-undo');
        btnIconElem.removeClass('fa-undo');
    }
}

/**
 * Retrieves form inputs and their values as an object.
 *
 * @param {string} selector - The CSS selector identifying the form element.
 * @returns {Object} - An object containing input names as keys and their corresponding values.
 */
function getFormInputs(selector) {
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
 * @returns {void}
 */
function tooltip(selector, content, arrow = true, animation = 'scale') {
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
function makeApiRequest(method, url, data = null, headers = {}) {
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


export {
    getCurrentDate,
    resetInput,
    changeLogo,
    changeFavIcon,
    getParentElementByClassName,
    swapTaskIconsTo,
    getFormInputs,
    tooltip,
    makeApiRequest
};