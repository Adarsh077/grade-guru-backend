const { resultDataLayer } = require('../data');

class ResultService {
  async updateBy(data) {
    const { semesterId, data: resultData } = data;

    const { semesterResult } = await resultDataLayer.updateBy({
      semesterId,
      data: resultData,
    });

    return { semesterResult };
  }

  async findOne({ semesterId }) {
    const { result } = await resultDataLayer.findOne({ semesterId });

    return { result };
  }
}

module.exports = new ResultService();
