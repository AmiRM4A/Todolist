import config from '/config.js';
import {getSessionStorage, removeSessionStorage} from './modules/sessionStorageModule.js';
import {getCurrentDateTime, redirectTo} from './modules/utilitiesModule.js';
import {
    addTask,
    addTaskToList,
    getTaskInfo,
    getUserTasks, markTaskListAsCompleted, markTaskAsCompleted,
    removeTask,
    removeTaskFromList, markTaskAsUncompleted, markTaskListAsUncompleted
} from './modules/taskModule.js';

const menu = $('#menu');
const menuButton = $(".menu-btn");
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
    typeHeaderText();

    userData = getSessionStorage('user');
    if (!userData || userData.length === 0 || !userData.id) {
        removeSessionStorage('user');
        removeSessionStorage('Authorization');
        redirectTo(config.baseUrl + '/login.html');
    }

    getUserTasks(userData.id)
        .then(response => {
            const tasksArr = JSON.parse(response);
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
        })
        .catch(error => {
            // Alert: Something went wrong - the error came from back-end
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
    const taskData = getTaskInfo(task ?? null);
    const taskId = Number(taskData.taskId) ?? null;

    // Add New Task
    if (target.hasClass('add-todo-btn')) {
        const taskTitle = $('#task-input').val().trim();
        const taskDescription = 'Edit task for adding description...';

        addTask(taskTitle, taskDescription, userData.id)
            .then(response => {
                const id = Number(response);
                if (id && (typeof id === 'number' && id > 0)) {
                    addTaskToList(id, taskTitle, taskDescription, getCurrentDateTime(), 'todos');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Mark Existing Task as Completed
    if (task && taskData && target.hasClass('fa-check')) {
        const currentDateTime = getCurrentDateTime();
        if ((currentDateTime && typeof currentDateTime === 'string') && (typeof taskId === 'number' && taskId > 0)) {
            markTaskAsCompleted(Number(taskId), currentDateTime).then(response => markTaskListAsCompleted(taskId, currentDateTime, 'todos'));
        }
    }

    // Mark Existing Task as Uncompleted
    if (task && taskData && target.hasClass('fa-undo')) {
        if (taskId && taskId > 0 && taskData.creationDate && typeof taskData.creationDate === 'string') {
            markTaskAsUncompleted(taskId).then(response => markTaskListAsUncompleted(taskId, taskData.creationDate, 'todos'));
        }
    }

    // Delete Existing Task
    if (task && taskData && target.hasClass('delete')) {
        if (taskId && taskId > 0) {
            removeTask(taskId, userData.id).then(response => removeTaskFromList(taskId, 'todos'));
        }
    }

    if (task && taskData && target.hasClass('edit')) {
        console.log('Task must be edited');
    }
});