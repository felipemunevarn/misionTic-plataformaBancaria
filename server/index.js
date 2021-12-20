require('dotenv').config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const { MongoClient } = require('mongodb')

const { RegistroModel } = require("./models/Registro")
const { CuentasModel } = require("./models/Cuentas")
const { TransaccionesModel } = require("./models/Transacciones")
const { AutoIncModel } = require("./models/AutoIncremental")
const { ReclamosModel } = require("./models/Reclamos")

const NUM_TRAN = "61b94da73eec120a384b90ef"
const NUM_RECL = "61b94dd51ff22b3ee1283ab2"

const URL = `mongodb+srv://${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASSWORD}@banagrario.57kdk.mongodb.net/${process.env.REACT_APP_DB}?retryWrites=true&w=majority`
const app = express()

app.use(express.json())
app.use(cors())

async function getTransCount() {
	let resUpd = {
		num: 0,
		res: false
	}

	mongoose.connect(URL)

	try {
		const currCount = await AutoIncModel.findOne({ _id: NUM_TRAN })
		const newCount = resUpd.num = currCount.numTransaccion + 1

		await AutoIncModel.updateOne(
			{ _id: NUM_TRAN },
			{ $set: { numTransaccion: newCount } }
		)
			.then(() => {
				resUpd.num = newCount
				resUpd.res = true
			})

	} catch (error) {
		console.log("getTransCount", error)
	}

	return resUpd
}

async function getReclCount() {
	let resUpd = {
		num: 0,
		res: false
	}

	mongoose.connect(URL)

	try {
		const currCount = await AutoIncModel.findOne({ _id: NUM_RECL })
		const newCount = resUpd.num = currCount.numReclamo + 1

		await AutoIncModel.updateOne(
			{ _id: NUM_RECL },
			{ $set: { numReclamo: newCount } }
		)
			.then(() => {
				resUpd.num = newCount
				resUpd.res = true
			})

	} catch (error) {
		console.log("getTransCount", error)
	}

	return resUpd
}

async function loginDataMatch(client, { user, pass }) {
	const result = await client.db(process.env.REACT_APP_DB).collection("clientes")
		.findOne({
			correo: user,
			pwd: pass
		})

	return result ? { typeUser: result.tipoUsuario, userSession: result.numDoc, name: result.nombre } : { typeUser: "noExiste" }
}

function extraerFechaFromDBField(fecha) {
	return `${fecha.getMonth()}-${fecha.getDate()}-${fecha.getFullYear()}`
}

app.post("/routeUser", async (req, res) => {
	const client = new MongoClient(URL)

	try {
		await client.connect()
		const usuarioLogIn = await loginDataMatch(client, req.body)

		switch (usuarioLogIn.typeUser) {
			case "cliente":
				return res.status(200).send({ userSession: usuarioLogIn.userSession, url: "cliente", name: usuarioLogIn.name })
			case "empleado":
				return res.status(200).send({ userSession: usuarioLogIn.userSession, url: "empleado", name: usuarioLogIn.name })
			case "administrador":
				return res.status(200).send({ userSession: usuarioLogIn.userSession, url: "administrador", name: usuarioLogIn.name })
			default:
				return res.status(401).send({ userSession: "Usuario y/o contraseña no validos" })
		}
	} catch (e) {
		console.error(e)
	} finally {
		await client.close()
	}
})

app.post("/createUser", async (req, res) => {
	const user = req.body
	const newUser = new RegistroModel(user)
	let result = ''

	mongoose.connect(URL)

	try {
		await newUser.save().then(() => {
			result = "Creating User succeed"
		})
	} catch (error) {
		result = "Saving account failed"
		console.log("createUser", error)
	}

	res.send(result)
})

app.post("/createTransaction", async (req, res) => {
	let tran = req.body
	let result = ''

	const transCount = await getTransCount()
	tran.numTransf = transCount.res ? transCount.num : "Error"
	const newTran = new TransaccionesModel(tran)

	mongoose.connect(URL)

	try {
		await newTran.save().then(() => {
			result = "Transaccion succeed"
		})
	} catch (e) {
		console.log("TransaccionesModel", e)
		result = "Transaccion failed"
	}

	res.send(result)
})

app.post("/createAccount", async (req, res) => {
	const acc = req.body
	const newAcc = new CuentasModel(acc)
	let result = ''

	mongoose.connect(URL)

	try {
		await newAcc.save().then(() => {
			result = "Saving account succeed"
		})
	} catch (e) {
		result = "Saving account failed"
		console.log("Account failed: " + e)
	}

	res.send(result)
})

