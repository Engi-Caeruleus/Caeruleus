// ========================================
// STUDENT PLANNER
// ========================================

let tasks = [];

let editingTaskId = null;

let calendarDate = new Date();


// ========================================
// LOAD TASKS
// ========================================

function loadTasks() {

    const saved =
        localStorage.getItem(
            "studentPlannerTasks"
        );

    if (saved) {

        try {

            tasks = JSON.parse(saved);

        } catch {

            tasks = [];

        }

    } else {

        tasks = [];

    }

    tasks = tasks.map(task => ({

        ...task,

        progress:
            Number(task.progress) || 0,

        notes:
            task.notes || "",

        description:
            task.description || "",

        completed:
            task.completed === true ||
            Number(task.progress) === 100

    }));

}


// ========================================
// SAVE TASKS
// ========================================

function saveTasks() {

    localStorage.setItem(
        "studentPlannerTasks",
        JSON.stringify(tasks)
    );

}


// ========================================
// ELEMENTS
// ========================================

const modal =
    document.getElementById(
        "task-modal"
    );

const form =
    document.getElementById(
        "task-form"
    );

const modalTitle =
    document.getElementById(
        "modal-title"
    );

const titleInput =
    document.getElementById(
        "task-title"
    );

const subjectInput =
    document.getElementById(
        "task-subject"
    );

const priorityInput =
    document.getElementById(
        "task-priority"
    );

const dateInput =
    document.getElementById(
        "task-due-date"
    );

const progressInput =
    document.getElementById(
        "task-progress"
    );

const progressValue =
    document.getElementById(
        "modal-progress-value"
    );

const notesInput =
    document.getElementById(
        "task-notes"
    );

const descriptionInput =
    document.getElementById(
        "task-description"
    );


// ========================================
// OPEN ADD TASK
// ========================================

function openAddTask() {

    editingTaskId = null;

    modalTitle.textContent =
        "Add New Task";

    form.reset();

    progressInput.value = 0;

    progressValue.textContent =
        "0%";

    modal.classList.remove(
        "hidden"
    );

}


// ========================================
// OPEN EDIT TASK
// ========================================

function openEditTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );

    if (!task) return;

    editingTaskId = id;

    modalTitle.textContent =
        "Edit Task";

    titleInput.value =
        task.title;

    subjectInput.value =
        task.subject;

    priorityInput.value =
        task.priority;

    dateInput.value =
        task.dueDate;

    progressInput.value =
        task.progress || 0;

    progressValue.textContent =
        (task.progress || 0) + "%";

    notesInput.value =
        task.notes || "";

    descriptionInput.value =
        task.description || "";

    modal.classList.remove(
        "hidden"
    );

}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    modal.classList.add(
        "hidden"
    );

    editingTaskId = null;

}


document
    .getElementById(
        "close-modal"
    )
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById(
        "cancel-task"
    )
    .addEventListener(
        "click",
        closeModal
    );


modal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


// ========================================
// ADD BUTTONS
// ========================================

document
    .querySelectorAll(
        ".add-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                openAddTask
            );

        }
    );


// ========================================
// PROGRESS SLIDER
// ========================================

progressInput.addEventListener(
    "input",
    function() {

        progressValue.textContent =
            progressInput.value + "%";

    }
);


// ========================================
// SAVE TASK
// ========================================

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const title =
            titleInput.value.trim();

        const subject =
            subjectInput.value.trim();

        const priority =
            priorityInput.value;

        const dueDate =
            dateInput.value;

        const progress =
            Number(
                progressInput.value
            );

        const notes =
            notesInput.value.trim();

        const description =
            descriptionInput.value.trim();


        // Notes required below 100%

        if (
            progress < 100 &&
            notes === ""
        ) {

            alert(
                "Notes are required when the task is not 100% complete."
            );

            notesInput.focus();

            return;

        }


        // Editing

        if (
            editingTaskId !== null
        ) {

            const task =
                tasks.find(
                    task =>
                        task.id ===
                        editingTaskId
                );

            if (task) {

                task.title =
                    title;

                task.subject =
                    subject;

                task.priority =
                    priority;

                task.dueDate =
                    dueDate;

                task.progress =
                    progress;

                task.notes =
                    notes;

                task.description =
                    description;

                task.completed =
                    progress === 100;

            }

        }

        // New task

        else {

            tasks.push({

                id:
                    Date.now(),

                title:
                    title,

                subject:
                    subject,

                priority:
                    priority,

                dueDate:
                    dueDate,

                progress:
                    progress,

                notes:
                    notes,

                description:
                    description,

                completed:
                    progress === 100

            });

        }


        saveTasks();

        closeModal();

        updateEverything();

    }
);


