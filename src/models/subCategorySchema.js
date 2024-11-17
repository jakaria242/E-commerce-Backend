import mongoose, { Schema } from 'mongoose'

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    category: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
      },
    ],
  },
  { timestamps: true }
)

export const SubCategory = mongoose.model('SubCategory', subCategorySchema)
