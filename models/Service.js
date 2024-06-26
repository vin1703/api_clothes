const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true, },
    categories: { type: Array,require:true },
  }
);

module.exports = mongoose.model("Service", ServiceSchema);
