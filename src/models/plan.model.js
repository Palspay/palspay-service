import mongoose from 'mongoose';

const planSchema = mongoose.Schema(
    {
        plan_name:{type:String},
        plan_amount:{type:String,default:'abcgd.png'},
        currency:{type:String,default:'₹'},
        plan_type:{type:String,default:'Yealy'},
        created_by: {
            type: String
        },
        modified_by: {
            type: String
        },
        creation_date: {
            type: String
        },
        modification_date: {
            type: String
        },
        is_deleted: {
            type: Boolean,
            default:false
        }
    },
);


planSchema.set('versionKey', false);


/**
 * @typedef Groups
 */
const Plans = mongoose.model('plans', planSchema);

export default Plans;