// ========================================
// CREATE TASK ELEMENT
// ========================================

function createTaskElement(task) {

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "task";


    if (
        task.completed
    ) {

        element.classList.add(
            "completed"
        );

    }


    const progress =
        Number(
            task.progress
        ) || 0;


    element.innerHTML = `

        <div class="task-checkbox">

            <input
                type="checkbox"
                class="task-checkbox-input"
                ${task.completed ? "checked" : ""}
            >

        </div>


        <div class="task-info">

            <h3>
                ${escapeHTML(task.title)}
            </h3>


            <div class="task-details">

                <span>
                    ${escapeHTML(task.subject)}
                </span>

                <span>
                    Due ${formatDate(task.dueDate)}
                </span>

            </div>


            <div class="task-progress">

                <div class="task-progress-top">

                    <span>
                        Progress
                    </span>

                    <strong>
                        ${progress}%
                    </strong>

                </div>


                <div class="task-progress-bar">

                    <div
                        class="task-progress-fill"
                        style="width:${progress}%"
                    ></div>

                </div>

            </div>


            ${
                task.description
                    ? `
                        <div class="task-description">

                            <strong>
                                What to do:
                            </strong>

                            <div>
                                ${escapeHTML(
                                    task.description
                                )}
                            </div>

                        </div>
                    `
                    : ""
            }


            ${
                task.notes
                    ? `
                    <div class="task-notes">

                        <strong>
                            Notes:
                        </strong>

                        ${escapeHTML(
                            task.notes
                        )}

                    </div>
                    `
                    : ""
            }

        </div>


        <div
            class="priority ${task.priority.toLowerCase()}"
        >
            ${task.priority}
        </div>


        <div class="task-actions">

            <button class="edit-task">
                ✏️ Edit
            </button>

            <button class="delete-task">
                🗑️
            </button>

        </div>

    `;


    // Checkbox

    const checkbox =
        element.querySelector(
            ".task-checkbox-input"
        );


    checkbox.addEventListener(
        "change",
        function() {

            if (
                checkbox.checked
            ) {

                if (
                    !task.notes ||
                    task.notes.trim() === ""
                ) {

                    const notes =
                        prompt(
                            "What did you complete?"
                        );

                    if (
                        !notes ||
                        notes.trim() === ""
                    ) {

                        checkbox.checked =
                            false;

                        return;

                    }

                    task.notes =
                        notes.trim();

                }

                task.progress =
                    100;

                task.completed =
                    true;

            } else {

                task.progress =
                    0;

                task.completed =
                    false;


                if (
                    !task.notes ||
                    task.notes.trim() === ""
                ) {

                    const notes =
                        prompt(
                            "What still needs to be done?"
                        );

                    if (
                        !notes ||
                        notes.trim() === ""
                    ) {

                        return;

                    }

                    task.notes =
                        notes.trim();

                }

            }


            saveTasks();

            updateEverything();

        }
    );


    // Edit

    element
        .querySelector(
            ".edit-task"
        )
        .addEventListener(
            "click",
            function() {

                openEditTask(
                    task.id
                );

            }
        );


    // Delete

    element
        .querySelector(
            ".delete-task"
        )
        .addEventListener(
            "click",
            function() {

                deleteTask(
                    task.id
                );

            }
        );


    return element;

}


// ========================================
// TODAY'S TASKS
// ========================================

function renderTodayTasks() {

    const container =
        document.getElementById(
            "today-tasks-container"
        );

    container.innerHTML = "";

    const today =
        getTodayString();


    const todayTasks =
        tasks.filter(
            task =>
                task.dueDate ===
                today
        );


    if (
        todayTasks.length === 0
    ) {

        container.innerHTML = `
            <p class="empty-message">
                🎉 No tasks due today!
            </p>
        `;

        return;

    }


    todayTasks.forEach(
        task => {

            container.appendChild(
                createTaskElement(
                    task
                )
            );

        }
    );

}


// ========================================
// ALL TASKS
// ========================================

