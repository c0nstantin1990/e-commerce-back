const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

// GET all tags
router.get("/", async (req, res) => {
  try {
    const tags = await getAllTags();
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET one tag by id
router.get("/:id", async (req, res) => {
  try {
    const tag = await getTagById(req.params.id);
    if (!tag) {
      res.status(404).json({ message: "No tag found with this id" });
      return;
    }
    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/", (req, res) => {
  // create a new tag
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
});

// Helper functions

async function getAllTags() {
  return await Tag.findAll({
    attributes: ["id", "tag_name"],
    include: [
      {
        model: Product,
        attributes: ["id", "product_name"],
      },
    ],
  });
}

async function getTagById(id) {
  return await Tag.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Product,
        attributes: ["product_name", "price", "stock"],
      },
    ],
  });
}

module.exports = router;
