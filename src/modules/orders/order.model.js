const mongoose = require("mongoose");

const counterIncrementor = require('../../utils/counterIncrementer');
const toJSON = require("../../plugins/toJSON.plugin");
const paginate = require("../../plugins/paginate.plugin");

const deliveryStatus = {
    pending: 0,
    driverAssigned: 1,
    pickedByDriver: 2,
    success: 3,
    fail: 4,
    refund: 5
}
const paymentStatus = {
    prepaid: 0,
    COD: 1,
}
const ProductSchema = mongoose.Schema({
    noOfPersons: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    refrigeratedMedications:{
        type: Boolean,
        default: false,
    }
});
const OrderSchema = mongoose.Schema(
    {
        product: {
            type: [ProductSchema],
            default: [],
            required: true
        },
        chemist: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        customer:{
            type: mongoose.Types.ObjectId,
            required: true,
        },
        driver: {
            type: mongoose.Types.ObjectId,
           
        },
        paymentStatus: {
            type: Number,
            enum: [0, 1]
        },
        customerSignuature: {
            type: String,
            
        },
        packageId: {
            type: String,
        },
        doc: {
            type: String,
        },
        sign: {
            type: String,
        },
        totalAmountToPay: {
            type: Number,
          
        },
        paybleAmount: {
            type: Number,
          
        },
        seenByDriver:{
            type: Boolean,
            default: false,
        },
        seenByAdmin:{
            type: Boolean,
            default: false,
        },
        seqId: {
            type: Number
        },
        active: {
            type: Boolean,
            default: true,
        },
        chemistPay:{
            type:Number,
            
        },
        driverPayout:{
            type:Number,
            
        },
        deliveryStatus: {
            type: Number,
            default: 0,
            enum: [0, 1, 2, 3, 4]
        },
         customCreatedAt: {
            type: Date,  
            
          },
          scheduleDelivery:{
            type: Date,
            
          },
        orderId: {
            type: String,
            unique: true
        },
        
        notes: {
            type: String,    
        },
        
        driverNotes: {
            type: String,    
        }
    },
    {
        timestamps: true,
    }
);

OrderSchema.plugin(toJSON);
OrderSchema.plugin(paginate);

OrderSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('Orders');
    doc.orderNo = `AT` + (1000 + doc.seqId);
    next();
});
OrderSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('Orders');
    if (doc.seqId) {
        doc.orderId = `SDO${String(doc.seqId).padStart(3, '0')}`;
        next();
    } else {
        next(new Error('Failed to generate sequence ID'));
    }
});
/**
 * @typedef OrderSchema
 */
const Orders = mongoose.model('order', OrderSchema)

module.exports = Orders;
