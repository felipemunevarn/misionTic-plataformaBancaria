import { useEffect } from 'react';
import { useModal } from "../utils/useModal";
import Modal from "../utils/modal"
import { Registro } from "./Registro"

export function GestionarEmpleado() {

	useEffect(() => {
		//trear la data para cargar la lista de empleados
	})

	const [isOpenModal, openModal, closeModal] = useModal(false)
	// Confirmación de eliminación de usuario
	const confirmacion = () => {
		if (window.confirm('¿Desea eliminar este empleado?'))
			alert('Empleado eliminado')
		else
			console.log('falso')
	}
	return (
		<div>
			<button className="btn btn-primary my-2" onClick={openModal}>Crear nuevo empleado</button>
			{/* Ventana modal de registro y edición */}
			<div>
				<Modal isOpen={isOpenModal} closeModal={closeModal}>
					<Registro />
				</Modal>
			</div>
			<table className="table table-sm">
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Correo</th>
					</tr>
				</thead>
				<tbody>
					{/* MAPEAR LOS EMPLEADOS */}
					<tr>
						<td>John Doe</td>
						<td>johndoe@gmail.com</td>
						<td>
							<div className="botones">
								<button className="btn btn-primary mx-2" onClick={openModal}>Editar</button>
								<button className="btn btn-danger" onClick={confirmacion}>Eliminar</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}