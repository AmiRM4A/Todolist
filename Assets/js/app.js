import config from '/config.js';
import {getSessionStorage, removeSessionStorage, setSessionStorage} from './modules/sessionStorageModule.js';
import {
    errorAlert,
    getUserToken,
    makeApiRequest,
    redirectTo,
    selectThemeColor
} from './modules/utilitiesModule.js';
import {
    addTask,
    addTaskToList,
    getTaskInfo,
    getUserTasks, markTaskListAsCompleted, markTaskAsCompleted,
    removeTask,
    removeTaskFromList, markTaskAsUncompleted, markTaskListAsUncompleted, updateTask, updateTaskFromList
} from './modules/taskModule.js';

const menu = $('#menu');
const taskEditModal = $('#task-edit-modal');

/* Initialize userData array */
let userData = [];

/**
 * Type the header text with a typing animation.
 *
 * @function
 * @name typeHeaderText
 *
 * @returns {void} This function does not return a value.
 */
function typeHeaderText() {
    const textToType = 'Get it done!';
    const h1Elem = $('#tasks-header h1');
    const caret = $('.blink-caret');
    let i = 0;
    const typeNextCharacter = () => {
        if (i < textToType.length) {
            h1Elem.text(h1Elem.text() + textToType.charAt(i));
            i++;
            setTimeout(typeNextCharacter, 100);
        } else {
            caret.hide();
        }
    }
    typeNextCharacter();
}

/**
 * Initializes data from local storage and sets up event listeners.
 *
 * @function
 * @name initialize
 *
 * @returns {void} This function does not return a value.
 */
function initialize() {
    // Check if token's data is already set in the session storage
    if (getSessionStorage('Authorization') === null) {
        // Redirect to login page
        removeSessionStorage('user');
        redirectTo(config.baseUrl + '/login.html');
    }

    typeHeaderText();

    // Check if custom theme color exists in session storage
    if (getSessionStorage('theme-color')) {
        selectThemeColor(getSessionStorage('theme-color'));
    }

    $(document).ready(() => {
        const apiUrl = config.apiUrl + '/me';
        makeApiRequest('POST', apiUrl, null, {Authorization: getUserToken()})
            .then(response => {
                userData = response.data;
                if (!userData || !userData.id || userData.length === 0) {
                    removeSessionStorage('user');
                    removeSessionStorage('Authorization');
                    redirectTo(config.baseUrl + '/login.html');
                } else {
                    setSessionStorage('user', userData);
                    // Call to api and get user's tasks
                    getUserTasks(userData.id)
                        .then(response => {
                            const tasksArr = response.data;
                            if (tasksArr !== null && typeof tasksArr === 'object') {
                                // For each on tasks array and adding them to the tasks list (addTaskToList);
                                $.each(tasksArr, (index, taskData) => {
                                    addTaskToList(taskData.id, taskData.title, taskData.description, taskData.created_at, 'todos');
                                    // Mark task as completed in the list if it is completed
                                    if (taskData.status && taskData.status === 'completed' && taskData.completed_at !== '0000-00-00 00:00:00') {
                                        markTaskListAsCompleted(taskData.id, taskData.completed_at, 'todos');
                                    }
                                });
                            }
                        });
                }
            })
            .catch(error => {
                console.error(error);
                // Redirecting to login page if token is invalid
                if (error.status === 401) {
                    removeSessionStorage('Authorization');
                    removeSessionStorage('user');
                    redirectTo(config.baseUrl + '/login.html');
                } else {
                    errorAlert();
                }
            });
    });
}

/* --- Event listeners --- */
$(window).on('load', initialize);

$(window).on('scroll', () => {
    const header = $('header');
    if ($(window).scrollTop() > 59) {
        header.addClass('sticky');
    } else if ($(window).scrollTop() < 51) {
        header.removeClass('sticky');
    }
});

