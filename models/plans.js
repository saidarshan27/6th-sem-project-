const mongoose = require('mongoose');

const PlansSchema = new mongoose.Schema({
	name: String,
	speed: String,
	data: String,
	postfup: String,
	rental: String
});

module.exports = mongoose.model('Plan', PlansSchema);
