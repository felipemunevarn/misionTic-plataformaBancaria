import { useModal } from '../utils/useModal'

import Axios from 'axios'

import Modal from '../utils/modal'

const CancelCtaModal = ({ cuenta, dis }) => {
	const [isOpenModal, openModal, closeModal] = useModal(false)

	async function cancelRequest(e) {
		e.preventDefault()

		const cancelResult = await Axios.post(`${process.env.REACT_APP_URL}/requestCancelAccount`, {
			cuenta: cuenta.cuenta
		})

		if (cancelResult.data === "succeed") {
			alert(`En la brevedad un asesor confirmara la cancelacion de la cuenta ${cuenta.cuenta}`)
		}
	}

	return (
		<div>
			{Boolean(dis)
				? <button class="btn btn-danger" onClick={openModal} disabled>Cancelar</button>
				: <button class="btn btn-danger" onClick={openModal}>Cancelar</button>
			}
			<Modal isOpen={isOpenModal} closeModal={closeModal}>

				<form>
					<div className="row">
						<label htmlFor="origen" className="form-label">
							{`Por favor confirme que quiere cancelar la cuenta ${cuenta.cuenta}`}
						</label>
					</div>
					<button type="submit" onClick={cancelRequest}>Aceptar</button>
				</form>

			</Modal>
		</div>
	)
}

export default CancelCtaModal