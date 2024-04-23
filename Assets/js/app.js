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
    getFormInputs
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