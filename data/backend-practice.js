//https://supersimplebackend.dev/documentation

//built in class provided by js, creates a new http message/request to send to the backend
const xhr = new XMLHttpRequest();
//only runs once respond gets load
xhr.addEventListener("load", () => {
  console.log(xhr.response);
});
xhr.open("GET", "https://supersimplebackend.dev/hello"); //first parameter = what type of http message to send, second parameter = where to send http message or url(uniform recourse locator)
// GET = get some info from the backend
// types of request give to the backend = GET, POST, PUT, DELETE
xhr.send();

//status code
//starts with 4 or 5 (400, 404, 500)= failed (4 means problem was from our side, may be url path is wrong, 5 means problem was from backend)
//starts witb 2 (200, 201, 204) = succeeded
