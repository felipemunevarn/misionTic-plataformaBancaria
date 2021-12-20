import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/registro.module.css'

import Axios from 'axios'

const Login = ({ onChange }) => {
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [pwd, setPwd] = useState('')
	const [errGral, setErrGral] = useState('')

	const changeHandlerEmail = (event) => {
		setEmail(event.target.value)
	}

	const changeHandlerPwd = (event) => {
		setPwd(event.target.value)
	}

	const submitHandler = async (event) => {
		event.preventDefault()

		await Axios.post(`${process.env.REACT_APP_URL}/routeUser`, {
			user: email,
			pass: pwd
		})
			.then((response) => {
				if (response.status === 200) {
					localStorage.setItem("banAgrario", JSON.stringify(response.data))
					navigate(
						`/${response.data.url}`, {
						state: response.data.url
					})
					onChange('on');
				} else {
					setErrGral(`Error: ${response.data.result}`)
				}
			})
			.catch((error) => {
				setErrGral("Usuario y/o contraseña incorrectos")
				console.log("E: " + error)
			})
	}

	return (
		<div style={{height:'91.3vh'}}>
			<form className={styles.form} onSubmit={submitHandler}>

				<div className="row">
					<label htmlFor="email" className="col-12 col-form-label">E-mail:</label>
					<div className="col-12">
						<input type="email" name="email" id="email" value={email} placeholder="janedoe@email.com" className="form-control" onChange={changeHandlerEmail} required />
					</div>
				</div>

				<div className="row">
					<label htmlFor="pwd" className="col-12 col-form-label">Contraseña:</label>
					<div className="col-12">
						<input type="password" name="pwd" id="pwd" value={pwd} placeholder="********" className="form-control" onChange={changeHandlerPwd} required />
					</div>
				</div>

				<div className="row">
					<label className="col-form-label"></label>
					<div className="col-12">
						<button type="submit" className="btn btn-primary">Ingresar</button>
						{Boolean(errGral) && <div className="form-text">{errGral}</div>}
					</div>
					<label className="col-form-label"></label>
				</div>

			</form>
		</div>
	)
}

export { Login }