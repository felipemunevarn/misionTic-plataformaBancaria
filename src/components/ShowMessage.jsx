import { useModal } from '../utils/useModal'

import Modal from '../utils/modal'

export function ShowMessage({ msg }) {
	const [isOpenModal, openModal, closeModal] = useModal(false)

	return (
		<div>
			{
				<button class="btn btn-danger" onClick={openModal}>Ver mensaje</button>
			}
			<Modal isOpen={isOpenModal} closeModal={closeModal}>
				<p>{msg}</p>
			</Modal>
		</div>
	)
}