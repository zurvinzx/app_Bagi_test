const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deletUser,
  login,
} = require("./user.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/register", createUser);
router.get("/", checkToken, getUsers);
router.get("/profile/:id", checkToken, getUserById);
router.patch("/update", checkToken, updateUser);
router.delete("/", checkToken, deletUser);
router.post("/login", login);

module.exports = router;
