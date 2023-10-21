const { BatchModel } = require('../models');

class BatchDataLayer {
  async create(data) {
    const { name } = data;

    const batch = await BatchModel.create({ name });

    return { batch };
  }

  async findAll() {
    const batches = await BatchModel.find().sort('-createdAt');

    return { batches };
  }
}

module.exports = new BatchDataLayer();
