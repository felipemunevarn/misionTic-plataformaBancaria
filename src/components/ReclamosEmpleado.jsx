import React, { useState, useEffect } from 'react'
import Axios from 'axios'

const ReclamosEmpleado = () => {
	const [reclamos, setReclamos] = useState([])
	const [texto, setTexto] = useState('')
	// const [texto, setTexto] = useState([]) // TRIGERUPDATE

	// async function getTransfer(id) {
	// 	const transfData = await Axios.post(`${process.env.REACT_APP_URL}/getTransById`, {
	// 		transf: id
	// 	});
	// 	return transfData.data[0];
	// }

	async function getClaims() {
		const reclamosData = await Axios.post(`${process.env.REACT_APP_URL}/getReclamosByStatus`, {
			estado: "Pendiente"
		})
		setReclamos(reclamosData.data);
	}

	useEffect(() => {
		getClaims();
	}, [])

	async function aproveClaim(id) {
		let t

		reclamos.map((r) => {
			if (r._id === id) {
				return (
					t = r.transfData
				)
			}
		})

		await Axios.post(`${process.env.REACT_APP_URL}/reversePayment`, {
			idReclamo: id,
			estadoReclamo: "Aprobado",
			mensajeReclamo: texto,
			idTrans: t._id,
			estadoTrans: 'Reversada',
			fuenteTrans: t.fuente,
			destinoTrans: t.destino,
			montoTrans: t.monto,
			montoTotalTrans: t.monto + t.cobroBanco,
		})

		// submitData(doc)
		// alert(id);
	}

	async function denyClaim(id) {
		await Axios.post(`${process.env.REACT_APP_URL}/updateReclamo`, {
			id,
			estado: "Rechazado",
			mensaje: texto
		})
		// submitData(doc)
		// alert(id);
	}

	function textoState(e) {
		setTexto(e.target.value)
	}

	return (
		<div>
			<table className="table table-striped table-hover">
				<thead>
					<tr>
						<th scope="col"># Reclamo</th>
						<th scope="col">Fecha</th>
						<th scope="col">Monto</th>
						<th scope="col">Comentario</th>
						<th scope="col">Accion</th>
					</tr>
				</thead>
				<tbody>
					{
						reclamos.map((e) => {
							if (e.estado === 'Pendiente') {
								return (
									<tr key={e._id} onChange={textoState}>
										<td>{e.numReclamo}</td>
										<td>{
											(e.fecha).substring(0, (e.fecha).indexOf('T'))
										}</td>
										<td>$ {e.transfData.monto}</td>
										<td>
											<textarea id='textArea'></textarea>
										</td>
										<td>
											<button className='btn btn-success' onClick={() => aproveClaim(e._id)}>
												Aprobar
											</button>
											<button className='btn btn-danger' onClick={() => denyClaim(e._id)}>
												Rechazar
											</button>
										</td>
									</tr>
								)
							} else { return null }
						})
					}
				</tbody>
			</table>
		</div>
	)
}

export { ReclamosEmpleado }