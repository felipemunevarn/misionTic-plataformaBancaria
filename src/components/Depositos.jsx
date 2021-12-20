import React, { useEffect, useState } from 'react'
import Axios from 'axios'

const Depositos = () => {
	const [aviso, setAviso] = useState('');
	const [cuentas, setCuentas] = useState([]);
	const [aviso2, setAviso2] = useState('');
	const [doc, setDoc] = useState('');

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
		if (listaCuentas.length === 0) {
			setAviso('No existe cliente o no tiene cuentas activas');
		} else {
			setCuentas(listaCuentas);
			setAviso(`Cuentas del cliente con documento ${documento}`);
		}
	}

	let submitHandler = (event) => {
		const documento = event.target.documento.value;
		submitData(documento)
		event.preventDefault()
	}

	let depositar = async (cuentaID, monto) => {
		const origin = await fetchAccountData(cuentaID);
		try {
			await Axios.post(`${process.env.REACT_APP_URL}/	exeChangeBalance`, {
				id: origin._id,
				newBalance: (origin.balance + monto)
			})
		} catch (error) {
			console.log("newBalance: ", error)
		}
		if (origin) {
			setAviso2('Deposito exitoso');
			setDoc(origin.numDoc);
		} else {
			setAviso2('No se encontró el numero de cuenta');
			setAviso('No se encontró el numero de cuenta');
		}
	}

	useEffect(() => {
		submitData(doc);
		document.getElementById('documento').value = null;
		// document.getElementById('cuentaID').value = null;
		// document.getElementById('monto').value = null;
	}, [aviso2, doc])

	let clickHandler = (event) => {
		const cuentaID = parseInt(event.target.cuentaID.value);
		const monto = parseFloat(event.target.monto.value);
		depositar(cuentaID, monto)
		event.preventDefault()
	}

	async function fetchAccountData(acc) {
		let accData = {}
		try {
			await Axios.post(`${process.env.REACT_APP_URL}/	fetchAccountData`, {
				acc
			})
				.then((response) => {
					accData = response.data
				})
		} catch (error) {
			console.log("fetchAccountData", error)
		}
		return accData;
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
							</tr>
						</thead>
						<tbody>
							{cuentas.filter(e => e.estado === 'activa').map(e => {
								return (
									<tr className='text-body'>
										<th scope="row">{e.cuenta}</th>
										<td>$ {e.saldo.toFixed(2)}</td>
									</tr>
								)
							})}
						</tbody>
					</table>
					<form onSubmit={clickHandler}>
						<div className="row mt-2">
							<div className='col'>
								<label className="form-label" htmlFor="cuentaID">Ingrese el numero de cuenta a depositar:</label>
							</div>
						</div>
						<div className='row'>
							<div className="col-4">
								<input className="form-control" type="number" name="cuentaID" id="cuentaID" min="0" required>
								</input>
							</div>
						</div>
						<div className="row mt-2">
							<div className='col'>
								<label className="form-label" htmlFor="monto">Ingrese el monto:</label>
							</div>
						</div>
						<div className='row'>
							<div className="col-4">
								<input className="form-control" type="number" name="monto" id="monto" min="0" required>
								</input>
							</div>
							<div className="col-8">
								<button className="btn btn-primary" type="submit">Depositar</button>
							</div>
						</div>
						<div className="form-text">
							{aviso2}
						</div>
					</form>
				</div>
			}
		</div>
	)
}

export { Depositos }