$('#tasks-section').click(function (e) {
    e.preventDefault();

    const target = $(e.target);
    const task = target.closest('.task') || null;
    const taskData = getTaskInfo(task || null);
    const taskId = taskData.taskId || null;

    // Add New Task
    if (target.hasClass('add-todo-btn')) {
        const addTaskInput = $('#task-input');
        const taskTitle = addTaskInput.val().trim();
        const taskDescription = 'Edit task to add description...';

        if (taskTitle) {
            addTask(taskTitle, taskDescription, userData.id)
                .then(response => {
                    const id = response.data.id;
                    const createdAt = response.data.created_at;
                    if (id && id > 0) {
                        addTaskToList(id, taskTitle, taskDescription, createdAt, 'todos');
                    }
                })
                .catch(error => {
                    console.error(error);
                    errorAlert('Oops...!', 'Failed to add task!');
                });
            addTaskInput.val('');
        }
    }

    // Mark Existing Task as Completed
    if (task && taskData && target.hasClass('fa-check')) {
        if (taskId > 0) {
            markTaskAsCompleted(taskId)
                .then(response => {
                    markTaskListAsCompleted(taskId, response.data.completed_at ,'todos');
                })
                .catch(error => {
                    console.error(error);
                    errorAlert('Oops...!', 'Failed to check task!');
                });
        }
    }

    // Mark Existing Task as Uncompleted
    if (task && taskData && target.hasClass('fa-undo')) {
        if (taskId > 0 && taskData.creationDate && typeof taskData.creationDate === 'string') {
            markTaskAsUncompleted(taskId)
                .then(response => {
                    markTaskListAsUncompleted(taskId, response.data.created_at, 'todos');
                })
                .catch(error => {
                    console.error(error);
                    errorAlert('Oops..!', 'Failed to uncheck task!');
                });
        }
    }

    // Delete Existing Task
    if (task && taskData && target.hasClass('fa-times')) {
        if (taskId > 0) {
            removeTask(taskId, userData.id)
                .then(response => {
                    removeTaskFromList(taskId, 'todos');
                })
                .catch(error => {
                    console.error(error);
                    errorAlert('Oops...!', 'Failed to remove task!');
                });
        }
    }

    if (task && taskData && target.hasClass('fa-edit')) {
        if (taskId > 0 && taskData && taskData.title && taskData.description) {
            // Display edit task modal
            taskEditModal.toggleClass('show-modal');

            // Set modal's data based on the task's data (id, title and description)
            taskEditModal.find('#task-id').val(taskId);
            taskEditModal.find('#task-title').val(taskData.title);
            taskEditModal.find('#task-description').val(taskData.description);

        }
    }
});

$('body div.container').click(function (e) {
    const target = $(e.target);

    // Close task edit modal (display none)
    if (target.hasClass('close-button')) {
        taskEditModal.toggleClass('show-modal');
        taskEditModal.find('#task-id').removeAttr('value');
    }

    // Update task in DB based on task edit modal's data
    if (target.hasClass('save-modal')) {
        const taskId = taskEditModal.find('#task-id').val() || null;
        const taskTitle = taskEditModal.find('#task-title').val() || null;
        const taskDescription = taskEditModal.find('#task-description').val() || 'Edit task to add description...';

        if (taskId > 0 && taskTitle) {
            updateTask(taskId, taskTitle, taskDescription, userData.id || null)
                .then(response => {
                    if (!response) {
                        throw new Error('Unable to update the task');
                    }

                    // Update task in the list (front)
                    updateTaskFromList(taskId, taskTitle, taskDescription, 'todos');

                    // Close task edit modal (display none)
                    taskEditModal.toggleClass('show-modal');
                    taskEditModal.find('#task-id').removeAttr('value');
                })
                .catch(error => {
                    console.error(error);
                    errorAlert('Oops..!', 'Failed to update task!');
                });
        }
    }
});

$(window).on('keyup', (e) => {
    e.preventDefault();
    // Check if pressed key is ESC
    if (e.keyCode !== 27) {
        return;
    }

    // Close edit modal if it's open
    if (taskEditModal.hasClass('show-modal')) {
        taskEditModal.removeClass('show-modal');
    }

    // Close menu if it's open
    if (menu.hasClass('show-menu')) {
        menu.removeClass('show-menu');
    }
});

$('#nav-container').click((e) => {
    const target = $(e.target);
    // Show menu (by left & up styles)
    if (target.hasClass('menu-btn') || target.hasClass('bar')) {
        menu.addClass('show-menu');
    }

    // Close menu/theme colors menu
    if (target.hasClass('fa-times')) {
        if (target.hasClass('color-menu-close')) {
            $('#colors-menu').removeClass('show-menu');
            return;
        }

        menu.removeClass('show-menu');
    }

    // Log out the user
    if (target.hasClass('fa-sign-out')) {
        makeApiRequest('POST', config.apiUrl + '/log-out', null, {Authorization: getUserToken()})
            .then(response => {
                if (response) {
                    removeSessionStorage('Authorization');
                    removeSessionStorage('user');
                    redirectTo(config.baseUrl + '/login.html');
                } else {
                    throw new Error('Unable to log you out!');
                }
            })
            .catch(error => {
                console.error(error);
                errorAlert('Log-out Failed!');
            });
    }

    // Open theme colors menu
    if (target.hasClass('fa-paint-roller')) {
        $('#colors-menu').toggleClass('show-menu');
    }

    // Change theme color
    if (target.hasClass('color-item')) {
        const color = target.css('background-color') ?? '#bb86fc';
        selectThemeColor(color);
        setSessionStorage('theme-color', color);
    }
});