const DestinationController = require("../controllers/destination");
const auth = require("../middleware/user");
const AdminAuth = require("../middleware/admin");
const checkRole = require("../middleware/checkRole");
const router = require("express").Router();

router.post('/create/:accountId', AdminAuth, checkRole(['Admin']), DestinationController.addDestination);
router.get('/:accountId', auth, DestinationController.getDestinationByAccountId);
router.put('/:id', auth, DestinationController.updateDestination);
router.delete('/deleteDestination', auth, checkRole(['Admin']), DestinationController.deleteDestination);

module.exports = router;