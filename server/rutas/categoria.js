const express = require('express')

const { verificaToken, verificaRolAdmin } = require('../midlewares/autenticacion')

let app = express()

let Categoria = require('../models/categoria')


//obtener categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categorias
        })
    })


})


//obtener categorias por id
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id
    Categoria.findById(id, (err, categoriaDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'Categoria no encontrada'
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
})



//crear categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })


    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})


//actualizar categoria
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = req.body

    let desCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })


})


//elimina una categoria
app.delete('/categoria/:id', [verificaToken, verificaRolAdmin], (req, res) => {

    let id = req.params.id

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })
    })
})

module.exports = app