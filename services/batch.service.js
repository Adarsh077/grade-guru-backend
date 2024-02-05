const { batchDataLayer } = require('../data');

class BatchService {
  async create(data) {
    const { name, year } = data;

    const { batch } = await batchDataLayer.create({
      name,
      year,
    });

    return { batch };
  }

  async findAll() {
    const { batches } = await batchDataLayer.findAll();

    return { batches };
  }
}

module.exports = new BatchService();
