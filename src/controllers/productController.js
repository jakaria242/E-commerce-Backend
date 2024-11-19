import apiResponse from 'quick-response'
import { Product } from '../models/productSchema.js'
import { cloudinaryUpload } from '../services/cloudinary.js'
import { Inventory } from '../models/inventorySchema.js'
import { Category } from '../models/categorySchema.js'
import { SubCategory } from '../models/subCategorySchema.js'

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

// @desc Delet a product
// route POST /api/v1/product/delete
const productDelete = async (req, res) => {
  try {
    const { id } = req.params
    // find the product by ID and ensure it exists
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json(apiResponse(404, 'Product not found'))
    }

    // delete the inventory associated with this product
    await Inventory.deleteMany({ product: id })

    // delete the product
    await Product.findByIdAndDelete({ _id: id })
  
    return res.json(apiResponse(200, 'product deleted successfull'))

  } catch (error) {
    console.log('Product delete error', error)
    return res
      .status(500)
      .json(apiResponse(500, 'product delete error', { error: error.message }))
  }
}


 const pagination = async (req, res) => {
    try {

      const { page, limit, category, subCategory } = req.query

      const filter = {}

      if (category) {
        const categoryDoc = await Category.findOne({ name: category})
        if (categoryDoc){
          filter.category = categoryDoc._id  // Use the objectId  for filtering
        }
      }

      if (subCategory) {
        const subCategoryDoc = await SubCategory.findOne({ name: subCategory})
        if (subCategoryDoc){
          filter.subCategory = subCategoryDoc._id  // Use the objectId  for filtering
        }
      }
        const productFilter = await Product.findOne(filter).populate({ path: "category", select: "name"}).populate({ path: "subCategory", select: "name"})

    return res.json(apiResponse(200, 'product filtering successfull', {productFilter}))


      // let currentPage = 1
      // if (page < 1) {
        
      //  const baseLimit = limit || 2;
      //  const skip = Number((currentPage - 1) * baseLimit)
 
      //  const products = await Product.find().skip(skip).limit(baseLimit)
 
      //  const totalProducts = await Product.countDocuments()

      //  const totalPages = Math.ceil(totalProducts / baseLimit)

      //  return res.json(apiResponse(200, 'products fetched successfully', { products, totalProducts, totalPages, currentPage, baseLimit }))
      // } else{

      //   currentPage = Number(page || 1);
      //   const baseLimit = limit || 2;
      //   const skip = Number((currentPage - 1) * baseLimit)
  
      //   const products = await Product.find().skip(skip).limit(baseLimit)
  
      //   const totalProducts = await Product.countDocuments()
      //   const totalPages = Math.ceil(totalProducts / baseLimit)

      //   return res.json(apiResponse(200, 'products fetched successfully', { products, totalProducts, totalPages, currentPage, baseLimit }))
      // }
      
      

    } catch (error) {

    console.log('pagination error', error)

    return res
      .status(500)
      .json(apiResponse(500, 'pagination error', { error: error.message }))
    }
 }

export { productCreate, productDelete, pagination }
