import mongoose from 'mongoose';

const CategorySchema = mongoose.Schema({
    nameCategory:{
        type: String,
        required: [true, 'The name of the category is required']
    },
    description:{
        type: String,
        required: [true, 'The descripction of the category is required']
    },
    estado:{
        type: Boolean,
        default: true
    }
});

CategorySchema.methods.toJSON = function(){
    const{ __v, _id, ...category} = this.toObject();
    category.category_id = _id;
    return category;
};

export default mongoose.model('Category', CategorySchema);