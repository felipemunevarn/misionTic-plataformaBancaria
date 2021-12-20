import { useState, useEffect } from 'react'

import Axios from 'axios'

export function CuentasPendientes() {
	const [accPend, setAccPend] = useState([])
	const [pulse, setPulse] = useState(false)

	useEffect(() => {
		async function userAccounts() {
			let listaCuentas = []

			const accounts = await Axios.post(`${process.env.REACT_APP_URL}/getAllAccounts`, {})

			accounts.data.forEach(e => {
				if (e.estado === "pendActivacion" || e.estado === "pendCancelacion") {
					listaCuentas.push({
						estado: e.estado,
						cliente: e.numDoc,
						fecha: e.fecha,
						cuenta: e.numCuenta,
						saldo: e.balance,
						tipoPeticion: e.estado === "pendActivacion" ? "Activacion" : "Cancelacion",
						id: e._id
					})
				}
			})

			setAccPend(listaCuentas)
		}

		userAccounts()
	}, [pulse])

	async function handleAprobar(id, state) {
		const opeOut = await Axios.post(`${process.env.REACT_APP_URL}/exeChangeState`, {
			id,
			estado: (state === "pendActivacion") ? "activa" : (state === "pendCancelacion") ? "desactivada" : ""
		})
	}

	async function handleRechazar(id, state) {
		const opeOut = await Axios.post(`${process.env.REACT_APP_URL}/exeChangeState`, {
			id,
			estado: (state === "pendActivacion") ? "rechazada" : (state === "pendCancelacion") ? "activa" : ""
		})

		setPulse(!pulse)
	}

	return (
		<div>
			<table className="table table-striped table-hover">
				<thead>
					<tr>
						<th scope="col">Fecha</th>
						<th scope="col"># Cuenta</th>
						<th scope="col">Monto</th>
						<th scope="col">Cliente</th>
						<th scope="col">Peticion</th>
						<th scope="col">Aprobar</th>
						<th scope="col">Denegar</th>
					</tr>
				</thead>
				<tbody>
					{
						accPend.map((acc) => {
							return (
								<tr key={acc.id}>
									<td>{(acc.fecha).substring(0, (acc.fecha).indexOf('T'))}</td>
									<td>{acc.cuenta}</td>
									<td>${acc.saldo}</td>
									<td>{acc.cliente}</td>
									<td>{acc.tipoPeticion}</td>
									<td>
										<button type="button" class="btn btn-warning" onClick={() => handleAprobar(acc.id, acc.estado)}>Aprobar</button>
									</td>
									<td>
										<button type="button" class="btn btn-warning" onClick={() => handleRechazar(acc.id, acc.estado)}>Denegar</button>
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