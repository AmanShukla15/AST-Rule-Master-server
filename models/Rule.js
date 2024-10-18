import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({  
    ruleString: { type: String, required: true },  
    createdAt: { type: Date, default: Date.now },  
    updatedAt: { type: Date, default: Date.now },  
    metadata: { type: Object, default: {} }  
});  

const Rule = mongoose.model('Rule', ruleSchema);

export default Rule;