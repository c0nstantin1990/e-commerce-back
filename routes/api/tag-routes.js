const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// GET all tags with associated product data
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({ include: [Product] });
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a tag by its ID with associated product data
router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, { include: [Product] });
    if (!tag) {
      res.status(404).json({ message: "No tag found with this id." });
      return;
    }
    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE a new tag
router.post("/", async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE a tag by its ID
router.put("/:id", async (req, res) => {
  try {
    const [updatedRows] = await Tag.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      res.status(404).json({ message: "No tag found with this id." });
      return;
    }
    res.json({ message: "Tag updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a tag by its ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedRows = await Tag.destroy({ where: { id: req.params.id } });
    if (deletedRows === 0) {
      res.status(404).json({ message: "No tag found with this id." });
      return;
    }
    res.json({ message: "Tag deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
