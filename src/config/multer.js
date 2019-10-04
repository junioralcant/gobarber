const multer = require("multer");
const crypto = require("crypto");
const { extname } = require("path");
const { resolve } = require("path");

module.exports = {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "tmp", "uploads"),
    filename: (req, file, cd) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cd(err);

        return cd(null, res.toString("hex") + extname(file.originalname));
      });
    }
  })
};
