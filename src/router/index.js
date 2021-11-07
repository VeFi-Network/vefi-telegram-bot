const { Router } = require("express");
const API = require("../api");

const router = Router();

router.post("/addCandidates", API.addEligibleCandidates);

module.exports = router;
