import { useEffect, useState } from 'react'
import Axios from 'axios'

const ManejoCuentas = ({ data }) => {
	const [aviso, setAviso] = useState('ok');
	const [cuentas, setCuentas] = useState([])

	let submitData = async (documento) => {
		const accounts = await Axios.post(`${process.env.REACT_APP_URL}/getAccounts`, {
			activeUser: documento,
			fetchBy: "documento"
		})
		
		let listaCuentas = []
		accounts.data.forEach(e => {
		// 	// SE DEBE CAMBIAR POR EL CONTRARIO ES SOLO PARA PRUEBAS ***********************
			listaCuentas.push({
				cuenta: e.numCuenta,
				saldo: e.balance,
				id: e._id,
				estado: e.estado
			})			
		})
		setCuentas(listaCuentas);
	}

	let submitHandler = (event) => {
		const documento = event.target.documento.value;
		submitData(documento)
		event.preventDefault()
	}

	return (
		<div>
			<div>
				<form onSubmit={submitHandler} >
					<div className="row mt-2">
						<div className="col">
							<label className="form-label" htmlFor="documento">Ingrese el documento del cliente:</label>
						</div>
					</div>
					<div className="row">
						<div className="col-4">
							<input className="form-control" type="number" name="documento" id="documento" min="0" required>
							</input>
						</div>
						<div className="col-8">
							<button className="btn btn-primary" type="submit">Solicitar cuentas del cliente</button>
						</div>
					</div>
				</form>
			</div>
			{Boolean(aviso) && 
				<div>
					<div className="form-text">{aviso}</div>
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
											{(()=>{if (e.estado === 'activa') {
												return (<button>Cancelar</button>);
											} else if (e.estado === 'pendiente'){
												return (<><button>Aprobar</button><button>Denegar</button></>);
											} else if (e.estado === 'cancelada'){
												return (<button>Reactivar</button>);
											}})()}
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