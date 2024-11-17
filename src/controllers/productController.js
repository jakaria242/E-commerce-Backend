import apiResponse from "quick-response";
import { Product } from "../models/productSchema.js";
import { cloudinaryUpload } from "../services/cloudinary.js";


const productCreate = async ( req, res )=> {
  try {

   



    // const { title, slug, category, subCategory } = req.body
    // const { thumbnail } = req.file
    // if ([title, category, subCategory].some((field) => field === "")) {
    //    return res.status(400).json(apiResponse(400, "All fields are required"));
    // }
    // if (!thumbnail) {
    //     return res.status(400).json(apiResponse(400, "thumbnail is required"));
    // }
    //     // Generate slug if not provided
    //     let newSlug
    //     if (!slug) {
    //         newSlug = title.replaceAll(" ", "-").toLowerCase() + "-" + new Date.now()
    //     } else {
    //         const uniqueSlug = await Product.find({slug})
    //         if (uniqueSlug) {
    //             return res.status(400).json(apiResponse(400, "slug must be unique"));
    //         }
    //         newSlug = slug.replaceAll(" ", "-").toLowerCase() + "-" + new Date.now()
    //     }
    //     const result = await cloudinaryUpload(path, user.fullName,'productImage')
    //     const product = new Product()
    //     product.title = title
    //     product.slug = newSlug
    //     product.category = category
    //     product.subCategory = subCategory
    //     product.thumbnail.imagePath = result.optimizeUrl
    //     product.thumbnail.publicId = result.uploadResult.public_id
    //     await product.save()
    
  } catch (error) {
    console.error("product create error:", error);
     return res
      .status(500)
      .json(apiResponse(500, "product create error", { error: error.message }));
  }
}


export { productCreate }