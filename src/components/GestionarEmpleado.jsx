import { useEffect, useState } from 'react'

import Modal from "../utils/modal"
import { useModal } from "../utils/useModal"
import { Registro } from "./Registro"
import { ActualizarEmpleado } from "./ActualizarEmpleado"

import Axios from 'axios'

export function GestionarEmpleado() {
	const [empleados, setEmpleados] = useState([])
	const [followUp, setFollowUp] = useState(false)

	useEffect(() => {
		async function effectEmpleados() {
			const empleadosList = await Axios.post(`${process.env.REACT_APP_URL}/getEmployees`, {
				tipoUsuario: "cliente"
			})
			// console.log("empleadosList", empleadosList.data)
			setEmpleados(empleadosList.data)
		}
		effectEmpleados()
	}, [])

	const [isOpenModal, openModal, closeModal] = useModal(false)
	const [isOpenModal2, openModal2, closeModal2] = useModal(false)
	// Confirmación de eliminación de usuario
	async function deleteEmployee(id) {
		// console.log('deleteEmployee', id)
		await Axios.post(`${process.env.REACT_APP_URL}/updateEmployeeStatus`, {
			id
		})
		setFollowUp(!followUp)
		// if (window.confirm('¿Desea eliminar este empleado?'))
		// 	alert('Empleado eliminado')
		// else
		// 	console.log('falso')
	}
	return (
		<div>
			<button className="btn btn-primary my-2" onClick={openModal}>Crear nuevo empleado</button>
			<div>
				<Modal isOpen={isOpenModal} closeModal={closeModal}>
					<Registro empleado={true} />
				</Modal>
			</div>
			<table className="table table-sm">
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Correo</th>
						<th>Cargo</th>
					</tr>
				</thead>
				<tbody>
					{
						empleados.map((e) => {
							return (
								e.status === "activa" &&
								<tr>
									<td>{e.nombre}</td>
									<td>{e.correo}</td>
									<td>{e.tipoUsuario}</td>
									<td>
										<div className="botones">
											<button className="btn btn-primary mx-2" onClick={openModal2}>Editar</button>
											<Modal isOpen={isOpenModal2} closeModal={closeModal2}>
												<ActualizarEmpleado
													nombre={e.nombre}
													correo={e.correo}
													ciudad={e.ciudad}
													direccion={e.direccion}
													pwd={e.pwd}
													tipoUsuario={e.tipoUsuario}
													_id={e._id}
												/>
											</Modal>
											<button className="btn btn-danger" onClick={() => deleteEmployee(e._id)}>Eliminar</button>
										</div>
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