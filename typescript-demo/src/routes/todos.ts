import { Router } from "express";

import { Todo } from "../models/todo";

const router = Router();

//type aliases
type RequestBody = { text: string };
type RequestParams = { todoId: string };

const todos: Todo[] = [];

router.get("/", (req, res, next) => {
    res.status(200).json({ todos: todos });
});

router.post("/todo", (req, res, next) => {
    const body = req.body as RequestBody;
    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: body.text,
    };

    todos.push(newTodo);
    res.status(201).json({
        message: "Added Todo",
        todo: newTodo,
        todos: todos,
    });
});

router.put("/todo/:todoId", (req, res, next) => {
    const params = req.params as RequestParams;
    const tid = params.todoId;
    const body = req.body as RequestBody;

    const todoIndex = todos.findIndex((todoItem) => {
        todoItem.id === tid;
    });
    if (todoIndex >= 0) {
        todos[todoIndex] = {
            id: todos[todoIndex].id,
            text: body.text,
        };

        return res.status(200).json({
            message: "Updated todo",
            todos: todos,
        });
    }
    res.status(404).json({ message: "Could not find todo for this id." });
});

router.delete("/todo/:todoId", (req, res, next) => {
    const params = req.params as RequestParams;
    const tid = params.todoId;
    todos.filter((todoItem) => todoItem.id !== tid);

    res.status(200).json({
        message: "Deleted todo",
        todos: todos,
    });
});

export default router;
