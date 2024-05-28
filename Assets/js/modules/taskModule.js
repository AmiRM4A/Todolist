import {getUserToken, makeApiRequest} from './utilitiesModule.js';
import config from '../../../config.js';
import {getSessionStorage} from './sessionStorageModule.js';

const apiUrl = config.apiUrl;

// --- Task List Manipulation Functions ---
/**
 * Creates the HTML for a task element.
 *
 * @function
 * @name createTaskElem
 *
 * @param {number} taskId - The ID of the task.
 * @param {string} taskTitle - The name of the task.
 * @param {string} taskDesc - The description of the task.
 * @param {string} taskCreationDate - The date when the task was created.
 * @returns {string} - The HTML for the task element.
 *
 * @description Creates the HTML markup for a task element based on provided data.
 */
function createTaskElem(taskId, taskTitle, taskDesc, taskCreationDate) {
    return `
        <div class="task animate__bounceIn" data-task-id=${taskId} data-task-creation-date="${taskCreationDate}">
          <div>
            <div class="task-actions">
              <span class="fas fa-edit"></span>
              <span class="fa fa-check done-span"></span>
              <span class="fas fa-times"></span>
            </div>
            <div class="task-detail">
              <div class="task-title">${taskTitle}</div>
			  <br>
              <div class="task-desc">${taskDesc}</div>
            </div>
			<div class="task-info">
			    <i class="fas fa-info-circle"></i> Created: <span class="task-status" style="color: var(--theme-color);"> ${taskCreationDate} </span>
			</div>
          </div>
          <button class="fa fa-check done-btn" aria-hidden="true"></button>
        </div>
	`;
}

/**
 * Adds a new task to the list of tasks.
 *
 * @function
 * @name addTaskToList
 *
 * @param {string} taskId - The ID of the new task.
 * @param {string} taskTitle - The title of the new task.
 * @param {string} taskDesc - The description of the new task.
 * @param {string} taskCreationDate - The creation date of the new task.
 * @param {string} tasksContainer - The ID of the container element of the tasks.
 * @returns {void} This function does not return a value.
 *
 * @throws {Error} If taskId, taskTitle, taskDesc, taskCreationDate, or tasksContainer is not provided or is not a string.
 */
export function addTaskToList(taskId, taskTitle, taskDesc, taskCreationDate, tasksContainer) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
    }

    if (!taskTitle || typeof taskTitle !== 'string') {
        throw new Error('Task title must be provided and must be a string');
    }

    if (!taskDesc || typeof taskDesc !== 'string') {
        throw new Error('Task description must be provided and must be a string');
    }

    if (!taskCreationDate || typeof taskCreationDate !== 'string') {
        throw new Error('Task creation date must be provided and must be a string');
    }

    if (!tasksContainer || typeof tasksContainer !== 'string') {
        throw new Error('Tasks container ID must be provided and must be a string');
    }

    $(`#${tasksContainer}`).append(createTaskElem(taskId, taskTitle, taskDesc, taskCreationDate));
}

/**
 * Removes a specific task from the list of tasks.
 *
 * @function
 * @name removeTaskFromList
 *
 * @param {string} taskId - The ID of the task to be removed.
 * @param {string} tasksContainer - The ID of the container element of the tasks.
 * @returns {void} This function does not return a value.
 *
 * @throws {Error} If taskId or tasksContainer is not a string.
 */
export function removeTaskFromList(taskId, tasksContainer) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
    }

    if (!tasksContainer || typeof tasksContainer !== 'string') {
        throw new Error('Tasks container ID must be provided and must be a string');
    }

    const taskElement = getTaskFromList(taskId, tasksContainer);
    if (taskElement) {
        $(`#${tasksContainer}`).find(taskElement).remove();
    }
}

/**
 * Gets a specific task element from the list of tasks.
 *
 * @function
 * @name getTaskFromList
 *
 * @param {string} taskId - The ID of the task to retrieve.
 * @param {string} tasksContainer - The ID of the container element of the tasks.
 * @returns {HTMLElement} The task element, or null if not found.
 *
 * @throws {Error} If taskId or tasksContainer is not a string.
 */
