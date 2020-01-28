const express = require('express'); // importando o express
const server = express();
server.use(express.json()); // devido ao json no REQUEST.BODY

// para termos um array inicial de listagem
const projects = [{
    id: "0",
    title: "New Project",
    tasks: []
}];

// middlewares

// verificar o ID para poder dar update / delete / criar tarefa em projetos existentes
function checkId(req, res, next) {
    const { id } = req.params;
    const project = projects.find(pj => pj.id == id);
    if (!project) {
        return res.json({ error: "Project is not found!" });
    }
    req.id = id;
    return next();
}

// marcar o tempo de resposta das requisicoes http
function requestTime(req, res, next) {
    console.time('timeRequest');
    next();
    console.timeEnd('timeRequest');
}

// requisicoes http
// criar um novo projeto
server.post('/projects', requestTime, (req, res) => {
    const { id, title } = req.body;
    projects.push({
        id,
        title,
        tasks: new Array(),
    });
    return res.json(projects);
});

// adicionar uma nova tarefa a um projeto existente
server.post('/projects/:id/tasks', requestTime, checkId, (req, res) => {
    const id = req.id;
    const { title } = req.body;
    const project = projects.find(pj => pj.id == id);
    project.tasks.push(title);
    return res.json(project);
});

// listar todos os projetos
server.get('/projects', requestTime, (req, res) => {
    return res.json(projects);
});

// alterar o titulo de algum projeto já existente
server.put('/projects/:id', requestTime, checkId, (req, res) => {
    const id = req.id;
    const { title } = req.body;
    const project = projects.find(pj => pj.id == id);

    project.title = title;

    return res.json(project);
});

// apagar algum projeto atraves de seu id
server.delete('/projects/:id', requestTime, checkId, (req, res) => {
    const id = req.id;
    const project = projects.find(pj => pj.id == id);
    projects.splice(project, 1);
    return res.json(projects);
});

// para acessarmos em http://localhost:3000
server.listen(3000);