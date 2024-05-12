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