export function getTaskFromList(taskId, tasksContainer) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
    }

    if (!tasksContainer || typeof tasksContainer !== 'string') {
        throw new Error('Tasks container ID must be provided and must be a string');
    }

    return $(`#${tasksContainer}`).find(`[data-task-id="${taskId}"]`);
}

/**
 * Updates a task in the list of tasks.
 *
 * @function
 * @name updateTaskFromList
 *
 * @param {number} taskId - The ID of the task.
 * @param {string} taskTitle - The updated title of the task.
 * @param {string} taskDesc - The updated description of the task.
 * @param {string} tasksContainer - The ID of the container element of the tasks.
 * @returns {void}
 *
 * @throws {Error} If taskId is not a number.
 * @throws {Error} If taskTitle is not a string.
 * @throws {Error} If taskDesc is not a string.
 * @throws {Error} If tasksContainer is not a string.
 */
export function updateTaskFromList(taskId, taskTitle, taskDesc, tasksContainer) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
    }

    if (!taskTitle || typeof taskTitle !== 'string') {
        throw new Error('Task title must be provided and must be a string');
    }

    if (!taskDesc || typeof taskDesc !== 'string') {
        throw new Error('Task description must be provided and must be a string');
    }

    if (!tasksContainer || typeof tasksContainer !== 'string') {
        throw new Error('Tasks container ID must be provided and must be a string');
    }

    const taskElement = getTaskFromList(taskId, tasksContainer);
    if (taskElement) {
        taskElement.find('.task-title').text(taskTitle);
        taskElement.find('.task-desc').text(taskDesc);
    }
}

/**
 * Retrieves task information from a task element.
 *
 * @function
 * @name getTaskInfo
 *
 * @param {jQuery} taskElement - The jQuery object representing the task element.
 * @returns {object} An object containing task information.
 *                   If taskElement is not provided or is not a jQuery object, an empty object is returned.
 *                   If any task information is not found, it is set to null.
 *                   The returned object has the following properties:
 *                      - taskId: The ID of the task.
 *                      - title: The title of the task.
 *                      - description: The description of the task.
 *                      - creationDate: The creation date of the task.
 */
export function getTaskInfo(taskElement) {
    if (!taskElement || typeof taskElement !== 'object') {
        return [];
    }

    return {
        taskId: taskElement.data('task-id') ?? null,
        title: taskElement.find('.task-title')?.text()?.trim() ?? null,
        description: taskElement.find('.task-desc')?.text()?.trim() ?? null,
        creationDate: taskElement.data('task-creation-date')?.trim() ?? null
    };
}

/**
 * Gets information about a specific task from the list of tasks.
 *
 * @function
 * @name getTaskInfoFromList
 *
 * @param {string} taskId - The ID of the task to retrieve information for.
 * @param {string} tasksContainer - The ID of the container element of the tasks.
 * @returns {object} The task information including title, description, and creation date.
 *
 * @throws {Error} If taskId or tasksContainer is not a string, or if the task is not found.
 */
export function getTaskInfoFromList(taskId, tasksContainer) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
    }

    if (!tasksContainer || typeof tasksContainer !== 'string') {
        throw new Error('Tasks container ID must be provided and must be a string');
    }

    const taskElement = $(`#${tasksContainer}`).find(`[data-task-id="${taskId}"]`);
    if (!taskElement.length) {
        throw new Error('Task not found in the list');
    }

    return getTaskInfo(taskElement);
}

/**
 * Marks a task in the task list as completed and updates its visual appearance.
 *
 * @function
 * @name markTaskListAsCompleted
 *
 * @param {number} taskId - The ID of the task to mark as completed.
 * @param {string} completedAtTime - The time at which the task was completed.
 * @param {string} tasksContainer - The ID of the container element of the tasks.
 * @returns {void} This function does not return a value.
 *
 * @throws {Error} If taskId is not provided or not a number.
 *                 If completedAtTime is not provided or not a string.
 *                 If tasksContainer is not provided or not a string.
 */
