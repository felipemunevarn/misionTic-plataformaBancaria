import { Link, useLocation } from 'react-router-dom'
import RegTransModal from './RegTransModal'
import '../../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import style from '../styles/tableSide.module.css'
import { Cuentas } from './Cuentas'

const user = [
	{
		user: 'cliente',
		select: ['Cuentas', 'Transferencias', 'Reclamos', 'Nueva Cuenta'],
	},
	{
		user: 'empleado',
		select: ['Depositos', 'Cuentas Pendientes', 'Manejo de Cuentas', 'Reclamos']
	},
	{
		user: 'administrador',
		select: ['Depositos', 'Cuentas Pendientes', 'Manejo de Cuentas', 'Reclamos', 'Gestionar Personal']
	}
]

export function TableSide({ fechaInicio, fechaFin, idCuenta, onUpdate }) {
	const userActive = JSON.parse(localStorage.getItem("banAgrario"))
	const tipoUsr = useLocation().state || userActive.url

	return (
		<div className="d-flex flex-column flex-shrink-0">
			<>
				<ul className="nav nav-pills flex-column mb-auto py-4">
					{user.map((u) => {
						if (u.user === tipoUsr) {
							return u.select.map((s) => {
								if (s === 'Transferencias') {
									return (
										<div className={"d-flex flex-row align-items-center p-1 mb-4 " + style.efecto}>
											<i className={'bi bi-arrow-left-right ms-3 me-2 text-white'}></i>
											<RegTransModal tipoUsr={tipoUsr} s={s}
												fechaInicio={fechaInicio} fechaFin={fechaFin}
												idCuenta={idCuenta} onUpdate={onUpdate} />
										</div>
									)
								}
								else {
									let icono = ""

									if (s === "Cuentas") {
										icono = "clipboard-check"
									} else if (s === "Reclamos") {
										icono = "pencil-square"
									} else if (s === "Nueva Cuenta") {
										icono = "plus-circle"
									} else if (s === "Depositos") {
										icono = "coin"
									} else if (s === "Cuentas Pendientes") {
										icono = "journal-check"
									} else if (s === "Manejo de Cuentas") {
										icono = "card-checklist"
									} else if (s === "Gestionar Personal") {
										icono = "people-fill"
									}

									return (
										<li className={"mb-4 " + style.efecto}>
											<Link to={`/${tipoUsr}/${s.replace(/ /g, '')}`}>
												<a href={`/${tipoUsr}/${s.replace(/ /g, '')}`} className={'nav-link text-white ' + style.enlace}>
													<i className={`me-2 bi bi-${icono}`}></i>
													{s}
												</a>
											</Link>
										</li>
									)
								}
							})
						} else { return null }
					})
					}
				</ul>
			</>
		</div>
	)
}