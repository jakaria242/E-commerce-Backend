import apiResponse from 'quick-response'
import { Product } from '../models/productSchema.js'
import { cloudinaryUpload } from '../services/cloudinary.js'



// @desc create a product
// route POST /api/v1/product/create
const productCreate = async (req, res) => {
  try {
    const { title, slug, category, subCategory } = req.body
    const { thumbnail } = req.files
    if ([title, category, subCategory].some((field) => field === '')) {
      return res.status(400).json(apiResponse(400, 'All fields are required'))
    }
    if (!thumbnail || thumbnail.length === 0) {
      return res.status(400).json(apiResponse(400, 'thumbnail is required'))
    }
    // Generate slug if not provided
    let newSlug
    if (!slug) {
      newSlug = title.replaceAll(' ', '-').toLowerCase() + '-' + Date.now()
    } else {
      const uniqueSlug = await Product.find({ slug })
      if (uniqueSlug) {
        return res.status(400).json(apiResponse(400, 'slug must be unique'))
      }
      newSlug = slug.replaceAll(' ', '-').toLowerCase() + '-' + Date.now()
    }
    const { path } = thumbnail[0]
    const result = await cloudinaryUpload(path, slug, 'productThumbnail')
    const product = new Product()

    // upload gallery images
    if (req.files?.gallery) {
      let publicId
      const { gallery } = req.files

      for (let image of gallery) {
        // Ensure the correct property is used
        if (!image.path) {
          console.error('Image path is undefined')
          continue // Skip if the path is invalid
        }

        publicId = `${image.fieldname}-${Math.round(Math.random() * 1e9)}`
        // Pass the correct path property to cloudinaryUpload
        const uploadedGalleryImage = await cloudinaryUpload(
          image.path, // Ensure this is correct
          publicId,
          'productGallery'
        )

        // Add the uploaded image details to the product gallery
        product.gallery.push({
          imagePath: uploadedGalleryImage.optimizeUrl,
          publicId: publicId,
        })
      }
    }

    product.title = title
    product.slug = newSlug
    product.category = category
    product.subCategory = subCategory
    product.thumbnail.imagePath = result.optimizeUrl
    product.thumbnail.publicId = result.uploadResult.public_id
    await product.save()
    return res.json(
      apiResponse(200, 'product created successfull', { product })
    )
  } catch (error) {
    console.error('product create error:', error)
    return res
      .status(500)
      .json(apiResponse(500, 'product create error', { error: error.message }))
  }
}

export { productCreate }
