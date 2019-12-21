


//puerto
process.env.PORT = process.env.PORT || 3000

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//Vencimiento token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30


//seed token
process.env.SEED =  process.env.SEED || 'seed-desarrollo'

//Base de datos
let urlDB;



if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
}
else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB


//Google client

process.env.CLIENT_ID = process.env.CLIENT_ID || '229925538257-4ghdliutn6gjs2s4b2on6kdscbkegjul.apps.googleusercontent.com'
