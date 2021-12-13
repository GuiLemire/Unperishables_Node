var express = require('express');
const router = express.Router();
const axios = require("axios").default;

// Get all perishables
router.get('/', async (req, res) => {
  const allPerishables = await getPerishables(req)
  res.render('perishables/perishablesList', { allPerishables: allPerishables.data, name: req.query.name });
})

// Edit a perishable
router.get('/edit/:id', getPerishable, (req, res) => {
  res.render('perishables/edit', { perishable: res.perishable.data });
})

// Save the changes to a perishable
router.post('/update', updatePerishable, (req, res) => {
  res.redirect('/perishable')
})

// Create a perishable (form)
router.get('/new', async (req, res) => {
  res.render('perishables/new'); 
})

// Create a perishable 
router.post('/create', createPerishable, (req, res) => {
  res.redirect('/perishable')
})

// Delete a perishable
router.get('/delete/:id', deletePerishable, (req, res) => {
  res.redirect('/perishable')
})


// Other functions
async function getPerishables(req) {
  const allPerishables = await axios({
    url: "http://localhost:3005/perishables",
    method: "get",
    data: {
      name: req.query.name
    }
  })
  return allPerishables
}

async function getPerishable(req, res, next) {
  const perishable = await axios({
    url: "http://localhost:3005/perishables/" + req.params.id, 
    method: "get"
  })
  res.perishable = perishable
  next()
}

async function updatePerishable(req, res, next) {
  const perishable = await axios({
    url: "http://localhost:3005/perishables/" + req.body._id,
    method: "patch",
    data: {
      name: req.body.name,
      bestBeforeDate: req.body.bestBeforeDate,
      boughtDate: req.body.boughtDate
    }
  })
  res.perishable = perishable
  next()
}

async function createPerishable(req, res, next) {
  const perishable = await axios({
    url: "http://localhost:3005/perishables/",
    method: "post",
    data: {
      name: req.body.name,
      bestBeforeDate: req.body.bestBeforeDate,
      boughtDate: req.body.boughtDate
    }
  })
  res.perishable = perishable
  next()
}

async function deletePerishable(req, res, next) {
  const perishable = await axios({
    url: "http://localhost:3005/perishables/" + req.params.id,
    method: "delete"
  })
  res.perishable = perishable
  next()
}



module.exports = router;
