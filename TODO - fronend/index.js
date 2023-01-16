"use strict";

let todoList = null;
load();

const addButton = document.getElementById("add");
const input = document.getElementById("inp");
addButton.addEventListener("click", add);

async function edit(id) {
    try {
        const resp = await fetch("http://localhost:19297/todos/get");
        todoList = await resp.json();
        
        const controls = document.querySelector(".controls");

        const applyBnt = document.querySelectorAll(".btn-apply");

        if (applyBnt !== null) {
            for (let i = 0; i < applyBnt.length; i++) {
                applyBnt[i].remove();
            }
        }
        const todoApplyBtn = document.createElement("button");
        todoApplyBtn.classList.add("btn-apply");
        todoApplyBtn.textContent = "apply";

        controls.append(todoApplyBtn);
        addButton.classList.add("disabled");

        todoApplyBtn.addEventListener("click", () => {editText(id, controls)} )
    } catch (er) {
        console.log(er);
        alert(er.message);
    }
}

function editText(id, controls) {
    try {
        fetch("http://localhost:19297/todos/edit?id=" + id + "&text=" + input.value);
        controls.removeChild(controls.lastChild);
        addButton.classList.remove("disabled");
        input.value = "";
        load();
    } catch (er) {
        console.log(er);
        alert(er.message);
    }
}

async function completed(id, state) {
    try {
        await fetch("http://localhost:19297/todos/edit?id=" + id + "&completed=" + state);
    } catch (er) {
        console.log(er);
        alert(er.message);
    }
}

async function add() {
    try {
        await fetch("http://localhost:19297/todos/add?text=" + input.value);
        input.value = "";
        load();
    } catch (er) {
        console.log(er);
        alert(er.message);
    }
}

async function removeBnt(id) {
    try {
        await fetch("http://localhost:19297/todos/remove?id=" + id);
        load();
    } catch (er) {
        console.log(er);
        alert(er.message);
    }
}


async function load() {
    try {
        const resp = await fetch("http://localhost:19297/todos/get");
        todoList = await resp.json();
        showTodos(todoList);
        console.log(todoList);
    } catch (er) {
        console.log(er);
        alert(er.message);
    }
}

function showTodos(todoList) {
    const containerEL = document.querySelector(".container");
    containerEL.innerHTML = "";
    for (const todo of todoList) {
        const todoEl = createTodoEl(todo);
        containerEL.append(todoEl);
    }
    reQuerySelector();
}

function reQuerySelector()
{
    const removeBtns = document.querySelectorAll(".btn-remove");

    for (const el of removeBtns) {
        el.addEventListener("click", () => {
            removeBnt(el.parentElement.parentElement.classList[1]);
        });
    }

    const editBtns = document.querySelectorAll(".btn-edit");

    for (const el of editBtns) {
        el.addEventListener("click", () => {
            edit(el.parentElement.parentElement.classList[1]);
        });
    }

    const inpBox = document.querySelectorAll(".todo-checkbox");

    for (const el of inpBox) {
        el.addEventListener("click", () => {
            if (el.checked)
            {
                completed(el.parentElement.parentElement.classList[1], "true");
            } else {
                completed(el.parentElement.parentElement.classList[1], "false");
            }
        });
    }
}

function createTodoEl(todo) {
    const todoCheckBoxEl = document.createElement("input");
    todoCheckBoxEl.type = "checkbox";
    todoCheckBoxEl.checked = todo.completed;
    todoCheckBoxEl.classList.add("todo-checkbox");

    const todoTextEl = document.createElement("div");
    todoTextEl.textContent = todo.text;
    todoTextEl.classList.add("todo-text");

    const todoButtonEl = document.createElement("button");
    todoButtonEl.classList.add("btn-remove");
    todoButtonEl.textContent = "🗑";

    const todoEditEl = document.createElement("button");
    todoEditEl.classList.add("btn-edit");
    todoEditEl.textContent = "✎";

    const todoLabelEl = document.createElement("label");
    todoLabelEl.classList.add("todo-label");
    todoLabelEl.append(todoCheckBoxEl);
    todoLabelEl.append(todoTextEl);
    todoLabelEl.append(todoButtonEl);
    todoLabelEl.append(todoEditEl);

    const todoEl = document.createElement("div");
    todoEl.classList.add("todo");
    todoEl.classList.add(todo.id);
    todoEl.append(todoLabelEl);
    return todoEl;
}