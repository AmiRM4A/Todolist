/**
 * Sets data to session storage.
 * @param {string} key The key under which to store the data.
 * @param {any} value The value to store.
 * @throws {Error} If the key is not a string.
 * @returns {void} This function does not return a value.
 */
export function setSessionStorage(key, value) {
    if (typeof key !== 'string') {
        throw new Error('Key must be a string');
    }

    sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * Gets data from session storage.
 * @param {string} key - The key of the data to retrieve.
 * @param {boolean} [json_parse=true] - Whether to parse the retrieved data as JSON.
 * @returns {any} The retrieved data. If json_parse is true (default), the parsed JSON data is returned; otherwise, the raw string data is returned.
 * @throws {Error} If the key is not a string or if the retrieved data is not valid JSON when json_parse is true.
 */
export function getSessionStorage(key, json_parse = true) {
    if (typeof key !== 'string') {
        throw new Error('Key must be a string');
    }

    const data = sessionStorage.getItem(key);
    if (!data) return null;

    try {
        return json_parse ? JSON.parse(data) : data;
    } catch (error) {
        throw new Error('Invalid JSON data in session storage');
    }
}

/**
 * Removes data from session storage.
 * @param {string} key The key of the data to remove.
 * @throws {Error} If the key is not a string.
 * @returns {void} This function does not return a value.
 */
export function removeSessionStorage(key) {
    if (typeof key !== 'string') {
        throw new Error('Key must be a string');
    }

    sessionStorage.removeItem(key);
}