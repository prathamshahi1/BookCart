import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'BookOpen'
    }
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
