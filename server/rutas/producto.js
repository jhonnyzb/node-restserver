
const express = require('express')
const { verificaToken, verificaRolAdmin } = require('../midlewares/autenticacion')

let app = express()

let Producto = require('../models/producto')



//obtener productos
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0
    desde = Number(desde)

    // let limite = req.query.limite || 5
    // limite = Number(limite)

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(15)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })
})


//obtener producto por id
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Producto no encontrado'
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })


        })

})

//buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')
    
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })
})


//crear producto
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id

    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

})



//actualizar producto
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = req.body

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })

        }

        productoDB.nombre = body.nombre
        productoDB.precioUni = body.precioUni
        productoDB.categoria = body.categoria
        productoDB.disponible = body.disponible
        productoDB.descripcion = body.descripcion

        productoDB.save((err, porductoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(201).json({
                ok: true,
                producto: porductoGuardado
            })
        })



    })

})


//elimina una producto
app.delete('/productos/:id', [verificaToken, verificaRolAdmin], (req, res) => {

    let id = req.params.id


    Producto.findById(id, (err, productoDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })

        }
        productoDB.disponible = false
        productoDB.save((err, porductoEliminado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(200).json({
                ok: true,
                producto: porductoEliminado,
                message:'Producto borrado'
            })
        })

    })

})





module.exports = app

