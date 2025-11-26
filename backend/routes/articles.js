const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const auth = require("../middleware/authMiddleware");

const {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  approveArticle,
  getTrending,
  getRelated,
} = require("../controllers/articleController");

// Public
router.get("/", getArticles);
router.get("/trending", getTrending);
router.get("/related/:id", getRelated);
router.get("/:slug", getArticle);

// Private
router.post("/", auth, upload.single("image"), createArticle);
router.put("/:id", auth, upload.single("image"), updateArticle);
router.delete("/:id", auth, deleteArticle);

// Admin
router.post("/:id/approve", auth, approveArticle);

module.exports = router;
