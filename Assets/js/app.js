import config from '/config.js';
import {
    setToStorage,
    getFromStorage,
    updateTaskInStorage,
    loadStorageTasks,
    getStorageTaskIndex
} from './modules/storageModule.js';
import {updateTaskInDom, removeTask, addTask, getTaskId, selectTask, getTaskData} from './modules/taskModule.js';
import {undoCompletedTask, markTaskAsCompleted} from './modules/completedTaskModule.js';
import {
    getParentElementByClassName,
    tooltip,
    makeApiRequest
} from './modules/utilitiesModule.js';
import {typeHeaderText} from './modules/typingAnimationModule.js';
import {selectThemeColor} from './modules/themeModule.js';
import {toggleColorMenu, toggleMenuContent} from './modules/menuModule.js';
import {LOCAL_STORAGE_TASKS_KEY} from './modules/constantsModule.js';
import {validateEmail, validateName, validatePassword, validateUsername} from './modules/formValidationModule.js';

const taskInput = $('#task-input');
const tasksCon = $('.todo');
const menuContainer = $('#menu-container');
const menu = $('#menu');
const menuBtn = $(".menu-btn");
const taskEditModal = $('#task-edit-modal');
const tasksSection = $('#tasks-section');

/* Initialize tasks array */
let tasks;

/**
 * Initializes data from local storage and sets up event listeners.
 *
 * @function
 * @name initialize
 *
 * @description Initializes data from local storage and sets up event listeners for the application.
 */
function initialize() {
    typeHeaderText();
    const colorRgbCode = getFromStorage('theme-color', true);

    if (colorRgbCode !== null) {
        selectThemeColor(colorRgbCode);
    }

    const storageTasksArr = getFromStorage(LOCAL_STORAGE_TASKS_KEY, true);

    if (storageTasksArr !== null && typeof storageTasksArr === 'object') {
        loadStorageTasks(storageTasksArr, tasksCon);
        tasks = storageTasksArr;
        return;
    }

    tasks = [];
}

/**
 * Fills the input fields in the edit task modal with data from a task element.
 *
 * @function
 * @name fillEditTaskModalInputs
 *
 * @param {Element} taskElem - The task element to retrieve data from.
 *
 * @description Fills the input fields in the edit task modal with data from the selected task element.
 */
function fillEditTaskModalInputs(taskElem) {
    const modalId = taskEditModal.find('.task-id');
    const modalTitle = taskEditModal.find('#task-title');
    const modalDesc = taskEditModal.find('#task-description');
    modalId.val(getTaskId(taskElem));
    modalTitle.val($(taskElem).find('.task-title').text());
    modalDesc.val($(taskElem).find('.task-desc').text());
}

/**
 * Handles saving data from the edit task modal.
 *
 * @function
 * @name handleSaveModalBtnClick
 *
 * @description Handles the click event on the save button in the edit task modal and updates the task data.
 */
function handleSaveModalBtnClick() {
    // Get new changes of task from tasks edit modal
    const data = {
        id: Number(taskEditModal.find('.task-id').val()),
        name: taskEditModal.find('#task-title').val(),
        desc: taskEditModal.find('#task-description').val(),
        status: (taskEditModal.find('#task-status').is(':checked'))
    }

    // Mark tasks as completed/uncompleted based on status input value
    const taskElem = selectTask(data.id, tasksCon);

    if (data.status) {
        markTaskAsCompleted(taskElem, getTaskData(tasks, data.id), tasks);
    } else {
        undoCompletedTask(taskElem, tasks);
    }

    // Apply new changes to storage and page
    updateTaskInDom(selectTask(data.id, tasksCon), data);
    updateTaskInStorage(getStorageTaskIndex(data.id, tasks), tasks, data);

    taskEditModal.toggleClass('show-modal');
}

/* --- Handling Validation Functions --- */
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

// Initialize Tippy elements
tooltip('#password-info', "Must contain 8 letters at least");
tooltip('#email-info', "Example@gmail.com");
tooltip('#username-info', "At least 3 letters");
tooltip('#name-info', "At least 5 letters");
tooltip('#re-password-info', "Must match with password");

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

