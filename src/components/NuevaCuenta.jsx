import Axios from 'axios'
import styles from '../styles/registro.module.css'

export function NuevaCuenta() {
	function submitData(initialBalance) {
		Axios.post(`${process.env.REACT_APP_URL}/createAccount`, {
			numDoc: JSON.parse(localStorage.getItem("banAgrario")).userSession,
			numCuenta: Math.floor(Math.random() * (1000000 - 1)).toString(),
			estado: "pendiente",
			balance: initialBalance
		})
			.then((response) => {
				console.log("NuevaCuenta" + response.data)
			})
			.catch((error) => {
				console.log("NuevaCuenta" + error)
			})
	}

	function submitHandler(event) {
		event.preventDefault()
		const ammount = event.target.ammount.value

		submitData(ammount)
	}

	return (
		<form onSubmit={submitHandler} className='col-6 my-3'>
			<label htmlFor="ammount" className='form-label'>Ingrese el monto inicial de su cuenta:</label>
			<input className='form-control' type="number" name="ammount" id="ammount" step="10" min="0" required>
			</input>
			<button className="btn btn-primary mt-2" type="submit">Solicitar cuenta</button>
		</form>
	)
} 