app.post("/createReclamo", async (req, res) => {
	let result = ''

	mongoose.connect(URL)

	try {
		const reclCount = await getReclCount()
		const newRec = new ReclamosModel({
			numDoc: req.body.doc,
			numReclamo: reclCount.res ? reclCount.num : "Error",
			numTransf: req.body.numTransf
		})

		await newRec.save()
			.then(() => {
				result = "succeed"
				// console.log("createReclamo succeed")
			})
	} catch (e) {
		console.log("createReclamo failed:", e)
		result = "failed"
	}

	res.send(result)
})

app.post("/updateTransfEstado", async (req, res) => {
	let result = ''

	mongoose.connect(URL)

	try {
		await TransaccionesModel.updateOne(
			{ numTransf: req.body.numTransf },
			{ $set: { estado: "Disputa" } }
		)
			.then((response) => {
				result = response.modifiedCount === 1 ? "succeed" : "failed"
			})
	} catch (error) {
		result = "exeChangeState failed"
	}

	res.send(result)
})

app.post("/getAllAccounts", async (req, res) => {
	let accData

	mongoose.connect(URL)

	try {
		accData = await CuentasModel.find({})
	} catch (error) {
		console.log("existAccount E", error)
	}

	res.json(accData);
})

app.post("/getAccounts", async (req, res) => {
	const activeUser = req.body.activeUser
	const DBField = req.body.fetchBy
	let datadb

	mongoose.connect(URL)

	if (DBField === "documento") {
		try {
			await CuentasModel.find({ numDoc: activeUser }).exec()
				.then((result) => {
					datadb = result
				})
		} catch (e) {
			console.log("getAccountsByDocumento failed: " + e)
		}
	} else if (DBField === "estado") {
		try {
			await CuentasModel.find({ estado: "pendiente apertura" }).exec()
				.then((result) => {
					datadb = result
				})
			console.log(datadb);
		} catch (e) {
			console.log("getAccountsByEstado failed: " + e)
		}
	}

	res.json(datadb)
})

app.post("/exeChangeState", async (req, res) => {
	mongoose.connect(URL)

	try {
		await CuentasModel.updateOne(
			{ _id: req.body.id },
			{ $set: { estado: req.body.estado } }
		)
			.then((response) => {
				resMsg = response.modifiedCount
			})
	} catch (error) {
		resMsg = "exeChangeState failed"
	}

	res.sendStatus(200)
})

app.post("/fetchAccountData", async (req, res) => {
	mongoose.connect(URL)
	let accData = null

	try {
		await CuentasModel.findOne({ numCuenta: req.body.acc }).exec()
			.then((response) => {
				accData = response
			})
	} catch (error) {
		console.log("existAccount E", error)
	}

	res.json(accData)
})

app.post("/exeChangeBalance", async (req, res) => {
	mongoose.connect(URL)
	let resMsg = 0

	try {
		await CuentasModel.updateOne(
			{ _id: req.body.id },
			{ $set: { balance: req.body.newBalance } }
		)
			.then((response) => {
				resMsg = response.modifiedCount
			})
	} catch (error) {
		resMsg = "exeChangeBalance failed"
	}

	res.json({ result: resMsg })
})

app.post("/getTransactions", async (req, res) => {
	const doc = req.body.doc
	const acc = parseInt(req.body.acc)
	let trans = {}

	mongoose.connect(URL)

	try {
		const fetchData = await TransaccionesModel.find({
			$and: [
				{
					$or: [
						{ docFuente: doc },
						{ docDestino: doc }
					]
				},
				{
					$or: [
						{ fuente: acc },
						{ destino: acc }
					]
				}
			]
		})

		trans = fetchData.map((t) => {
			return {
				id: t._id,
				cobroBanco: t.cobroBanco,
				destino: t.destino,
				docDestino: t.docDestino,
				docFuente: t.docFuente,
				estado: t.estado,
				// fecha: extraerFechaFromDBField(t.fecha),
				fecha: t.fecha,
				fuente: t.fuente,
				monto: t.monto,
				numTransf: t.numTransf,
				tipoTrans: t.fuente === acc ? "Enviada" : "Recibida"
			}
		})

	} catch (error) {
		console.log("getTransactions", error)
	}

	res.json(trans)
})

app.post("/getTransById", async (req, res) => {
	let response = {}
	mongoose.connect(URL)
	try {
		response = await TransaccionesModel.find({ numTransf: req.body.transf })
	} catch (error) {
		console.log("getTransById", error)
	}
	res.json(response)
})

