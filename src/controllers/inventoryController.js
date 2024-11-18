import apiResponse from 'quick-response'
import { Inventory } from '../models/inventorySchema.js'
import { Product } from '../models/productSchema.js'

// @desc create a inventory
// route POST /api/v1/inventory/create
const inventoryCreate = async (req, res) => {
  try {
    const {
      product,
      variation,
      purchasePrice,
      sellingPrice,
      discountPrice,
      quantity,
    } = req.body
    if (
      [product, variation, purchasePrice, sellingPrice, quantity].some(
        (field) => field === '' || field == null
      )
    ) {
      return res.status(400).json(apiResponse(400, 'all fields are  required'))
    }
       // Validate that sellingPrice is greater than purchasePrice
       if (sellingPrice <= purchasePrice) {
        return res
          .status(400)
          .json(apiResponse(400, 'Selling price must be greater than purchase price'));
      }
      
    const inventory = await Inventory.create({
      product,
      variation,
      purchasePrice,
      sellingPrice,
      quantity,
      discountPrice,
    })
    await Product.findByIdAndUpdate(
      { _id: product },
      { $push: { inventory: inventory._id } }
    )
    return res
      .status(201)
      .json(apiResponse(201, 'inventory created successfully', { inventory }))
  } catch (error) {
    console.error('inventory create error:', error)
    return res
      .status(500)
      .json(
        apiResponse(500, 'inventory create error', { error: error.message })
      )
  }
}

// @desc update inventory
// route POST /api/v1/inventory/update/:id           =====id pass korte hobe
const inventoryUpdate = async (req, res) => {
  try {
    const { id } = req.params
    const {
      product,
      variation,
      purchasePrice,
      sellingPrice,
      discountPrice,
      quantity,
    } = req.body

     // check inventory is exist or not
    const isFound = await Inventory.findById({ _id: id })
    if (!isFound) {
      return res.status(404).json(apiResponse(404, 'inventory not found'))
    }
     // update inventory
    const inventory = await Inventory.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          product,
          variation,
          purchasePrice,
          sellingPrice,
          quantity,
          discountPrice,
        },
      },
      { new: true }
    )
    if (product != isFound.product) {
      await Product.findByIdAndUpdate(
        { _id: product },
        { $push: { inventory: inventory._id } }
      )
    }
    return res
      .status(201)
      .json(apiResponse(201, 'inventory update successfully', { inventory }))
  } catch (error) {
    console.error('inventory update error:', error)
    return res
      .status(500)
      .json(
        apiResponse(500, 'inventory update error', { error: error.message })
      )
  }
}

// @desc all inventory
// route Get /api/v1/inventory
const allInventory = async (_, res) => {
  try {
    const inventory = await Inventory.find()
      .populate('product')
      .populate('variation')

    return res
      .status(201)
      .json(apiResponse(201, 'Find all inventory', { inventory }))
  } catch (error) {
    console.error('inventory fetching error', error)
    return res
      .status(500)
      .json(
        apiResponse(500, 'inventory fetching error', { error: error.message })
      )
  }
}
// @desc single inventory fine
// route Get /api/v1/inventory/single/:id          ===== id pass korte hobe
const singleInventory = async (req, res) => {
  try {
    const { id } = req.params

    // Validate and convert the `id` to ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' })
    }
    const inventory = await Inventory.findById({ _id: id })
      .populate('product')
      .populate('variation')
    if (!inventory) {
      return res.status(404).json(apiResponse(404, 'inventory does not found'))
    }
    return res
      .status(201)
      .json(apiResponse(201, 'Find single inventory', { inventory }))
  } catch (error) {
    console.error('Find single inventory error', error)
    return res
      .status(500)
      .json(
        apiResponse(500, 'Find single inventory error', {
          error: error.message,
        })
      )
  }
}

// @desc delete inventory
// route (Post/Delete) /api/v1/inventory/delete/:id      ===== id pass korte hobe
const inventoryDelete = async (req, res) => {
  try {
    const { id } = req.params
    const inventory = await Inventory.findOneAndDelete({ _id: id })
    if (!inventory) {
      return res.status(404).json(apiResponse(404, 'inventory does not found'))
    }
    return res
      .status(201)
      .json(apiResponse(201, 'Inventory delete', { inventory }))
  } catch (error) {
    console.error('inventory delete error', error)
    return res
      .status(500)
      .json(
        apiResponse(500, 'inventory delete error', { error: error.message })
      )
  }
}

// @desc delete all inventory
// route (Post/Delete) /api/v1/inventory/deleteall
const allInventoryDelete = async (_, res) => {
  try {
    // Delete all inventory items
    const inventory = await Inventory.deleteMany()

    return res.status(200).json(
      apiResponse(200, 'All inventory items deleted successfully', {
        deletedCount: inventory.deletedCount,
      })
    )
  } catch (error) {
    console.error('All inventory delete error', error)
    return res
      .status(500)
      .json(
        apiResponse(500, 'All inventory delete error', { error: error.message })
      )
  }
}

export {
  inventoryCreate,
  inventoryUpdate,
  allInventory,
  singleInventory,
  inventoryDelete,
  allInventoryDelete,
}
