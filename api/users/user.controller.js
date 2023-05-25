const {
  create,
  getUsers,
  getUserById,
  updateUser,
  deletUser,
  getUserByEmail,
} = require("./user.service");

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    create(body, (err, results) => {
      if (err) {
        if (err === "Email already exists") {
          return res.status(400).json({
            success: 0,
            message: "Email already exists",
          });
        }
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getUserById: (req, res) => {
    const id = req.params.id;
    getUserById(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          succes: 0,
          message: "Record not found",
        });
      }
      return res.json({
        succes: 1,
        data: results,
      });
    });
  },
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        succes: 1,
        data: results,
      });
    });
  },
  updateUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    updateUser(body, (err, affectedRows) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: "Failed to update user",
        });
      }
      if (affectedRows > 0) {
        return res.json({
          success: 1,
          message: "User updated successfully",
        });
      } else {
        return res.json({
          success: 0,
          message: "No user updated",
        });
      }
    });
  },
  deletUser: (req, res) => {
    const data = req.body;
    deletUser(data, (err, affectedRows) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: "Failed to delete user",
        });
      }
      if (affectedRows === 0) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
      }
      return res.json({
        success: 1,
        message: "User deleted successfully",
      });
    });
  },
  login: (req, res) => {
    const body = req.body;
    getUserByEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          succes: 0,
          data: "invalid email or password",
        });
      }
      const result = compareSync(body.password, results.password);
      if (results) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, "qwe1234", {
          expiresIn: "1h",
        });
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken,
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    });
  },
};