app.post("/getReclamosByStatus", async (req, res) => {
	let response

	mongoose.connect(URL)

	try {
		// el aggregate es un array de pasos para una query
		const reclamos = await ReclamosModel.aggregate([
			{
				$match: { estado: req.body.estado }
			},
			{
				$lookup: {
					from: 'transacciones',
					// localField: 'numTransf' >> numTransf es un campo del resultado de la query de $match
					localField: 'numTransf',
					foreignField: 'numTransf',
					as: 'transfData'
				}
			},
			{
				$unwind: '$transfData'
			}
		])
		response = reclamos
	} catch (error) {
		console.log("getReclamosByStatus", error)
	}

	res.json(response)
})

app.post("/getReclamos", async (req, res) => {
	let response = {}

	mongoose.connect(URL)

	try {
		response = await ReclamosModel.find({ numDoc: req.body.numDoc })
	} catch (error) {
		console.log("getReclamos", error)
	}

	res.json(response)
})

app.post("/requestCancelAccount", async (req, res) => {
	let result = ''

	mongoose.connect(URL)

	try {
		await CuentasModel.updateOne(
			{ numCuenta: req.body.cuenta },
			{ $set: { estado: "pendCancelacion" } }
		)
			.then((response) => {
				result = response.modifiedCount === 1 ? "succeed" : "failed"
			})
	} catch (error) {
		result = "exeChangeState failed"
	}
	console.log("result", result)
	res.send(result)
})

app.post("/updateReclamo", async (req, res) => {
	mongoose.connect(URL)

	try {
		await ReclamosModel.updateOne(
			{ _id: req.body.id },
			{
				$set: {
					estado: req.body.estado,
					mensaje: req.body.mensaje
				}
			}
		)
			.then((response) => {
				resMsg = response.modifiedCount
			})
	} catch (error) {
		resMsg = "exeChangeState failed"
	}

	res.sendStatus(200)
})

app.post("/reversePayment", async (req, res) => {
	mongoose.connect(URL)

	try {
		const resReclamo = await ReclamosModel.updateOne(
			{ _id: req.body.idReclamo },
			{
				$set: {
					estado: req.body.estadoReclamo,
					mensaje: req.body.mensajeReclamo
				}
			}
		)

		const resTransaccion = await TransaccionesModel.updateOne(
			{ _id: req.body.idTrans },
			{
				$set: {
					estado: req.body.estadoTrans
				}
			}
		)

		const cuentaOrigen = await CuentasModel.findOne({
			numCuenta: req.body.fuenteTrans
		})

		const cuentaDestino = await CuentasModel.findOne({
			numCuenta: req.body.destinoTrans
		})

		const resDevOrigen = await CuentasModel.updateOne(
			{ numCuenta: req.body.fuenteTrans },
			{
				$set: {
					balance: cuentaOrigen.balance + req.body.montoTotalTrans
				}
			}
		)

		const resDevDestino = await CuentasModel.updateOne(
			{ numCuenta: req.body.destinoTrans },
			{
				$set: {
					balance: cuentaDestino.balance + req.body.montoTrans
				}
			}
		)

		if (
			resReclamo.modifiedCount === 1 &&
			resTransaccion.modifiedCount === 1 &&
			resDevOrigen.modifiedCount === 1 &&
			resDevDestino.modifiedCount === 1
		) {
			console.log("reversePayment OK")
		}
	} catch (error) {
		console.log("exeChangeState failed", error)
		resMsg = "exeChangeState failed"
	}

	res.sendStatus(200)
})

app.post("/getEmployees", async (req, res) => {
	let employees

	mongoose.connect(URL)

	try {
		employees = await RegistroModel.find({
			tipoUsuario: { $nin: [req.body.tipoUsuario] }
		})
	} catch (error) {
		console.log("getEmployees", error)
	}

	res.json(employees)
})

app.post("/updateEmployeeStatus", async (req, res) => {
	mongoose.connect(URL)

	try {
		await RegistroModel.updateOne(
			{ _id: req.body.id },
			{
				$set: {
					status: "desactivada"
				}
			}
		)
	} catch (error) {
		console.log("updateEmployeeStatus", error)
	}
})

app.post("/updateUser", async (req, res) => {
	mongoose.connect(URL)
	// console.log("updateUser", req.body)
	try {
		const uno = await RegistroModel.updateOne(
			{ _id: req.body.id },
			{
				$set: { // update
					nombre: req.body.nombre,
					correo: req.body.correo,
					ciudad: req.body.ciudad,
					direccion: req.body.direccion,
					tipoUsuario: req.body.tipoUsuario,
					pwd: req.body.pwd
				}
			}
		)
		console.log("UNO", uno)
	} catch (error) {
		console.log("updateUser", error)
	}

	res.send("Complete")
})

app.listen(3001, () => {
	console.log("Server is running")
})