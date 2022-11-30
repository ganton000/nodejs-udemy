import { Application } from "https://deno.land/x/oak/mod.ts";

import todosRoutes from "./routers/todos.ts";

const app = new Application();

//make middlewares async incase your other middlewars are also async
//otherwise next() will not await for other middlewares
app.use(async (ctx, next) => {
    console.log("Middleware!");
    await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 8000 });