function renderAllTasks() {

    const container =
        document.getElementById(
            "all-tasks-container"
        );

    container.innerHTML = "";


    if (
        tasks.length === 0
    ) {

        container.innerHTML = `
            <p class="empty-message">
                No tasks yet.
            </p>
        `;

        return;

    }


    const sorted =
        [...tasks].sort(
            (a, b) =>
                new Date(
                    a.dueDate
                ) -
                new Date(
                    b.dueDate
                )
        );


    sorted.forEach(
        task => {

            container.appendChild(
                createTaskElement(
                    task
                )
            );

        }
    );

}


// ========================================
// DELETE TASK
// ========================================

function deleteTask(id) {

    if (
        !confirm(
            "Delete this task?"
        )
    ) {

        return;

    }


    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );


    saveTasks();

    updateEverything();

}


// ========================================
// UPCOMING
// ========================================

function renderUpcoming() {

    const container =
        document.getElementById(
            "upcoming-container"
        );

    container.innerHTML = "";


    const upcoming =
        [...tasks]
            .filter(
                task =>
                    !task.completed
            )
            .sort(
                (a, b) =>
                    new Date(
                        a.dueDate
                    ) -
                    new Date(
                        b.dueDate
                    )
            )
            .slice(
                0,
                5
            );


    if (
        upcoming.length === 0
    ) {

        container.innerHTML = `
            <p class="empty-message">
                🎉 Nothing coming up!
            </p>
        `;

        return;

    }


    upcoming.forEach(
        task => {

            const date =
                new Date(
                    task.dueDate +
                    "T00:00:00"
                );


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "deadline";


            element.innerHTML = `

                <div class="date">

                    <strong>
                        ${date.getDate()}
                    </strong>

                    <span>
                        ${date
                            .toLocaleDateString(
                                "en-US",
                                {
                                    month:
                                        "short"
                                }
                            )
                            .toUpperCase()}
                    </span>

                </div>


                <div>

                    <h3>
                        ${escapeHTML(
                            task.title
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            task.subject
                        )}
                    </p>


                    ${
                        task.description
                            ? `
                                <p class="deadline-description">
                                    ${escapeHTML(
                                        task.description
                                    )}
                                </p>
                            `
                            : ""
                    }

                </div>

            `;


            container.appendChild(
                element
            );

        }
    );

}


// ========================================
// STATISTICS
// ========================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const soon =
        new Date(
            today
        );


    soon.setDate(
        soon.getDate() + 3
    );


    const dueSoon =
        tasks.filter(
            task => {

                if (
                    task.completed
                ) {

                    return false;

                }


                const date =
                    new Date(
                        task.dueDate +
                        "T00:00:00"
                    );


                return (
                    date >= today &&
                    date <= soon
                );

            }
        ).length;


    document.getElementById(
        "total-tasks"
    ).textContent =
        total;


    document.getElementById(
        "completed-tasks"
    ).textContent =
        completed;


    document.getElementById(
        "due-soon"
    ).textContent =
        dueSoon;

}


// ========================================
// OVERALL PROGRESS
// ========================================

function getOverallProgress() {

    if (
        tasks.length === 0
    ) {

        return 0;

    }


    const total =
        tasks.reduce(
            (
                sum,
                task
            ) =>
                sum +
                (
                    Number(
                        task.progress
                    ) || 0
                ),
            0
        );


    return Math.round(
        total /
        tasks.length
    );

}


function updateProgress() {

    const percentage =
        getOverallProgress();


    document.getElementById(
        "dashboard-progress"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "dashboard-progress-fill"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "big-progress"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "big-progress-fill"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "progress-total"
    ).textContent =
        tasks.length;


    document.getElementById(
        "progress-completed"
    ).textContent =
        tasks.filter(
            task =>
                task.completed
        ).length;


    document.getElementById(
        "progress-remaining"
    ).textContent =
        tasks.filter(
            task =>
                !task.completed
        ).length;

}


// ========================================
// NOTIFICATION BADGE
// ========================================

function updateNotificationBadge() {

    const badge =
        document.getElementById(
            "notification-badge"
        );


    const count =
        tasks.filter(
            task =>
                task.dueDate ===
                getTodayString() &&
                !task.completed
        ).length;


    if (
        count > 0
    ) {

        badge.textContent =
            count > 99
                ? "99+"
                : count;


        badge.classList.remove(
            "hidden"
        );

    } else {

        badge.classList.add(
            "hidden"
        );

    }

}


// ========================================
// FAVICON BADGE
// ========================================

