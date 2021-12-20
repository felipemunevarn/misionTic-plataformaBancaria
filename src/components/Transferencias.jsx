import { useState, useEffect } from 'react'

import Axios from 'axios'

const Transferencias = ({ data, fechaInicio, fechaFin, idCuenta }) => {
	const [transferencias, setTransferencias] = useState([])
	const [pulse, setPulse] = useState(false)

	const fini = new Date(fechaInicio)
	const ffin = new Date(fechaFin)

	useEffect(() => {
		async function effectTransacciones() {
			const transaccionesData = await Axios.post(`${process.env.REACT_APP_URL}/getTransactions`, {
				doc: JSON.parse(localStorage.getItem("banAgrario")).userSession,
				acc: idCuenta ? idCuenta : 0
			})
			setTransferencias(transaccionesData.data)
		}
		effectTransacciones()
	}, [idCuenta, pulse])

	async function createReclamosTask(numTran) {
		let res = ''

		try {
			res = await Axios.post(`${process.env.REACT_APP_URL}/createReclamo`, {
				doc: JSON.parse(localStorage.getItem("banAgrario")).userSession,
				numTransf: numTran
			})
		} catch (error) {
			console.log("markClaimStatus", error)
		}

		return res.data === "succeed" ? 1 : 0
	}

	async function updateTransaccionesStatus(numTran) {
		let res = ''

		try {
			res = await Axios.post(`${process.env.REACT_APP_URL}/updateTransfEstado`, {
				numTransf: numTran
			})
		} catch (error) {
			console.log("markClaimStatus", error)
		}

		return res.data === "succeed" ? 1 : 0
	}

	async function markClaimStatus(numTran) {
		let verifier = 0
		const OK = 2

		try {
			verifier += await updateTransaccionesStatus(numTran)
			verifier += await createReclamosTask(numTran)
		} catch (error) {
			console.log("markClaimStatus", error)
		}

		return verifier === OK ? "saved" : "error"
	}


	const handleReclamo = async (event) => {
		event.preventDefault()

		try {
			// console.log("handleReclamo:", await markClaimStatus(event.target.id))
			await markClaimStatus(event.target.id)
		} catch (error) {
			console.log("handleReclamo", error)
		}

		alert("Se ha enviado su reclamo")
		setPulse(!pulse)
	}

	return (
		<div>
			<table className="table table-striped table-hover">
				<thead>
					<tr>
						<th scope="col"># Transf</th>
						<th scope="col">Fecha</th>
						<th scope="col">Origen</th>
						<th scope="col">Destino</th>
						<th scope="col">Monto</th>
						<th scope="col">Tipo</th>
						<th scope="col">Reclamar</th>
					</tr>
				</thead>
				<tbody>
					{
						transferencias.map((e) => {
							return (
								fechaInicio && fechaFin && fini <= new Date(e.fecha) && new Date(e.fecha) <= ffin &&
								<tr key={e.id}>
									<td>{e.numTransf}</td>
									<td>{(e.fecha).substring(0, (e.fecha).indexOf('T'))}</td>
									<td>{e.fuente}</td>
									<td>{e.destino}</td>
									<td>$ {e.monto}</td>
									<td>{e.tipoTrans}</td>
									<td>
										<button type="button" class="btn btn-warning" id={e.numTransf} onClick={handleReclamo} disabled={e.estado === "Disputa"}>Reclamar</button>
									</td>
								</tr>
							)
						})
					}
				</tbody>
			</table>
		</div>
	)
}

export { Transferencias }