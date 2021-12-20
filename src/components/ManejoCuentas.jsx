import { useState } from 'react'

import Axios from 'axios'

const ManejoCuentas = () => {
	const [aviso, setAviso] = useState('');
	const [cuentas, setCuentas] = useState([]);

	let submitData = async (documento) => {
		const accounts = await Axios.post(`${process.env.REACT_APP_URL}/getAccounts`, {
			activeUser: documento,
			fetchBy: "documento"
		})

		let listaCuentas = []
		accounts.data.forEach(e => {
			listaCuentas.push({
				cuenta: e.numCuenta,
				saldo: e.balance,
				id: e._id,
				estado: e.estado,
				doc: e.numDoc
			})
		})

		if (listaCuentas.length > 0) {
			setAviso(`Cuentas del cliente con documento ${documento}`);
			setCuentas(listaCuentas);
		} else {
			setAviso('Error: Cliente no encontrado')
		}
	}

	let submitHandler = (event) => {
		const documento = event.target.documento.value;
		submitData(documento)
		event.preventDefault()
	}

	async function cancelCtaById (id, doc) {
		const opeOut = await Axios.post(`${process.env.REACT_APP_URL}/exeChangeState`, {
			id,
			estado: "cancelada"
		})
		submitData(doc)
		console.log(opeOut);
	}

	async function activateCtaById (id, doc) {
		const opeOut = await Axios.post(`${process.env.REACT_APP_URL}/exeChangeState`, {
			id,
			estado: "activa"
		})
		submitData(doc)
		console.log(opeOut);
	}

	async function rejectCtaById (id, doc) {
		const opeOut = await Axios.post(`${process.env.REACT_APP_URL}/exeChangeState`, {
			id,
			estado: "rechazada"
		})
		submitData(doc)
		console.log(opeOut);
	}

	return (
		<div>
			<div>
				<form onSubmit={submitHandler}>
					<div className="row mt-2">
						<div className='col'>
							<label className="form-label" htmlFor="documento">Ingrese el documento del cliente:</label>
						</div>
					</div>

					<div className='row'>
						<div className="col-4">
							<input className="form-control" type="number" name="documento" id="documento" min="0" required>
							</input>
						</div>
						<div className="col-8">
							<button className="btn btn-primary" type="submit">Solicitar cuentas del cliente</button>
						</div>
					</div>
				</form>
				<div className="form-text">{aviso}</div>
			</div>
			{Boolean(aviso[0] === 'C') &&
				<div>					
					<table className="table table-hover">
						<thead>
							<tr>
								<th scope="col"># Cuenta</th>
								<th scope="col">Saldo</th>
								<th scope="col">Estado</th>
								<th scope="col">Accion</th>
							</tr>
						</thead>
						<tbody>
							{cuentas.map(e => {
								return (
									<tr className='text-body'>
										<th scope="row">{e.cuenta}</th>
										<td>$ {e.saldo.toFixed(2)}</td>
										<td>{e.estado}</td>
										<td>
											{(() => {
												if (e.estado === 'activa') {
													return (<button className='btn btn-danger' onClick={() => cancelCtaById(e.id, e.doc)}>
														Cancelar
													</button>)
												} else if (e.estado === 'pendiente apertura') {
													return (<><button className='btn btn-success' onClick={() => activateCtaById(e.id, e.doc)}>
														Abrir Cta
													</button>
													<button className='btn btn-danger' onClick={() => rejectCtaById(e.id, e.doc)}>
														Denegar
													</button></>)
												} else if (e.estado === 'pendiente cierre') {
													return (<><button className='btn btn-success' onClick={() => cancelCtaById(e.id, e.doc)}>
														Cerrar Cta
													</button>
													<button className='btn btn-danger' onClick={() => activateCtaById(e.id, e.doc)}>
														Denegar
													</button></>)
												} else if (e.estado === 'cancelada') {
													return (<button className='btn btn-success' onClick={() => activateCtaById(e.id, e.doc)}>
														Reactivar
													</button>)
												}
											})()}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			}
		</div>
	)
}

export { ManejoCuentas }