export function markTaskListAsCompleted(taskId, completedAtTime, tasksContainer) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
    }

    if (!completedAtTime) {
        throw new Error('Completed at time must be provided and must be a string');
    }

    if (!tasksContainer || typeof tasksContainer !== 'string') {
        throw new Error('Tasks container ID must be provided and must be a string');
    }

    const taskElement = getTaskFromList(taskId, tasksContainer);

    // Apply completed task styles
    taskElement.addClass('done-task');

    // Add strike line to title and description
    taskElement.find('.task-title, .task-desc').addClass('strike');

    // Change button icon to undo
    const spanIcon = taskElement.find('.done-span');
    const buttonIcon = taskElement.find('.done-btn');
    spanIcon.removeClass('fa-check').addClass('fa-undo');
    buttonIcon.removeClass('fa-check').addClass('fa-undo');

    // Update task's status with completed time
    taskElement.find('.task-info').html(`<i class="fa-solid fa-circle-check"></i> Completed: <span style="color: var(--theme-color);">${completedAtTime}</span>
    `);
}

/**
 * Marks a task in the task list as uncompleted and updates its visual appearance.
 *
 * @function
 * @name markTaskListAsUncompleted
 *
 * @param {number} taskId - The ID of the task to mark as uncompleted.
 * @param {string} createdAt - The time at which the task was created.
 * @param {string} tasksContainer - The ID of the container element of the tasks.
 * @returns {void} This function does not return a value.
 *
 * @throws {Error} If taskId is not provided or not a number.
 *                 If createdAt is not provided or not a string.
 *                 If tasksContainer is not provided or not a string.
 */
export function markTaskListAsUncompleted(taskId, createdAt, tasksContainer) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
    }

    if (!createdAt || typeof createdAt !== 'string') {
        throw new Error('Created at time must be provided and must be a string');
    }

    if (!tasksContainer || typeof tasksContainer !== 'string') {
        throw new Error('Tasks container ID must be provided and must be a string');
    }

    const taskElement = getTaskFromList(taskId, tasksContainer);

    // Remove completed task styles
    taskElement.removeClass('done-task');

    // Remove strike line from title and description
    taskElement.find('.task-title, .task-desc').removeClass('strike');

    // Change button icon to check
    const spanIcon = taskElement.find('.done-span');
    const buttonIcon = taskElement.find('.done-btn');
    spanIcon.removeClass('fa-undo').addClass('fa-check');
    buttonIcon.removeClass('fa-undo').addClass('fa-check');

    // Update task's status with created time
    taskElement.find('.task-info').html(`<i class="fa-solid fa-circle-check"></i> Created: <span style="color: var(--theme-color);">${createdAt}</span>`);
}


// --- Database Interaction Functions for Tasks ---
/**
 * Adds a new task to the database.
 *
 * @function
 * @name addTask
 *
 * @param {string} taskTitle - The title or name of the task.
 * @param {string} taskDesc - The description or details of the task.
 * @param {number} userId - The unique identifier for the user creating the task.
 * @returns {Promise} A Promise that resolves when the task is added to the database successfully.
 *
 * @throws {Error} If any of the required parameters (taskId, taskTitle, taskDesc, userId) is missing or of an incorrect type.
 */
export function addTask(taskTitle, taskDesc, userId) {
    if (!taskTitle || typeof taskTitle !== 'string') {
        throw new Error('Task title must be provided and must be a string');
    }

    if (!taskDesc || typeof taskDesc !== 'string') {
        throw new Error('Task description must be provided and must be a string');
    }

    if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be provided and must be a number');
    }

    return makeApiRequest('POST', apiUrl + '/create-task', {
        title: taskTitle,
        description: taskDesc,
        status: 'pending'
    }, {
        Authorization: getUserToken()
    });
}

/**
 * Removes a task from the database based on taskId.
 *
 * @function
 * @name removeTask
 *
 * @param {string} taskId - The ID of the task to be removed.
 * @param {string} userId - The ID of the current user.
 * @returns {Promise} A Promise that resolves when the task is removed from the database successfully.
 * @throws {Error} If taskId is not provided or not a string.
 */
export function removeTask(taskId, userId) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
    }

    if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be provided and must be a number');
    }

    return makeApiRequest('DELETE', apiUrl + `/remove-task/${taskId}`, null, {
        Authorization: getUserToken()
    });
}

