const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const database = require('./database/db.js');
const Vehicle = require('./models/vehicle.js');

const app = express();


// Sincronização com o banco de dados
(async () => {
    try {
        const result = await database.sync();
        console.log(result);
    } catch (error) {
        console.log(error);
    }
})();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

//
// Rotas
//

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

app.get('/api/vehicles', (request, response) => {
    Vehicle.findAll().then((vehicles) => {
        response.json(vehicles);
    });
});

app.get('/api/vehicles/:id', (request, response) => {
    let id = request.params.id;

    Vehicle.findByPk(id).then((vehicle) => {
        if (vehicle) {
            response.json(vehicle);
        } else {
            response.status(404).send(); 
        }

    });
});

app.post('/api/vehicles', (request, response) => {
    Vehicle.create({
        model: request.body.model,
        brand: request.body.brand,
        type: request.body.type,
        availability: request.body.availability
    }).then((vehicle) => {
        response.json(vehicle);
    });
});

app.delete('/api/vehicles/:id', (request, response) => {
    let id = request.params.id;

    Vehicle.findByPk(id).then((vehicle) => {
        if (vehicle) {
            vehicle.destroy().then( () => {
                response.status(204).send();
            })
        } else {
            response.status(404).send(); 
        }

    });
});

app.put('/api/vehicles/:id', (request, response) => {
    const id = request.params.id;
    const { model, brand, type, availability} = request.body;

    Vehicle.findByPk(id).then( (vehicle) => {
        if (vehicle) {
            vehicle.update({model, brand, type, availability}).then( () => {
                response.status(204).send();
            })
        } else {
            response.status(404).send(); 
        }
        
    })
})

//
// Definição da porta utilizada pelo servidor
//

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
});