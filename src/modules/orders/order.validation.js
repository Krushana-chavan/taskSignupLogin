const Joi = require('joi');
const { password, emailCustom, objectId } = require('../../validations/custom.validation');

const list = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
        filter: Joi.string(),
        sort: Joi.object(),
    }),
};

const assignDriver = {
    params: Joi.object().keys({
        orderId: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        driverId: Joi.custom(objectId).required(),
        chemistPay: Joi.number().required(),
        driverPayout: Joi.number().required(),
     
    }),
};

const orderPickedByDriver = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),

};

const orderPickedById = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),

};
const addDriverNotes = {
    
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    body: Joi.object().keys({
        driverNotes: Joi.string().required(),
    }),
};

const deliverOrderBySign = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    body: Joi.object().keys({

        sign: Joi.string().required(),
    }),
};

const addOrder = {
    body: Joi.object().keys({
        customerName: Joi.string().required(),
        streetAddress: Joi.string().required(),
        city: Joi.string().allow(''),
        customCreatedAt: Joi.date().required(),
        postalCode: Joi.string().required(),
        province: Joi.string().required(),
        phoneNo: Joi.string().required(),
        notes: Joi.string().allow(""),
        scheduleDelivery: Joi.string().allow(""),
        paymentStatus: Joi.number().valid(0, 1).required(),
        paybleAmount: Joi.number().required(),
        packageId: Joi.string().allow(''),
        doc: Joi.string().allow(""),
        totalAmount: Joi.number(),
        product: Joi.array().items(Joi.object().keys({
            noOfPersons: Joi.number().required().messages({
                "string.empty": `Number of medication must contain value`,
                "any.required": `Number of medication is a required field`,
                "number.required": `Number of medication is must be a number`
            }),
            quantity: Joi.number().required(),
            price: Joi.number().required(),
            refrigeratedMedications: Joi.boolean().default(false),
        })).required(),
    }),
};

const updateOrder = {
    body: Joi.object().keys({
        customerName: Joi.string().required(),
        streetAddress: Joi.string().required(),
        city: Joi.string().allow(''),
        postalCode: Joi.string().required(),
        province: Joi.string().required(),
        phoneNo: Joi.string().required(),
        paymentStatus: Joi.number().valid(0, 1).required(),
        paybleAmount: Joi.number().required(),
        packageId: Joi.string().allow(''),
        doc: Joi.string().allow(""),
        notes: Joi.string().allow(""),
        scheduleDelivery: Joi.string().allow(""),
        totalAmount: Joi.number(),
        customerId: Joi.custom(objectId).required(),
        product: Joi.array().items(Joi.object().keys({
            noOfPersons: Joi.number().required().messages({
                "string.empty": `Number of medication must contain value`,
                "any.required": `Number of medication is a required field`,
                "number.required": `Number of medication is must be a number`
            }),
            quantity: Joi.number().required(),
            price: Joi.number().required(),
            refrigeratedMedications: Joi.boolean().default(false),
        })).required(),
    }),
    params: Joi.object().keys({
        orderId: Joi.custom(objectId).required(),
    }),
}

module.exports = {
    assignDriver,
    list,
    addOrder,
    orderPickedByDriver,
    updateOrder,
    orderPickedById,
    addDriverNotes,
    deliverOrderBySign
};