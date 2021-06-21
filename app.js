const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    deadline: "2021-11-31T08:59:22",
    body: "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non.",
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    deadline: "2021-10-22T01:59:41",
    body: "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title: "Deserunt laborum id consectetur pariatur veniam.",
  },
  {
    _id: "5d2ca9e29c8a94095c1255e0",
    completed: false,
    deadline: "2021-05-14T13:59:55",
    body: "at eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderipidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title: "Dolore veniam qui reprehenderit.",
  },
];

(function (arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  // Elements UI
  const listContainer = document.querySelector(
    ".tasks-list-section .list-group"
  );
  const form = document.forms.addTask,
    inputTitle = form.elements.title,
    inputBody = form.elements.body,
    dateTime = form.elements.datetime;
  const tabs = document.querySelector("#myTab"),
    navBtns = document.querySelectorAll(".nav-link"),
    showAllBtn = document.querySelector("#all-tab");
  const emptyMessage = document.querySelector("#text-empty");

  //Events
  renderAllTasks(objOfTasks);
  form.addEventListener("submit", onFormSubmitHandler);
  listContainer.addEventListener("click", onDeleteCopleteHandler);
  tabs.addEventListener("click", onFilterTasksHandler);

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error("Error");
      return;
    }

    const fragment = [];

    Object.values(tasksList).forEach((task) => {
      const li = listItemTemplate(task);

      fragment.push(li);
    });

    fragment.sort((a) => {
      if (!a.classList.contains("list-group-item-success")) {
        return -1;
      }
    });

    listContainer.append(...fragment);
  }

  // Rendering task DOM-element

  function listItemTemplate({ _id, title, body, completed, deadline } = {}) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    if (completed) {
      li.classList.add("list-group-item-success");
    }
    li.dataset.taskId = _id;

    const span = document.createElement("span");
    span.textContent = title;
    span.classList.add("font-weight-bold", "fs-1");

    const leftTime = document.createElement("span");
    leftTime.classList.add(
      "text-monospace",
      "border",
      "border-secondary",
      "p-1",
      "deadline"
    );

    setDeadline(li, deadline, leftTime, completed);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-danger", "delete-btn", "ml-1");
    deleteBtn.textContent = "Delete task";

    const successBtn = document.createElement("button");
    successBtn.classList.add("btn", "btn-success", "ml-auto", "success-btn");

    styleCompleteTask(li, _id, successBtn);

    const article = document.createElement("p");
    article.classList.add("mt-2", "w-100");
    article.textContent = body;

    li.append(span, article, leftTime, successBtn, deleteBtn);

    return li;
  }

  // Add new task functions

  function onFormSubmitHandler(event) {
    event.preventDefault();

    const titleValue = inputTitle.value,
      bodyValue = inputBody.value,
      dateTimeValue = dateTime.value;

    if (!titleValue || !bodyValue) {
      alert("Task empty!");
      return;
    }

    const task = createNewTask(titleValue, bodyValue, dateTimeValue);
    const listItem = listItemTemplate(task);

    listContainer.prepend(listItem);

    form.reset();
  }

  function createNewTask(title, body, dateTime) {
    const newTask = {
      title,
      body,
      completed: false,
      deadline: dateTime,
      _id: `task-${Math.random()}`,
    };

    objOfTasks[newTask._id] = newTask;

    return newTask;
  }

  // Delete Task

  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Delete task: ${title}?`);

    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];

    return isConfirm;
  }

  function deleteTaskFromHTML(confirmed, task) {
    if (!confirmed) return;
    task.remove();
  }

  // Complete task and sort

  function changeCompleteSortTask(id) {
    if (!objOfTasks[id].completed) {
      objOfTasks[id].completed = true;
    } else if (objOfTasks[id].completed) {
      objOfTasks[id].completed = false;
    }
  }

  function styleCompleteTask(task, id, btn) {
    if (objOfTasks[id].completed) {
      task.classList.add("list-group-item-success");
      task.classList.remove("list-group-item-dark");

      btn.classList.add("alert-secondary");
      btn.textContent = "Uncomplete";

      listContainer.append(task);
    } else if (!objOfTasks[id].completed) {
      task.classList.remove("list-group-item-success");

      btn.classList.remove("alert-secondary");
      btn.textContent = "Complete Task";

      listContainer.prepend(task);
    }
  }

  // Handler on delete or complete task

  function onDeleteCopleteHandler(e) {
    const task = e.target.closest("[data-task-id]");
    const id = task.dataset.taskId;
    const deadline = task.querySelector(".deadline");

    if (e.target.classList.contains("delete-btn")) {
      const confirmed = deleteTask(id);

      deleteTaskFromHTML(confirmed, task);
    } else if (e.target.classList.contains("success-btn")) {
      completeTask(task, deadline);
      changeCompleteSortTask(id);
      styleCompleteTask(task, id, e.target);
      removeCompleteTask(task);
    }
  }

  // Remove complete task on an unfinished section

  function removeCompleteTask(task) {
    if (!showAllBtn.classList.contains("active")) {
      hideTask(task);
    }
  }

  // Filter Tasks

  function onFilterTasksHandler(e) {
    const target = e.target;
    const listTasks = document.querySelectorAll(".list-group-item");

    if (target.tagName === "BUTTON" && target.dataset.bsToggle === "tab") {
      changeActiveTab(navBtns, target);
      showTasks(target, listTasks);
    }
  }

  function showTasks(target, tasks) {
    tasks.forEach((task) => {
      const id = task.dataset.taskId;
      const tabsTarget = target.dataset.bsTarget;

      if (tabsTarget === "unfinished" && objOfTasks[id].completed) {
        hideTask(task);
      } else if (tabsTarget === "all") {
        showTask(task);
      }
    });
  }

  function changeActiveTab(btns, target) {
    btns.forEach((btn) => {
      if (btn === target) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  function hideTask(task) {
    task.classList.add("d-none");
    task.classList.remove("d-flex");
  }

  function showTask(task) {
    task.classList.remove("d-none");
    task.classList.add("d-flex");
  }

  // Show message if task list is empty

  showMessageOfEmptyList();

  function showMessageOfEmptyList() {
    const listTasks = document.querySelectorAll(".list-group-item");

    if (checkHiddenTasks(listTasks)) {
      emptyMessage.classList.add("d-none");
    } else {
      emptyMessage.classList.remove("d-none");
    }
  }

  function checkHiddenTasks(tasksList) {
    let flag = false;

    tasksList.forEach((task) => {
      if (!task.classList.contains("d-none")) {
        flag = true;
      }
    });

    return flag;
  }

  // Observe task for mutations

  const config = {
    attributes: true,
    childList: true,
    subtree: true,
  };
  const mutationHandler = (mutations) => {
    showMessageOfEmptyList();
  };
  const mutationObserver = new MutationObserver(mutationHandler);
  mutationObserver.observe(listContainer, config);

  // Set deadline

  function setDeadline(task, time, deadline) {
    let countDownDate = new Date(time);

    if (countDownDate == "Invalid Date") {
      deadline.textContent = "Timeless";
      deadline.classList.add("text-muted");
      deadline.classList.remove("border");
      return;
    }

    const countDownFunction = setInterval(function () {
      let distance = getDate(countDownDate);

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      deadline.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      if (distance < 86400000) {
        deadline.classList.add("alert-warning", "border-warning");
      }

      console.log(1);

      stylingExpiredTask(distance, countDownFunction, deadline, task);

      stopIntervalCompletedTask(task, deadline, countDownFunction);
    }, 1000);
  }

  function getDate(countDownDate) {
    let now = Date.now();
    let distance = countDownDate - now;

    return distance;
  }

  function stopIntervalCompletedTask(task, deadline, funcInterval) {
    if (task.classList.contains("list-group-item-success")) {
      clearInterval(funcInterval);
      deadline.textContent = "Completed";
    }
  }

  function stylingExpiredTask(distance, timeFunc, deadline, task) {
    if (distance < 0) {
      clearInterval(timeFunc);
      deadline.textContent = "EXPIRED";
      deadline.classList.add("alert-danger", "border-danger");
      task.classList.remove("list-group-item-success");
      task.classList.add("list-group-item-dark");

      task.parentElement.append(task);

      return;
    }
  }

  function completeTask(task, deadline) {
    if (!task.classList.contains("list-group-item-success")) {
      deadline.classList.remove(
        "alert-danger",
        "border-danger",
        "alert-warning",
        "border-warning"
      );
      deadline.textContent = "Completed";
    } else if (task.classList.contains("list-group-item-success")) {
      deadline.textContent = "Timeless";
    }
  }
})(tasks);