tasksSection.on('click', function(event) {
    event.preventDefault();
    const target = $(event.target);
    const taskElem = getParentElementByClassName(target[0], 'task');

    if (target.hasClass('add-todo-btn')) {
        const taskName = taskInput.val();
        if (taskName) {
            addTask(taskName, tasksCon, tasks, false);
        }
    } else if (target.hasClass('fa-times')) {
        removeTask(taskElem, tasks);
    } else if (target.hasClass('fa-edit')) {
        fillEditTaskModalInputs(taskElem);
        taskEditModal.toggleClass('show-modal');
    } else if (target.hasClass('fa-undo')) {
        undoCompletedTask(taskElem, tasks);
    } else if (target.hasClass('done-span') || target.hasClass('done-btn')) {
        // Mark selected task as completed
        markTaskAsCompleted(taskElem, getTaskData(tasks, getTaskId(taskElem)), tasks);
    }
});

taskEditModal.on('click', function(event) {
    const target = $(event.target);

    if (target.hasClass('close-button')) {
        taskEditModal.toggleClass('show-modal');
    } else if (target.hasClass('save-modal')) {
        handleSaveModalBtnClick();
    }
});

menuContainer.on('click', function(event) {
    event.preventDefault();
    const target = $(event.target);

    if (target.hasClass('menu-close')) {
        toggleMenuContent(menu);
    } else if (target.hasClass('fa-paint-roller') || target.hasClass('color-menu-close')) {
        toggleColorMenu();
    } else if (target.hasClass('color-item')) {
        const colorRgbCode = target.css('background-color');
        selectThemeColor(colorRgbCode);
        setToStorage('theme-color', colorRgbCode);
    }
});

menuBtn.on('click', (event) => {
    event.preventDefault();
    toggleMenuContent(menu);
});

$(document).on('keyup', (event) => {
    if (event.key === 'Escape') {
        // After pressing Esc key, check for open modals to close them
        if (taskEditModal.hasClass('show-modal')) {
            taskEditModal.toggleClass('show-modal');
        } else if (menu.hasClass('show-menu')) {
            toggleMenuContent(menu);
        }
    }
});

$('.eye-icon').on('click', (event) => {
    event.preventDefault();

    const target = $(event.target).prev();
    const eyeIcon = $(this);

    target.attr('type', target.attr('type') === 'password' ? 'text' : 'password');
    eyeIcon.toggleClass('fa-eye fa-eye-slash');
});

// Event listeners for validating inputs
handleInputValidation('email', validateEmail);
handleInputValidation('password', validatePassword);
handleInputValidation('name', validateName);
handleInputValidation('username', validateUsername);
handleInputValidation('re-password', (re_password) => re_password && re_password === $('#password').val());

// Call API Services
$('#login-form').submit((event) => {
    event.preventDefault();

    const email = $('#email').val();
    const password = $('#password').val();
    const remember_me = $('#remember-me').prop('checked');

    if (!email || !validateEmail(email)) {
        toggleInputValidationError('email');
        return;
    }

    if (!password || !validatePassword(password)) {
        toggleInputValidationError('password');
        return;
    }

    const apiUrl = config['apiUrl'];

    makeApiRequest('GET', apiUrl + '/get-tasks')
        .then(response => {
            console.log('Response:', response);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
});

$('#register-form').submit((event) => {
    event.preventDefault();

    const name = $('#name').val();
    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const re_password = $('#re-password').val();

    if (!name || !validateName(name)) {
        toggleInputValidationError('name');
        return;
    }

    if (!username || !validateUsername(username)) {
        toggleInputValidationError('username');
        return;
    }

    if (!email || !validateEmail(email)) {
        toggleInputValidationError('email');
        return;
    }

    if (!password || !validatePassword(password)) {
        toggleInputValidationError('password');
        return;
    }

    if (!re_password || re_password !== password) {
        toggleInputValidationError('re-password');
        return;
    }

    const apiUrl = config['apiUrl'];

    makeApiRequest('GET', apiUrl + '/get-tasks')
        .then(response => {
            console.log('Response:', response);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
});