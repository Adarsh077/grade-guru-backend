const { batchDataLayer } = require('../data');

class BatchService {
  async create(data) {
    const { name } = data;

    const { batch } = await batchDataLayer.create({
      name,
    });

    return { batch };
  }

  async findAll() {
    const { batches } = await batchDataLayer.findAll();

    return { batches };
  }
}

module.exports = new BatchService();
