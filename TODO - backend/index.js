const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

//req < request, res < responce
const todoList = [
    {
        id: 1,
        text: "помыть пол",
        completed: true,
    },
    {
        id: 2,
        text: "подать резюме в майкрософт",
        completed: false,
    }
];

let nextId = getMaxId() + 1;

function getMaxId() {
    let res = 0;
    for (let el of todoList) {
        if (el.id > res) {
            res = el.id;
        }
    }
    return res
}

app.get("/todos/get", (req, res) => {
    res.json(todoList);
});

//localhost:19297/todos/add?text=make new project
app.get("/todos/add", (req, res) => {
    const text = req.query.text;
    todoList.push({
        id: nextId,
        text: text,
        completed: false,
    });
    nextId++;
    res.json({
        success: true,
    });
});

//localhost:19297/todos/edit?id=5&text=NweTast&completed=false
app.get("/todos/edit", (req, res) => {
    const id = +req.query.id;
    const text = req.query.text;
    const completed = req.query.completed;
    const found = todoList.find(x => x.id === id);
    if (!found) {
        res.json({
            error: "задача с id не найдена"
        })
        return;
    }
    if (text !== undefined) {
        found.text = text;
    }
    if (completed !== undefined) {
        found.completed = completed === "true";
    }
    res.json({
        success: true
    })
});

app.get("/todos/remove", (req, res) => {
    const id = +req.query.id;
    const foundIndex = todoList.findIndex(x => x.id === id);
    if (foundIndex < 0) {
        res.json({
            error: "не найден элемент с данным id",
        });
        return;
    }
    todoList.splice(foundIndex, 1);
    res.json({
        success: true,
    });
});

app.listen(19297, () => {
    console.log("сервер успешно запущен на порту 19297");
});