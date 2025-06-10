class BaseService {
    constructor(model) {
        this.model = model;
    }

    create = async (payload) => {
        try {
            //  returns newly careated model instance with all the values intact and auto generated
            // fields like createdAt and id
            return await this.model.create(payload);
        } catch (exception) {
            throw exception;
        }
    }

    findByPk = async (pk) => {
        try {
            await this.model.findByPk(pk);
        } catch (exception) {
            throw exception;
        }
    }

    findSingleRowByFilter = async (filter) => {
        try {
            return await this.model.findOne(filter);
        } catch (exception) {
            console.log('exception: ', exception);
            throw exception;
        }
    }
}

module.exports = BaseService;