function updateFavicon() {

    const favicon =
        document.getElementById(
            "favicon"
        );


    const count =
        tasks.filter(
            task =>
                task.dueDate ===
                getTodayString() &&
                !task.completed
        ).length;


    if (
        count === 0
    ) {

        favicon.href =
            "favicon.svg";

        return;

    }


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width = 64;

    canvas.height = 64;


    const ctx =
        canvas.getContext(
            "2d"
        );


    // Background

    ctx.fillStyle =
        "#20232a";

    ctx.fillRect(
        0,
        0,
        64,
        64
    );


    // Red circle

    ctx.fillStyle =
        "#e53935";


    ctx.beginPath();


    ctx.arc(
        32,
        32,
        29,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // Number

    ctx.fillStyle =
        "white";


    ctx.font =
        "bold 30px Arial";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillText(
        count > 9
            ? "9+"
            : count,
        32,
        34
    );


    favicon.href =
        canvas.toDataURL(
            "image/png"
        );

}


// ========================================
// NOTIFICATION SOUND
// ========================================

const notificationSound =
    document.getElementById(
        "notification-sound"
    );


function playNotificationSound() {

    if (
        !notificationSound
    ) {

        return;

    }


    notificationSound.currentTime =
        0;


    notificationSound
        .play()
        .catch(
            () => {}
        );

}


// ========================================
// TASK NOTIFICATIONS
// ========================================

function checkTaskNotifications() {

    const today =
        getTodayString();


    const todayDate =
        new Date(
            today +
            "T00:00:00"
        );


    const reminders = [];


    tasks.forEach(
        task => {

            // Don't remind completed tasks

            if (
                task.completed
            ) {

                return;

            }


            if (
                !task.dueDate
            ) {

                return;

            }


            const dueDate =
                new Date(
                    task.dueDate +
                    "T00:00:00"
                );


            // Calculate days until deadline

            const difference =
                Math.round(
                    (
                        dueDate -
                        todayDate
                    ) /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                );


            // Determine reminder timing

            let reminderDays;


            if (
                task.priority ===
                "HIGH"
            ) {

                // High = 3 days before

                reminderDays = 3;

            } else if (
                task.priority ===
                "MEDIUM"
            ) {

                // Medium = 2 days before

                reminderDays = 2;

            } else {

                // Low = 1 day before

                reminderDays = 1;

            }


            // Reminder before deadline

            if (
                difference ===
                reminderDays
            ) {

                reminders.push({

                    task:
                        task,

                    type:
                        "before"

                });

            }


            // Deadline day reminder

            if (
                difference === 0
            ) {

                reminders.push({

                    task:
                        task,

                    type:
                        "today"

                });

            }

        }
    );


    if (
        reminders.length === 0
    ) {

        return;

    }


    reminders.forEach(
        reminder => {

            const task =
                reminder.task;


            let notificationKey;


            if (
                reminder.type ===
                "today"
            ) {

                notificationKey =
                    `notified-deadline-${task.id}-${today}`;

            } else {

                notificationKey =
                    `notified-reminder-${task.id}-${today}`;

            }


            // Prevent duplicate notifications

            if (
                localStorage.getItem(
                    notificationKey
                )
            ) {

                return;

            }


            let message;


            if (
                reminder.type ===
                "today"
            ) {

                message =
                    `⚠️ "${task.title}" is due today!`;

            } else {

                const days =
                    task.priority ===
                    "HIGH"
                        ? 3
                        : task.priority ===
                          "MEDIUM"
                            ? 2
                            : 1;


                message =
                    `🔔 "${task.title}" is due in ${days} day${days === 1 ? "" : "s"}!`;

            }


            playNotificationSound();


            showTaskNotification(
                [task],
                message
            );


            localStorage.setItem(
                notificationKey,
                "true"
            );

        }
    );

}


// ========================================
// SHOW TASK NOTIFICATION
// ========================================

function showTaskNotification(
    dueTasks,
    customMessage = null
) {

    const count =
        dueTasks.length;


    const message =
        customMessage ||
        (
            count === 1
                ? `Your task "${dueTasks[0].title}" is due today!`
                : `You have ${count} tasks due today!`
        );


    // Browser notification

    if (
        "Notification" in window
    ) {

        if (
            Notification.permission ===
            "granted"
        ) {

            new Notification(
                "Student Planner",
                {
                    body:
                        message
                }
            );

        }

    }


    // Website notification

    showPlannerNotification(
        message
    );

}


// ========================================
// WEBSITE NOTIFICATION
// ========================================

function showPlannerNotification(
    message
) {

    let notification =
        document.getElementById(
            "planner-notification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );


        notification.id =
            "planner-notification";


        notification.innerHTML = `

            <div class="notification-icon">
                🔔
            </div>

            <div class="notification-text">

                <strong>
                    GISING!
                </strong>

                <span></span>

            </div>

            <button>
                ×
            </button>

        `;


        document.body.appendChild(
            notification
        );


        notification
            .querySelector(
                "button"
            )
            .addEventListener(
                "click",
                function() {

                    notification.classList.remove(
                        "show"
                    );

                }
            );

    }


    notification
        .querySelector(
            ".notification-text span"
        )
        .textContent =
        message;


    notification.classList.add(
        "show"
    );


    setTimeout(
        function() {

            notification.classList.remove(
                "show"
            );

        },
        6000
    );

}


// ========================================
// ASK NOTIFICATION PERMISSION
// ========================================

function requestNotificationPermission() {

    if (
        "Notification" in window &&
        Notification.permission ===
        "default"
    ) {

        Notification.requestPermission();

    }

}


// ========================================
// CALENDAR
// ========================================

function renderCalendar() {

    const container =
        document.getElementById(
            "calendar-days"
        );


    const title =
        document.getElementById(
            "calendar-month"
        );


    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();


    title.textContent =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month:
                    "long",

                year:
                    "numeric"
            }
        );


    container.innerHTML = "";


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const days =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "calendar-day empty";


        container.appendChild(
            empty
        );

    }


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.className =
            "calendar-day";


        const monthText =
            String(
                month + 1
            ).padStart(
                2,
                "0"
            );


        const dayText =
            String(day)
                .padStart(
                    2,
                    "0"
                );


        const dateString =
            `${year}-${monthText}-${dayText}`;


        if (
            dateString ===
            getTodayString()
        ) {

            element.classList.add(
                "today"
            );

        }


        element.innerHTML = `
            <strong>${day}</strong>
        `;


        tasks
            .filter(
                task =>
                    task.dueDate ===
                    dateString
            )
            .forEach(
                task => {

                    const taskElement =
                        document.createElement(
                            "div"
                        );


                    taskElement.className =
                        "calendar-task";


                    taskElement.textContent =
                        task.title;


                    element.appendChild(
                        taskElement
                    );

                }
            );


        container.appendChild(
            element
        );

    }

}


