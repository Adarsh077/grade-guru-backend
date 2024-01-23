const mongoose = require('mongoose');
const { ResultsModel } = require('../models');

class ResultDataLayer {
  async updateBy(data) {
    const { semesterId, data: resultData } = data;

    const semesterResult = await ResultsModel.findOneAndUpdate(
      {
        semesterId: new mongoose.Types.ObjectId(semesterId),
      },
      { $set: { data: resultData } },
      { upsert: true, new: true },
    );

    return { semesterResult };
  }

  async findOne({ semesterId }) {
    const result = await ResultsModel.findOne({ semesterId });

    return { result };
  }
}

module.exports = new ResultDataLayer();
