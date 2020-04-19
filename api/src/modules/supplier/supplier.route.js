const Controller = require('./product.controller');

const { Router } = require('express');
const router = new Router();

router.get('/', Controller.list);
router.post('/', Controller.insert);

router.put('/:id', Controller.update);

module.exports = router;