const express = require('express')
const router = express.Router()
const Perishable = require('../models/perishable')

// Get all
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.body.name != null && req.body.name.trim() !== "") {
        searchOptions.name = new RegExp(req.body.name.trim(), "i")
    }
    try {
        const perishables = await Perishable.find(searchOptions).sort({ bestBeforeDate: 1 })
        res.json(perishables)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Create one
router.post('/', async (req, res) => {
    const perishable = new Perishable({
        name: req.body.name,
        bestBeforeDate: req.body.bestBeforeDate,
        boughtDate: req.body.boughtDate
    })
    try {
        const newPerishable = await perishable.save()
        res.status(201).json(newPerishable)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Get one by id, update one by id, delete one by id
router.route('/:id').get(getPerishable, (req, res) => {
    res.json(res.perishable)
}).patch(getPerishable, async (req, res) => {
    if (req.body.name != null) {
        res.perishable.name = req.body.name
    }
    if (req.body.bestBeforeDate != null) {
        res.perishable.bestBeforeDate = req.body.bestBeforeDate
    }
    if (req.body.boughtDate != null) {
        res.perishable.boughtDate = req.body.boughtDate
    }
    try {
        const updatedPerishable = await res.perishable.save()
        res.json(updatedPerishable)
    } catch {
        res.status(400).json({ message: err.message })
    }
}).delete(getPerishable, async (req, res) => {
    try {
        await res.perishable.remove()
        res.json({ message: 'Deleted this perishable', perishable: res.perishable })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getPerishable(req, res, next) {
    try {
        perishable = await Perishable.findById(req.params.id)
        if (perishable == null) {
            return res.status(404).json({ message: "Can't find perishable" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.perishable = perishable
    next()
}

module.exports = router