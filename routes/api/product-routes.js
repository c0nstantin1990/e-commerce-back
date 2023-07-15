const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a product by its ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });
    if (!product) {
      res.status(404).json({ message: "No product found with this id." });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE a new product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      await product.addTags(req.body.tagIds);
      product.tags = await product.getTags();
    }
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE a product by its ID
router.put("/:id", async (req, res) => {
  try {
    const [updatedRows, updatedProducts] = await Product.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (updatedRows === 0) {
      res.status(404).json({ message: "No product found with this id." });
      return;
    }
    const product = updatedProducts[0];
    if (req.body.tagIds && req.body.tagIds.length) {
      await product.setTags(req.body.tagIds);
      product.tags = await product.getTags();
    } else {
      product.tags = [];
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a product by its ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedRows = await Product.destroy({ where: { id: req.params.id } });
    if (deletedRows === 0) {
      res.status(404).json({ message: "No product found with this id." });
      return;
    }
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
