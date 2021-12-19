const mongoose = require("mongoose")

const schema = new mongoose.Schema({
	nombre: {
		type: String,
		lowercase: true,
		required: true
	},
	correo: {
		type: String,
		lowercase: true,
		required: true
	},
	tipoDoc: {
		type: String,
		lowercase: true,
		required: true
	},
	numDoc: {
		type: Number,
		required: true
	},
	ciudad: {
		type: String,
		lowercase: true,
		required: true
	},
	direccion: {
		type: String,
		lowercase: true,
		required: true
	},
	pwd: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: ['activa', 'desactivada', 'pendActivacion', 'pendCancelacion', 'rechazada'],
		default: () => "pendActivacion",
	},
	fechaExpDoc: {
		type: Date,
		required: true
	},
	fechaNacimiento: {
		type: Date,
		required: true
	},
	fechaCreacion: {
		type: Date,
		default: () => Date.now(),
		immutable: true
	},
	tipoUsuario: {
		type: String,
		enum: ['cliente', 'empleado', 'administrador'],
		default: () => "cliente"
	}
})

const RegistroModel = mongoose.model("clientes", schema)

module.exports = { RegistroModel }