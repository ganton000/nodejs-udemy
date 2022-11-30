const text = "This a test to store in a file!";

const encoder = new TextEncoder();
const data = encoder.encode(text);

Deno.writeFile("message.txt", data)
    .then(() => {
        console.log("Wrote to file!");
    })
    .catch((err) => {
        console.log(err);
    });
