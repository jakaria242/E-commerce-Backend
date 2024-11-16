import apiResponse from 'quick-response';
import { Category } from '../models/categorySchema.js';


// @desc create a category
// route POST /api/v1/categorise/create
const categoryCreate = async (req, res) => {
  try {
    let newSlug
    const { name, slug, description } = req.body;
    if (!name) {
      return res.status(400).json(apiResponse(400, "Name is required"));
    }

    // Generate slug if not provided
    if (!slug) {
        newSlug = name.replace(" ", "-").toLowerCase();
    } else {
        newSlug = slug.replace(" ", "-").toLowerCase();
    }

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json(apiResponse(400, "Category name already exists"));
    }

    // Create category in the database
    const category = await Category.create({ name, slug:newSlug, description });

    return res
      .status(201)
      .json(apiResponse(201, "Category created successfully", { category }));
  } catch (error) {
    console.error("Category creating error:", error);
    return res
      .status(500)
      .json(apiResponse(500, "Category creating error", { error: error.message }));
  }
};

export { categoryCreate };





// nicher taw hobe just some condition pattern change =================================================================

// import apiResponse from 'quick-response';
// import { Category } from '../models/categorySchema.js';

// @desc create a user
// route POST /api/v1/categorise/create
// const categoryCreate = async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     let { slug } = req.body;

//     if (!name) {
//       return res.status(400).json(apiResponse(400, "Name is required"));
//     }

//     // Generate slug if not provided
//     if (!slug) {
//       slug = name.replace(/\s+/g, "-").toLowerCase();
//     }

//     // Check if the category already exists
//     const existingCategory = await Category.findOne({ name });
//     if (existingCategory) {
//       return res
//         .status(400)
//         .json(apiResponse(400, "Category name already exists"));
//     }

//     // Create category in the database
//     const category = await Category.create({ name, slug, description });

//     return res
//       .status(201)
//       .json(apiResponse(201, "Category created successfully", { category }));
//   } catch (error) {
//     console.error("Category creating error:", error);
//     return res
//       .status(500)
//       .json(apiResponse(500, "Category creating error", { error: error.message }));
//   }
// };

// export { categoryCreate };


// nicher taw hobe just some condition pattern change =================================================================