document
    .getElementById(
        "previous-month"
    )
    .addEventListener(
        "click",
        function() {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderCalendar();

        }
    );


document
    .getElementById(
        "next-month"
    )
    .addEventListener(
        "click",
        function() {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderCalendar();

        }
    );


// ========================================
// NAVIGATION
// ========================================

const pages = {

    dashboard:
        document.getElementById(
            "dashboard-page"
        ),

    tasks:
        document.getElementById(
            "tasks-page"
        ),

    calendar:
        document.getElementById(
            "calendar-page"
        ),

    progress:
        document.getElementById(
            "progress-page"
        ),

    settings:
        document.getElementById(
            "settings-page"
        )

};


document
    .querySelectorAll(
        ".nav-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    const page =
                        button.dataset.page;


                    if (!page) {
                        return;
                    }


                    Object.values(
                        pages
                    ).forEach(
                        pageElement => {

                            pageElement.classList.add(
                                "hidden-page"
                            );

                        }
                    );


                    pages[page]
                        .classList.remove(
                            "hidden-page"
                        );


                    document
                        .querySelectorAll(
                            ".nav-button"
                        )
                        .forEach(
                            btn => {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    if (
                        page ===
                        "calendar"
                    ) {

                        renderCalendar();

                    }

                }
            );

        }
    );


// ========================================
// SETTINGS BUTTON
// ========================================

document
    .getElementById(
        "settings-button"
    )
    .addEventListener(
        "click",
        function() {

            document
                .querySelector(
                    '[data-page="settings"]'
                )
                .click();

        }
    );


// ========================================
// BELL
// ========================================

document
    .getElementById(
        "notification-button"
    )
    .addEventListener(
        "click",
        function() {

            const unfinished =
                tasks.filter(
                    task =>
                        !task.completed
                );


            if (
                unfinished.length === 0
            ) {

                alert(
                    "🎉 No unfinished tasks!"
                );

                return;

            }


            const due =
                unfinished.filter(
                    task =>
                        task.dueDate ===
                        getTodayString()
                );


            if (
                due.length > 0
            ) {

                alert(
                    `🔔 ${due.length} task(s) are due today!`
                );

            } else {

                alert(
                    `You have ${unfinished.length} unfinished task(s).`
                );

            }

        }
    );


