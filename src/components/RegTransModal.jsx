import React, { useState, useEffect } from "react";
import Modal from "../utils/modal"
import { useModal } from "../utils/useModal";
import { Link } from 'react-router-dom';
import style from '../styles/tableSide.module.css'

const RegTransModal = ({ tipoUsr, s, fechaInicio, fechaFin, idCuenta, onUpdate }) => {
	const [isOpenModal, openModal, closeModal] = useModal(false)
	const [aviso, setAviso] = useState('');
	const [inicio, setInicio] = useState(new Date());
	const [fin, setFin] = useState(new Date());

	function changeFechaInicioHandler(e) {
		onUpdate(e.target.value, fechaFin, idCuenta);
	}

	useEffect(() => {
		let anio = parseInt(fechaInicio.slice(0, 4));
		let mes = parseInt(fechaInicio.slice(5, 7));
		let dia = parseInt(fechaInicio.slice(-2));
		setInicio(new Date(anio, mes - 1, dia));
	}, [fechaInicio])

	function changeFechaFinHandler(e) {
		onUpdate(fechaInicio, e.target.value, idCuenta);
	}

	useEffect(() => {
		let anio = parseInt(fechaFin.slice(0, 4));
		let mes = parseInt(fechaFin.slice(5, 7));
		let dia = parseInt(fechaFin.slice(-2));
		setFin(new Date(anio, mes - 1, dia));
	}, [fechaFin])

	useEffect(() => {
		let oneMonth = 1000 * 60 * 60 * 24 * 30; // en milisegundos
		let threeMonths = 1000 * 60 * 60 * 24 * 30 * 3; // en milisegundos
		let lapso = fin - inicio;
		if (lapso >= oneMonth && lapso <= threeMonths) {
			setAviso('')
		} else {
			setAviso('El lapso de consulta debe estar entre 30 y 90 dias');
		}
	}, [inicio, fin])

	function changeIdCuentaHandler(e) {
		onUpdate(fechaInicio, fechaFin, e.target.value);
	}

	// useEffect(() => {
	// 	let cuenta = cuentas.find(cta => cta.idCuenta === origen)

	// 	if (cuenta) {
	// 		setSaldo(cuenta.saldo)
	// 		setAviso('')
	// 	} else {
	// 		setAviso('No existe esa cuenta de origen');
	// 	}
	// }, [idCuentas])

	function searchTransfers(e) {
		alert(`Se buscará desde ${inicio} hasta ${fin} de la cuenta ${idCuenta}`)
		// 	let ctaOrigen = cuentas.find(cta => cta.idCuenta === origen);
		// 	let ctaDestino = cuentas.find(cta => cta.idCuenta === destino);
		// 	if (ctaOrigen && ctaDestino && saldo >= totalADescontar && totalADescontar >= 0 ){
		// 		ctaOrigen.saldo -= totalADescontar;
		// 		ctaDestino.saldo += montoTransf;
		// 	} else {
		// 		alert('No podemos procesar tu solicitud');
		// 	}
		closeModal();
		e.preventDefault();
	}

	return (
		<div>
			<li>
				<Link to={`/${tipoUsr}/${s}`}>
					<a href={`/${tipoUsr}/${s}`} className={"nav-link ps-0 text-white "+style.enlace} onClick={openModal}>
						{/* <svg className="bi me-2" width="16" height="16"><use></use></svg> */}
						{s}
					</a>
				</Link>
			</li>

			<Modal isOpen={isOpenModal} closeModal={closeModal}>

				<form to={`/${tipoUsr}/${s}`}>
					<div className="row">
						<div className="col-12">
							<label htmlFor="origen" className="form-label">Fecha inicial de busqueda</label>
							<input type="date" className="form-control" name="origen"
								value={fechaInicio} onChange={changeFechaInicioHandler}>
							</input>
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<label htmlFor="destino" className="form-label">Fecha final de busqueda</label>
							<input type="date" className="form-control" name="destino"
								value={fechaFin} onChange={changeFechaFinHandler}>
							</input>
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<label htmlFor="montoTransf" className="form-label">Cuenta a consultar</label>
							<input type="number" className="form-control" name="montoTransf"
								value={idCuenta} onChange={changeIdCuentaHandler}>
							</input>
						</div>
					</div>

					{Boolean(aviso) && <div className="form-text">{aviso}</div>}
				</form>

			</Modal>
		</div>
	)
}

export default RegTransModal;