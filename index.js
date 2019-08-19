const express = require("express");
const server = express();

server.use(express.json());

let numberOfRequests = 0;
const arrProject = [];

server.use((req, res, next) => {
  numberOfRequests += 1;
  console.log(`Request Count(${numberOfRequests})`);
  next();
});
/**
 * Crie um middleware que será utilizado em todas rotas que recebem o
 * ID do projeto nos parâmetros da URL que verifica se o projeto com
 * aquele ID existe. Se não existir retorne um erro,
 * caso contrário permita a requisição continuar normalmente;
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function checkProjectExits(req, res, next) {
  const { id } = req.params;
  const project = arrProject.find(obj => obj.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(arrProject);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  arrProject.push({ id: id, title: title, tasks: [] });
  return res.json(arrProject);
});

server.put("/projects/:id", checkProjectExits, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = arrProject.find(obj => obj.id == id);
  project.title = title;
  return res.json(arrProject);
});

server.delete("/projects/:id", checkProjectExits, (req, res) => {
  const { id } = req.params;
  const prjIndex = arrProject.findIndex(obj => obj.id == id);
  arrProject.splice(prjIndex, 1);
  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExits, (req, res) => {
  const { id } = req.params;
  const { taskTitle } = req.body;

  const project = arrProject.find(obj => obj.id == id);
  project.tasks.push(taskTitle);
  return res.json(arrProject);
});

server.listen("3000");
