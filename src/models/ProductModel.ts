import mongoose, { Schema, Types } from 'mongoose';

const scheme = new Schema({
    title: {
        type: String,
        required: true,
    },
    slug: String,
    description: String,
    categories: [{
        type: Types.ObjectId,
        ref: 'categories',
    }],
    supplier: {
        require: true,
        type: String,
    },
    content: String,
    expiryDate: {
        type: Date,
    },
    images: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

const ProductModel = mongoose.model('products', scheme);
export default ProductModel;
