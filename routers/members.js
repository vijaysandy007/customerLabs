const MemberController = require("../controllers/members");
const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/admin");

router.post("/invite/:accountId", adminAuth, MemberController.inviteMember);
router.get("/:accountId", adminAuth, MemberController.getAccountMembersByAccountId);
router.delete("/:accountId/:memberId", adminAuth, MemberController.deleteMembers);

module.exports = router;