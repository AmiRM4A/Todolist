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
    hasClass,
    toggleClass,
    getParentElementByClassName,
    removeClass,
    addClass,
    tooltip
} from './modules/utilitiesModule.js';
import {typeHeaderText} from './modules/typingAnimationModule.js';
import {selectThemeColor} from './modules/themeModule.js';
import {toggleColorMenu, toggleMenuContent} from './modules/menuModule.js';
import {LOCAL_STORAGE_TASKS_KEY} from './modules/constantsModule.js';
import {validateEmail, validateName, validatePassword, validateUsername} from './modules/formValidationModule.js';

const taskInput = $('#taskInput');
const tasksCon = $('.todo');
const menuContainer = $('#menuContainer');
const menuContent = $('.menuContent');
const menuBtn = $(".menuBtn");
const taskEditModal = $('#taskEditModal');
const tasksSection = $('#tasksSection');

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
    if (colorRgbCode !== null) selectThemeColor(colorRgbCode);
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
    const modalId = taskEditModal.find('.taskId');
    const modalTitle = taskEditModal.find('#taskTitle');
    const modalDesc = taskEditModal.find('#taskDescription');
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
        id: Number(taskEditModal.find('.taskId').val()),
        name: taskEditModal.find('#taskTitle').val(),
        desc: taskEditModal.find('#taskDescription').val(),
        status: (taskEditModal.find('#taskStatus').is(':checked'))
    }

    // Mark tasks as completed/uncompleted based on status input value
    const taskElem = selectTask(data.id, tasksCon);
    if (data.status) markTaskAsCompleted(taskElem, getTaskData(tasks, data.id), tasks);
    else undoCompletedTask(taskElem, tasks);

    // Apply new changes to storage and page
    updateTaskInDom(selectTask(data.id, tasksCon), data);
    updateTaskInStorage(getStorageTaskIndex(data.id, tasks), tasks, data);

    toggleClass(taskEditModal, 'showModal');
}


/* --- Handling Validation Functions --- */
/**
 * Shows or hides the validation error message for a given input field.
 * @param {string} inputId - The ID of the input field.
 * @param {boolean} isValid - Whether the input value is valid or not.
 */
function toggleInputValidationError(inputId, isValid) {
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
        addClass('sticky', header);
    } else if ($(window).scrollTop() < 51) {
        removeClass('sticky', header);
    }
});

tasksSection.on('click', (event) => {
    event.preventDefault();
    const target = event.target;
    const taskElem = getParentElementByClassName(target, 'task');
    if (target.hasClass('addTodoBtn')) {
        const taskName = taskInput.val();
        if (taskName) addTask(taskName, tasksCon, tasks, false);
    } else if (target.hasClass('fa-times')) {
        event.preventDefault();
        removeTask(taskElem, tasks);
    } else if (target.hasClass('fa-edit')) {
        event.preventDefault();
        fillEditTaskModalInputs(taskElem);
        toggleClass(taskEditModal, 'showModal');
    } else if (target.hasClass('fa-undo')) {
        event.preventDefault();
        undoCompletedTask(taskElem, tasks);
    } else if (target.hasClass('done-span') || target.hasClass('done-btn')) {
        event.preventDefault();
        // Mark selected task as completed
        markTaskAsCompleted(taskElem, getTaskData(tasks, getTaskId(taskElem)), tasks);
    }
});

taskEditModal.on('click', (event) => {
    const target = event.target;
    if (target.hasClass('closeButton')) {
        event.preventDefault();
        toggleClass(taskEditModal, 'showModal');
    } else if (target.hasClass('saveModal')) {
        event.preventDefault();
        handleSaveModalBtnClick();
    }
});

menuContainer.on('click', (event) => {
    event.preventDefault();
    const target = event.target;
    if (target.hasClass('menuClose')) toggleMenuContent(menuBtn, menuContent);
    else if (target.hasClass('fa-paint-roller') || target.hasClass('colorMenuClose')) toggleColorMenu();
    else if (target.hasClass('colorItem')) {
        const colorRgbCode = target.css('background-color');
        selectThemeColor(colorRgbCode);
        setToStorage('theme-color', colorRgbCode);
    }
});

menuBtn.on('click', (event) => {
    event.preventDefault();
    toggleMenuContent(menuBtn, menuContent);
});

$(document).on('keyup', (event) => {
    if (event.key === 'Escape') {
        // After pressing Esc key, check for open modals to close them
        if (hasClass(taskEditModal, 'showModal')) toggleClass(taskEditModal, 'showModal');
        else if (hasClass(menuContent, 'show-menu')) toggleMenuContent(menuBtn, menuContent);
    }
});

$('.eye-icon').on('click', (event) => {
    event.preventDefault();

    const $passwordInput = $('#password');
    const $eyeIcon = $(this);


tippy('#password-info', {
    content: "Must contain 8 letters at least",
    arrow: true,
    animation: 'scale'
});

tippy('#email-info', {
    content: "Example@gmail.com",
    arrow: true,
    animation: 'scale'
    $passwordInput.attr('type', $passwordInput.attr('type') === 'password' ? 'text' : 'password');
    $eyeIcon.toggleClass('fa-eye fa-eye-slash');
});

tippy('#username-info', {
    content: "At least 3 letters",
    arrow: true,
    animation: 'scale'
});

tippy('#name-info', {
    content: "At least 5 letters",
    arrow: true,
    animation: 'scale'
});

tippy('#re-password-info', {
    content: "Must match with password",
    arrow: true,
    animation: 'scale'
});
// Event listeners for validating inputs
handleInputValidation('email', validateEmail);
handleInputValidation('password', validatePassword);
handleInputValidation('name', validateName);
handleInputValidation('username', validateUsername);

// Call API Services
$('#login-form').submit(function (event) {
    event.preventDefault();
    //todo: check if inputs are empty show the custom error created under them (display it on), if they are valid, use api to connect to backend
});

$('#register-form').submit(function (event) {
    event.preventDefault();
    //todo: check if inputs are empty show the custom error created under them (display it on), if they are valid, use api to connect to backend
});