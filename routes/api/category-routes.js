const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "category_name"],
      include: [
        {
          model: Product,
          attributes: ["id", "product_name", "price"],
        },
      ],
    });

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET one category by id
router.get("/:id", async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      res.status(404).json({ message: "No category found with this id" });
      return;
    }
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// CREATE a new category
router.post("/", async (req, res) => {
  try {
    const category = await createCategory(req.body.category_name);
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// UPDATE a category by id
router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await updateCategory(
      req.params.id,
      req.body.category_name
    );
    if (!updatedCategory) {
      res.status(404).json({ message: "No category found with this id" });
      return;
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE a category by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await deleteCategory(req.params.id);
    if (!deletedCategory) {
      res.status(404).json({ message: "No category found with this id" });
      return;
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
