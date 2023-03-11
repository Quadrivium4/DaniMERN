const crud = async (schema, action, options) => {
    switch(action){
        case "read": 
            return await schema.findOne(options);
        case "create":
            return await schema.create(options);
        case "update": 
            return await schema.findOneAndUpdate(...options);
        case "delete": 
            return await schema.deleteOne(options)
    } 
}
const crudMany = async (schema, action, options) => {
    switch (action) {
        case "read":
            return await schema.find(options);
        case "create":
            return await schema.insertMany(options);
        case "update":
            return await schema.updateMany(...options);
        case "delete":
            return await schema.deleteMany(options)
    }
}
module.exports = {
    crud,
    crudMany
}