const { Schema, model } = require('mongoose');

const ProductSchema = Schema({

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
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {type: String},
    available: {type: Boolean, default: true}

});

ProductSchema.methods.toJSON = function(){

    const { __v, status, _id, ...data } = this.toObject();
    let uid = _id;
    let orderProduct = Object.assign({uid}, data)
    return orderProduct;

}

module.exports = model('Product', ProductSchema);