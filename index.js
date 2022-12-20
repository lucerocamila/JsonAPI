const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const {json} = require('express');

const app = express();

app.use(express.json());

const jsonPath = path.resolve('./file/task.js'); //ruta del JSON

app.get('/tasks', async (req, res) => {

    //obtener el json
    const jsonFile = await fs.readFile(jsonPath, 'utf-8');

    //enviar la respuesta
    res.send(jsonFile);
    
})

app.post('/tasks', async (req, res) => {

    // en un post nos envian la informacion dentro del body de la peticion, usaremos un middlaware incorporado
    const tasks = req.body;

    //obtener el json
    const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

    //generar un nuevo id
    const lastIndex = taskArray.length - 1;
    const newId = taskArray[lastIndex].id + 1;

    //agregar al usuario en el arreglo
    taskArray.push({...tasks, id: newId});

    //escribir la informacion en el json
    await fs.writeFile(jsonPath, JSON.stringify(taskArray));
    res.end();
});

app.put('/tasks', async (req, res) => {

    //obtener el json
    const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const {id, title, description, status} = req.body;

    //buscar el id del usuario dentro del arreglo
    const taskIndex = taskArray.findIndex(user => user.id === id);

    if(taskIndex >= 0) {
        taskArray[taskIndex].status = status;
    }
    await fs.writeFile(jsonPath, JSON.stringify(taskArray));
    res.send('Usuario actualizado');
});

app.delete('/tasks', async (req, res) => {

    //obtener el arreglo
    const taskArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

    //encontrar el usuario que se quiere eliminar (id)
    const {id} = req.body;
    const taskIndex = taskArray.findIndex(user => user.id === id);

    //eliminar el arreglo
    taskArray.splice(taskIndex, 1);

    // se escribe en el json nuevamente
    await fs.writeFile(jsonPath, JSON.stringify(taskArray));

    res.send(`Se eliminó el ID #${id}`);

});

const PORT = 2610;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});