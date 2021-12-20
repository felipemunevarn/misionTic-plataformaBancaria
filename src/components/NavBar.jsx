import React from 'react'
import { Link } from 'react-router-dom'

function cleanStorage() {
	localStorage.setItem("banAgrario", "")
}

export function NavBar({ session, onChange }) {

	function closeSession(){
		onChange('off')		
	}
	return (
		<nav class="navbar navbar-dark bg-dark">
			<div class="container-fluid">
				<Link to="/">
					<a class="navbar-brand" href="/" onClick={cleanStorage}>
						<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Banco_Agrario_de_Colombia_logo.svg/100px-Banco_Agrario_de_Colombia_logo.svg.png" width="30" height="30" alt="" class="d-inline-block align-text-top me-2" />
						Banagrario
					</a>
				</Link>
				{(() => {
					if (session === 'off') {
						return (
							<Link to="/login">
								<button class="btn btn-success my-2 my-sm-0" type="submit">
									Ingresar
								</button>
							</Link>
						)
					} else {
						return (
							<Link to="/">
								<button class="btn btn-danger my-2 my-sm-0" type="submit" onClick={closeSession}>
									Cerrar Sesion
								</button>
							</Link>
						)
					}
				})()}
			</div>
		</nav>
	)
}