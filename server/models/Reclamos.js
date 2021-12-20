const mongoose = require("mongoose")

const schema = new mongoose.Schema({
	numDoc: {
		type: Number,
		required: true
	},
	numReclamo: {
		type: Number,
		required: true
	},
	numTransf: {
		type: Number,
		required: true
	},
	estado: {
		type: String,
		enum: ['Pendiente', 'Aprobado', 'Rechazado'],
		default: () => 'Pendiente'
	},
	mensaje: {
		type: String,
		default: () => "",
	},
	fecha: {
		type: Date,
		default: () => Date.now(),
	}
})

const ReclamosModel = mongoose.model("reclamos", schema)

module.exports = { ReclamosModel }