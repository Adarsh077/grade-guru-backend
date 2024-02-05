const { BatchModel } = require('../models');

class BatchDataLayer {
  async create(data) {
    const { name, year } = data;

    const batch = await BatchModel.create({ name, year });

    return { batch };
  }

  async findAll() {
    const batches = await BatchModel.find().sort('-createdAt');

    return { batches };
  }
}

module.exports = new BatchDataLayer();
