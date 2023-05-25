const pool = require("../../config/db");

module.exports = {
  create: (data, callback) => {
    // Check if email already exists in the database
    pool.query(
      "SELECT COUNT(*) AS count FROM users WHERE email = ?",
      [data.email],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        const count = results[0].count;

        if (count > 0) {
          // Email already exists, return error
          const errorMessage = "Email already exists";
          return callback(errorMessage);
        } else {
          // Email doesn't exist, proceed with user registration
          pool.query(
            "INSERT INTO users (username, email, password, phone, loc, image) VALUES (?, ?, ?, ?, ?, ?)",
            [
              data.username,
              data.email,
              data.password,
              data.phone,
              data.loc,
              data.image,
            ],
            (error, results, fields) => {
              if (error) {
                return callback(error);
              }
              return callback(null, results);
            }
          );
        }
      }
    );
  },
  getUsers: (callback) => {
    pool.query(
      "select id,username,email,phone,loc,image from users",
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getUserById: (id, callback) => {
    pool.query(
      "select id,username,email,phone,loc,image from users where id = ?",
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  updateUser: (data, callback) => {
    pool.query(
      "update users set username=?, email=?, password=?, phone=?, loc=?, image=? where id = ?",
      [
        data.username,
        data.email,
        data.password,
        data.phone,
        data.loc,
        data.image,
        data.id,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results.affectedRows);
      }
    );
  },
  deletUser: (data, callback) => {
    pool.query(
      "DELETE FROM users WHERE id = ?",
      [data.id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results.affectedRows);
      }
    );
  },
  getUserByEmail: (email, callback) => {
    pool.query(
      "select * from users where email = ?",
      [email],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
};
