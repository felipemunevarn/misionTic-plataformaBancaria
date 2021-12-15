import React, { useState, useEffect } from "react"
import Modal from "../utils/modal"
import { useModal } from "../utils/useModal"

import Axios from 'axios'

const TransfModal = ({ cuentas, ctaOrigen, dis }) => {
	const [isOpenModal, openModal, closeModal] = useModal(false)
	const [origen, setOrigen] = useState(ctaOrigen)
	const [destino, setDestino] = useState('')
	const [montoTransf, setMontoTransf] = useState(0)
	const [totalADescontar, setTotalADescontar] = useState(0)
	const [aviso, setAviso] = useState('')

	function updateOrigen(e) {
		setOrigen(parseInt(e.target.value))
	}

	function updateDestino(e) {
		setDestino(parseInt(e.target.value))
	}

	function updateMontoTransf(e) {
		setMontoTransf(parseFloat(e.target.value))
	}

	useEffect(() => {
		setTotalADescontar(montoTransf * 1.01)
	}, [montoTransf])

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

		return accData
	}

	async function sendMoney(e) {
		e.preventDefault()

		const origin = await fetchAccountData(ctaOrigen)
		const target = await fetchAccountData(destino)
		const accTo = await fetchAccountData(e.target.destino.value)

		if (!accTo) {
			setAviso('No existe esa cuenta de destino')
		} else {
			if (origin.balance < totalADescontar) {
				setAviso('No posees saldo suficiente (comision = 1%)')
			} else if (totalADescontar < 0) {
				setAviso('No puedes transferir montos menores a cero')
			} else {
				setAviso('')
			}
		}

		if (accTo && origin.balance >= totalADescontar && totalADescontar >= 0) {
			let transfer = 0

			const calcOrigen = origin.balance - totalADescontar
			const calcTarget = target.balance + montoTransf

			try {
				await Axios.post(`${process.env.REACT_APP_URL}/	exeChangeBalance`, {
					id: origin._id,
					newBalance: calcOrigen
				})
					.then((response) => {
						transfer += 1
					})

				await Axios.post(`${process.env.REACT_APP_URL}/	exeChangeBalance`, {
					id: target._id,
					newBalance: calcTarget
				})
					.then((response) => {
						transfer += 1
					})
			} catch (error) {
				console.log("newBalance: ", error)
			}

			if (transfer === 2) {

				try {
					await Axios.post(`${process.env.REACT_APP_URL}/	recordTransaction`, {
						docFuente: origin.numDoc,
						docDestino: target.numDoc,
						fuente: origin.numCuenta,
						destino: target.numCuenta,
						monto: montoTransf,
						cobroBanco: montoTransf * 0.01
					})
						.then((response) => {
							console.log("recordTransaction", response.data)
						})
				} catch (error) {
					console.log("recordTransaction", error)
				}

				alert(`Se te descontará ${totalADescontar} para transferir ${montoTransf} debido a la comisión del 1% del banco`)
			} else {
				alert('No podemos procesar tu solicitud')
			}

			setOrigen(calcOrigen)
			setDestino(calcTarget)
		}

		closeModal()
	}

	return (
		<div>
			{Boolean(dis) ?
				<button className="btn btn-warning" onClick={openModal} disabled>Transferir</button>
				: <button className="btn btn-warning" onClick={openModal} >Transferir</button>
			}
			<Modal isOpen={isOpenModal} closeModal={closeModal}>

				<form onSubmit={sendMoney}>
					<div className="row">
						<div className="col-12">
							<label htmlFor="origen" className="form-label">Por favor confirme la cuenta origen</label>
							<input type="number" className="form-control" name="origen" value={origen} placeholder={ctaOrigen} onChange={updateOrigen} readOnly>
							</input>
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<label htmlFor="destino" className="form-label">Por favor confirme la cuenta destino</label>
							<input type="number" className="form-control" name="destino" value={destino} onChange={updateDestino}>
							</input>
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<label htmlFor="montoTransf" className="form-label">Monto a depositar</label>
							<input type="number" className="form-control" name="montoTransf"
								value={montoTransf} onChange={updateMontoTransf}>
							</input>
						</div>
					</div>

					{Boolean(aviso) && <div className="form-text">{aviso}</div>}

					<button type="submit" className="btn btn-primary mt-2">Enviar</button>
				</form>

			</Modal>
		</div>
	)
}

export default TransfModal