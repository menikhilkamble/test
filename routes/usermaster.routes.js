var express = require('express');
var router = express.Router();
var usermaster = require('../controllers/usermaster.controller');
var sendResponse = require('../functions/sendResponse');

router.post("/", usermaster.create, sendResponse.sendCreateResponse);
router.get("/", usermaster.getAll, sendResponse.sendFindResponse);
router.get("/:id", usermaster.getById, sendResponse.sendFindResponse);
router.put("/:id", usermaster.update, sendResponse.sendCreateResponse);

module.exports = router;