// ========================================
// EXCEL EXPORT
// ========================================

document
    .getElementById(
        "export-excel"
    )
    .addEventListener(
        "click",
        function() {

            if (
                typeof XLSX ===
                "undefined"
            ) {

                alert(
                    "Excel library did not load."
                );

                return;

            }


            const data =
                tasks.map(
                    task => ({

                        ID:
                            task.id,

                        Task:
                            task.title,

                        Subject:
                            task.subject,

                        "Due Date":
                            task.dueDate,

                        Priority:
                            task.priority,

                        Progress:
                            task.progress,

                        Completed:
                            task.completed
                                ? "Yes"
                                : "No",

                        Notes:
                            task.notes,

                        "What to Do":
                            task.description

                    })
                );


            const worksheet =
                XLSX.utils.json_to_sheet(
                    data
                );


            const workbook =
                XLSX.utils.book_new();


            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Tasks"
            );


            XLSX.writeFile(
                workbook,
                "Student_Planner.xlsx"
            );

        }
    );


// ========================================
// EXCEL IMPORT
// ========================================

document
    .getElementById(
        "import-excel-button"
    )
    .addEventListener(
        "click",
        function() {

            document
                .getElementById(
                    "excel-file"
                )
                .click();

        }
    );


document
    .getElementById(
        "excel-file"
    )
    .addEventListener(
        "change",
        function(event) {

            const file =
                event.target.files[0];


            if (!file) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const data =
                        new Uint8Array(
                            event.target.result
                        );


                    const workbook =
                        XLSX.read(
                            data,
                            {
                                type:
                                    "array"
                            }
                        );


                    const sheet =
                        workbook.Sheets[
                            workbook.SheetNames[0]
                        ];


                    const rows =
                        XLSX.utils.sheet_to_json(
                            sheet
                        );


                    tasks =
                        rows.map(
                            row => {

                                const progress =
                                    Number(
                                        row.Progress
                                    ) || 0;


                                return {

                                    id:
                                        row.ID ||
                                        Date.now() +
                                        Math.random(),

                                    title:
                                        row.Task ||
                                        "",

                                    subject:
                                        row.Subject ||
                                        "",

                                    dueDate:
                                        row["Due Date"] ||
                                        "",

                                    priority:
                                        (
                                            row.Priority ||
                                            "LOW"
                                        ).toUpperCase(),

                                    progress:
                                        progress,

                                    completed:
                                        row.Completed ===
                                        "Yes" ||
                                        progress ===
                                        100,

                                    notes:
                                        row.Notes ||
                                        "",

                                    description:
                                        row["What to Do"] ||
                                        ""

                                };

                            }
                        );


                    saveTasks();

                    updateEverything();


                    alert(
                        "Excel imported successfully!"
                    );

                };


            reader.readAsArrayBuffer(
                file
            );

        }
    );


// ========================================
// DELETE ALL
// ========================================

document
    .getElementById(
        "clear-tasks"
    )
    .addEventListener(
        "click",
        function() {

            if (
                !confirm(
                    "Delete ALL tasks?"
                )
            ) {

                return;

            }


            tasks = [];

            saveTasks();

            updateEverything();

        }
    );


// ========================================
// HELPERS
// ========================================

function getTodayString() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


function formatDate(
    dateString
) {

    if (!dateString) {
        return "No date";
    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month:
                "short",

            day:
                "numeric"
        }
    );

}


function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;

}


// ========================================
// UPDATE EVERYTHING
// ========================================

function updateEverything() {

    renderTodayTasks();

    renderAllTasks();

    renderUpcoming();

    updateStatistics();

    updateProgress();

    updateNotificationBadge();

    updateFavicon();

    renderCalendar();

}


// ========================================
// START
// ========================================

loadTasks();

updateEverything();


// ========================================
// CHECK NOTIFICATIONS
// ========================================

// Check every 30 seconds

setInterval(
    checkTaskNotifications,
    30000
);


// Check immediately when page starts

checkTaskNotifications();


// ========================================
// REQUEST NOTIFICATION PERMISSION
// ========================================

// Ask for browser notification permission
// after the user interacts with the page

document.addEventListener(
    "click",
    function requestOnce() {

        requestNotificationPermission();

        document.removeEventListener(
            "click",
            requestOnce
        );

    }
);
