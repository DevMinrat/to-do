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
  const emptyMessage = document.querySelector(".text-muted");
  const AlldBtn = document.querySelector("#all-tab"),
    uncompletedBtn = document.querySelector("#uncompleted-tab");

  //Events
  renderAllTasks(objOfTasks);
  form.addEventListener("submit", onFormSubmitHandler);
  listContainer.addEventListener("click", onDeleteCopleteHandler);
  checkTasks(objOfTasks);
  uncompletedBtn.addEventListener("click", showUncompletedTasks);
  AlldBtn.addEventListener("click", showAllTasks);

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error("Error");
      return;
    }

    const fragment = [];
    // const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach((task) => {
      const li = listItemTemplate(task);
      fragment.push(li);
    });

    listContainer.append(...fragment);
  }

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
    successBtn.textContent = "Complete task";

    const article = document.createElement("p");
    article.classList.add("mt-2", "w-100");
    article.textContent = body;

    li.append(span, article, successBtn, deleteBtn);

    return li;
  }

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

    checkTasks(objOfTasks);

    return newTask;
  }

  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Delete task: ${title}?`);

    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];

    checkTasks(objOfTasks);

    return isConfirm;
  }

  function deleteTaskFromHTML(confirmed, el) {
    if (!confirmed) return;
    el.remove();
  }

  function completeTaskFromHTML(par, id) {
    objOfTasks[id].completed = true;

    par.classList.add("list-group-item-success");
  }

  function onDeleteCopleteHandler(e) {
    const parent = e.target.closest("[data-task-id]");
    const id = parent.dataset.taskId;

    if (e.target.classList.contains("delete-btn")) {
      const confirmed = deleteTask(id);

      deleteTaskFromHTML(confirmed, parent);
    } else if (e.target.classList.contains("success-btn")) {
      completeTaskFromHTML(parent, id);
    }
  }

  function checkTasks(obj) {
    if (Object.keys(obj).length === 0) {
      showMessageOfNullTasks();
    } else {
      hideMessageOfNullTasks();
    }
  }

  function showMessageOfNullTasks() {
    emptyMessage.style.display = "block";
  }

  function hideMessageOfNullTasks() {
    emptyMessage.style.display = "none";
  }

  const allLi = document.querySelectorAll(".list-group-item");

  function showUncompletedTasks() {
    allLi.forEach((li) => {
      if (li.classList.contains("list-group-item-success")) {
        li.classList.add("d-none");
        li.classList.remove("d-flex");
      }
    });
  }

  function showAllTasks() {
    allLi.forEach((li) => {
      li.classList.remove("d-none");
      li.classList.add("d-flex");
    });
  }
})(tasks);
