require('./config/config')
const express = require('express')
const mongoose = require('mongoose');
const path = require('path')
const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//habilitar carpeta publica
app.use(express.static(path.resolve(__dirname, '../public')))

//global rutas
app.use(require('./rutas/index'))



mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, 'useFindAndModify': false }, (err, res) => {
    if (err) throw err
    console.log('Base de datos online');
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
})