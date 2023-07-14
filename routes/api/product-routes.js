const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "product_name", "price", "stock"],
      include: [
        {
          model: Category,
          attributes: ["category_name"],
        },
        {
          model: Tag,
          attributes: ["tag_name"],
          through: ProductTag,
        },
      ],
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET one product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
      attributes: ["product_name", "price", "stock"],
      include: [
        {
          model: Category,
          attributes: ["category_name"],
        },
        {
          model: Tag,
          attributes: ["tag_name"],
          through: ProductTag,
        },
      ],
    });

    if (!product) {
      res.status(404).json({ message: "No product found with this id" });
      return;
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// CREATE a new product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = req.body.tagIds.map((tagId) => ({
        product_id: product.id,
        tag_id: tagId,
      }));

      await ProductTag.bulkCreate(productTags);
    }

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// UPDATE a product by id
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const existingTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      const existingTagIds = existingTags.map(({ tag_id }) => tag_id);
      const newTags = req.body.tagIds.filter((tagId) => !existingTagIds.includes(tagId));

      const productTagsToRemove = existingTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newTags.map((tagId) => ({ product_id: req.params.id, tag_id: tagId }))),
      ]);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// DELETE a product by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({ where: { id: req.params.id } });

    if (!deletedProduct) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
