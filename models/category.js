const { Schema, model } = require('mongoose');

const CategorySchema = Schema({

    name: {
        type: String,
        required: [true, 'El nombre de la categoria es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

});

CategorySchema.methods.toJSON = function(){
    const { __v , _id, status,  ...category } = this.toObject();
    let uid = _id;

    let orderCategory = Object.assign({uid}, category);
    return orderCategory;
}



module.exports = model('Category', CategorySchema);

