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

// CREATE a new tag
router.post("/", async (req, res) => {
  try {
    const tag = await createTag(req.body.tag_name);
    res.status(201).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// UPDATE a tag by id
router.put("/:id", async (req, res) => {
  try {
    const updatedTag = await updateTag(req.params.id, req.body.tag_name);
    if (!updatedTag) {
      res.status(404).json({ message: "No tag found with this id" });
      return;
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE a tag by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedTag = await deleteTag(req.params.id);
    if (!deletedTag) {
      res.status(404).json({ message: "No tag found with this id" });
      return;
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
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

async function createTag(tagName) {
  return await Tag.create({
    tag_name: tagName,
  });
}

async function updateTag(id, tagName) {
  return await Tag.update(
    {
      tag_name: tagName,
    },
    {
      where: {
        id: id,
      },
    }
  );
}

async function deleteTag(id) {
  return await Tag.destroy({
    where: {
      id: id,
    },
  });
}

module.exports = router;