/**
 * Gets a task from the database based on taskId.
 *
 * @function
 * @name getTask
 *
 * @param {string} taskId - The ID of the task to retrieve.
 * @returns {Promise} A Promise that resolves with the task data if found, or rejects if not found.
 *
 * @throws {Error} If taskId is not provided or not a string.
 */
export function getTask(taskId) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
    }

    return makeApiRequest('GET', apiUrl + `/get-task/${taskId}`, null, {
        Authorization: getUserToken()
    });
}

/**
 * Gets the list of tasks for the current user from the database.
 *
 * @function
 * @name getTasks
 *
 * @param {string} userId - The ID of the current user.
 * @returns {Promise} A Promise that resolves with the list of tasks for the current user.
 *
 * @throws {Error} If userId is not provided or not a string.
 */
export function getTasks(userId) {
    if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be provided and must be a number');
    }

    return makeApiRequest('GET', apiUrl + `/get-tasks`, null, {
        Authorization: getUserToken()
    });
}

/**
 * Marks a task as completed in the database.
 *
 * @function
 * @name markTaskAsCompleted
 *
 * @param {number} taskId - The ID of the task to mark as completed.
 * @param {string} completedAtTime - The time at which the task was completed.
 * @returns {Promise} A Promise that resolves when the task is marked as completed in the database successfully.
 *
 * @throws {Error} If taskId is not provided or not a number, or if completedAtTime is not provided or not a string.
 */
export function markTaskAsCompleted(taskId, completedAtTime) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
    }

    if (!completedAtTime || typeof completedAtTime !== 'string') {
        throw new Error('Completed at time must be provided and must be a string');
    }

    return makeApiRequest('PUT', apiUrl + `/update-task/${taskId}`, {
        completed_at: completedAtTime,
        status: 'completed'
    }, {
        Authorization: getUserToken()
    });
}

export function markTaskAsUncompleted(taskId) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
/**
 * Marks a task as uncompleted by updating its status and completion timestamp.
 *
 * @function
 * @name markTaskAsUncompleted
 *
 * @param {string} taskId - The unique identifier of the task to be marked as uncompleted.
 * @returns {Promise} A promise that resolves to the response of the API request.
 *
 * @throws {Error} If the `taskId` parameter is not provided.
 */
    }

    return makeApiRequest('PUT', apiUrl + `/update-task/${taskId}`, {
        completed_at: null,
        status: 'pending'
    }, {
        Authorization: getUserToken()
    });
}

/**
 * Updates a task with the provided title and description.
 *
 * @function
 * @name updateTask
 *
 * @param {number} taskId - The ID of the task to update.
 * @param {string} taskTitle - The updated title of the task.
 * @param {string} taskDesc - The updated description of the task.
 * @param {number} userId - The ID of the user updating the task.
 * @returns {Promise<Object>} A promise that resolves with the response from the API request.
 *
 * @throws {Error} If taskId is not a number.
 * @throws {Error} If taskTitle is not a string.
 * @throws {Error} If taskDesc is not a string.
 * @throws {Error} If userId is not a number.
 */
export function updateTask(taskId, taskTitle, taskDesc, userId) {
    if (!taskId || typeof taskId !== 'number') {
        throw new Error('Task ID must be provided and must be a number');
    }

    if (!taskTitle || typeof taskTitle !== 'string') {
        throw new Error('Task title must be provided and must be a string');
    }

    if (!taskDesc || typeof taskDesc !== 'string') {
        throw new Error('Task description must be provided and must be a string');
    }

    if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be provided and must be a number');
    }

    return makeApiRequest('PUT', `${apiUrl}/update-task/${taskId}`, {
        title: taskTitle,
        description: taskDesc
    }, {Authorization: getUserToken()});
}

/**
 * Retrieves tasks associated with a specific user from the database.
 *
 * @function
 * @name getUserTasks
 *
 * @param {string} userId - The ID of the user whose tasks are to be retrieved.
 * @returns {Promise} A Promise that resolves with the tasks retrieved from the database.
 *
 * @throws {Error} If userId is not provided.
 */
export function getUserTasks(userId) {
    if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be provided and must be a number');
    }

    return makeApiRequest('GET', apiUrl + '/get-tasks', null, {
        Authorization: getUserToken()
    });
}