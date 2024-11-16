import apiResponse from 'quick-response';
import { SubCategory } from '../models/subCategorySchema.js';


// @desc create a subcategory
// route POST /api/v1/categorise/create
const subCategoryCreate = async (req, res) => {
  try {
    let newSlug
    const { name, slug, description, category } = req.body;
    if (!(name && category)) {
      return res.status(400).json(apiResponse(400, "Name and Category are required"));
    }

    // Generate slug if not provided
    if (!slug) {
        newSlug = name.replace(" ", "-").toLowerCase();
    } else {
        newSlug = slug.replace(" ", "-").toLowerCase();
    }

    // Check if the subCategory already exists
    const existingSubCategory = await SubCategory.findOne({ name });
    if (existingSubCategory) {
      return res
        .status(400)
        .json(apiResponse(400, "SubCategory name already exists"));
    }

    // Create subcategory in the database
    const subCategory = await SubCategory.create({ name, slug:newSlug, description, category});

    return res
      .status(201)
      .json(apiResponse(201, "SubCategory created successfully", { subCategory }));
  } catch (error) {
    console.error("SubCategory creating error:", error);
    return res
      .status(500)
      .json(apiResponse(500, "SubCategory creating error", { error: error.message }));
  }
};

export { subCategoryCreate };


