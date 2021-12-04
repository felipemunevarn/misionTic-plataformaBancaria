import React from "react";
import { Link } from 'react-router-dom';

const user = [
	{
		user: 'cliente',
		select: ['Cuentas', 'Transferencias', 'Reclamos', 'Nueva Cuenta']
	},
	{
		user: 'empleado',
		select: ['Depositos', 'Cuentas', 'Reclamos']
	}
];

const tipoUsr = 'cliente'; // Este valor debe venir de la BD

export function TableSide() {
	return (
		<div className="d-flex flex-column flex-shrink-0 p-3 bg-light">
			<p1 className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
				<svg className="bi me-2" width="40" height="32"><use></use></svg>
				Panel
			</p1>

			<>
				<ul className="nav nav-pills flex-column mb-auto">
					{user.map((u) => {
						if (u.user === tipoUsr) {
							return u.select.map((s) => (
								<li>
									<Link to={`/${tipoUsr}/${s.replace(/ /g, '')}`}>
										<a href={`/${tipoUsr}/${s.replace(/ /g, '')}`} className="nav-link link-dark">
											<svg className="bi me-2" width="16" height="16"><use></use></svg>
											{s}
										</a>
									</Link>
								</li>
							))
						} else {return null}
					})
					}
				</ul>
			</>
		</div>
	)
}