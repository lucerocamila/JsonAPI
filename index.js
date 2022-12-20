const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const {json} = require('express');

const app = express();

app.use(express.json());

const jsonPath = path.resolve('./file/task.js'); //ruta del JSON

app.get('/tasks', async (req, res) => {

    const jsonFile = await fs.readFile(jsonPath, 'utf-8');

    res.send(jsonFile);
    
})

app.post('/tasks', async (req, res) => {

    const tasks = req.body;

    const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

    const lastIndex = taskArray.length - 1;
    const newId = taskArray[lastIndex].id + 1;

    taskArray.push({...tasks, id: newId});

    await fs.writeFile(jsonPath, JSON.stringify(taskArray));
    res.end();
});

app.put('/tasks', async (req, res) => {

    const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const {id, title, description, status} = req.body;

    const taskIndex = taskArray.findIndex(user => user.id === id);

    if(taskIndex >= 0) {
        taskArray[taskIndex].status = status;
    }
    await fs.writeFile(jsonPath, JSON.stringify(taskArray));
    res.send('Usuario actualizado');
});

app.delete('/tasks', async (req, res) => {

    const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

    const {id} = req.body;
    const taskIndex = taskArray.findIndex(user => user.id === id);

    taskArray.splice(taskIndex, 1);

    await fs.writeFile(jsonPath, JSON.stringify(taskArray));

    res.send(`Se eliminó el ID #${id}`);

});

const PORT = 2610;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});