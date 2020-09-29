const mongoose = require('mongoose');

const PlansSchema = new mongoose.Schema({
	name: String,
	speed: String,
	data: String,
	postfup: String,
	rental: String
});

const Plan = mongoose.model('Plan', PlansSchema);

module.exports = Plan;
