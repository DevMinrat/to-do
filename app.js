const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    body: "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n",
    title: "Eu ea incididunt sunt consectetur fugiat non.",
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    body: "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n",
    title: "Deserunt laborum id consectetur pariatur veniam.",
  },
  {
    _id: "5d2ca9e29c8a94095c1255e0",
    completed: true,
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
    inputBody = form.elements.body;
  // const emptyMessage = document.querySelector(".text-muted");
  const tabs = document.querySelector("#myTab"),
    navBtns = document.querySelectorAll(".nav-link"),
    showAllBtn = document.querySelector("#all-tab");

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

  function listItemTemplate({ _id, title, body, completed } = {}) {
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

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-danger", "delete-btn");
    deleteBtn.textContent = "Delete task";

    const successBtn = document.createElement("button");
    successBtn.classList.add(
      "btn",
      "btn-success",
      "ml-auto",
      "success-btn",
      "mr-1"
    );

    styleCompleteTask(li, _id, successBtn);

    const article = document.createElement("p");
    article.classList.add("mt-2", "w-100");
    article.textContent = body;

    li.append(span, article, successBtn, deleteBtn);

    return li;
  }

  // Add new task functions

  function onFormSubmitHandler(event) {
    event.preventDefault();

    const titleValue = inputTitle.value,
      bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Task empty!");
      return;
    }

    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);

    listContainer.prepend(listItem);

    form.reset();
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
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
    const parent = e.target.closest("[data-task-id]");
    const id = parent.dataset.taskId;

    if (e.target.classList.contains("delete-btn")) {
      const confirmed = deleteTask(id);

      deleteTaskFromHTML(confirmed, parent);
    } else if (e.target.classList.contains("success-btn")) {
      changeCompleteSortTask(id);
      styleCompleteTask(parent, id, e.target);
      removeCompleteTask(parent);
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
})(tasks);
