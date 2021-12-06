import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'

import { REG_EMAIL, REG_PWD_VAR } from '../utils/resources'

const REG_PWD = new RegExp(REG_PWD_VAR)

const Login = () => {
	const [email, setEmail] = useState('')
	const [pwd, setPwd] = useState('')
	const [errMail, setErrMail] = useState('')
	const [errPwd, setErrPwd] = useState('')
	const [errGral, setErrGral] = useState('')

	let navigate = useNavigate()

	const changeHandlerEmail = (event) => {
		setEmail(event.target.value)
		const isValid = REG_EMAIL.test(event.target.value.toLowerCase())

		isValid ? setErrMail('') : setErrMail('Email no valido')
	}

	const changeHandlerPwd = (event) => {
		setPwd(event.target.value)
		const isValid = REG_PWD.test(event.target.value)

		isValid ? setErrPwd('') : setErrPwd('La contraseña debe contener mayusculas, numeros, caracteres especiales y estar entre 8 y 15 caracteres')
	}

	const submitHandler = async (event) => {
		event.preventDefault()
		let credentialsMatch = false

		await Axios.get(`${process.env.REACT_APP_URL}/getUsers`)
			.then((response) => {
				response.data.forEach((userLog) => {
					if (userLog.correo === email && userLog.pwd === pwd) {
						console.log(userLog.correo, userLog.pwd)
						credentialsMatch = true
					}
				})
			})
			.catch((error) => {
				console.log(error)
			})

		/*
		const localStorageUsers = localStorage.getItem('GRUPO1_V1')
		let parsedUser
		
		if (!localStorageUsers) {
			localStorage.setItem("GRUPO1_V1", JSON.stringify([]))
			parsedUser = []
		} else {
			parsedUser = JSON.parse(localStorageUsers)
		}
		
		const numUsers = Object.keys(parsedUser).length
		
		if (email === '' || pwd === '') {
			setErrGral('Los campos email y contraseña son requeridos')
		} else if (errMail !== '') {
			setErrGral('No es un email valido')
		} else if (errPwd !== '') {
			setErrGral('No es una contraseña valida')
		} else {
			let credentialsMatch = false
			
			for (let i = 0; i < numUsers; i++) {
				if (parsedUser[i]["email"] === email && parsedUser[i]["pwd"] === pwd) {
					parsedUser[i]["log"] = !parsedUser[i]["log"]
					credentialsMatch = true
					setErrGral('')
				}
			}
			*/
		if (!credentialsMatch) {
			setErrGral('Usuario y/o contraseña incorrecta')
		} else {
			console.log("Datos correctos")
			navigate('/cliente')
		}
	}

	return (
		<div class="col-12 col-lg-6">
			<form className="p-3 my-3 mx-auto" onSubmit={submitHandler}>
				<div className="row">
					<label htmlFor="email" className="col-12 col-form-label">E-mail:</label>
					<div className="col-12">
						<input type="email" name="email" id="email" value={email} placeholder="janedoe@email.com" className="form-control" onChange={changeHandlerEmail} required />
						{Boolean(errMail) && <div className="form-text">{errMail}</div>}
					</div>
				</div>

				<div className="row">
					<label htmlFor="pwd" className="col-12 col-form-label">Contraseña:</label>
					<div className="col-12">
						<input type="password" name="pwd" id="pwd" value={pwd} placeholder="********" className="form-control" onChange={changeHandlerPwd} required />
						{Boolean(errPwd) && <div className="form-text">{errPwd}</div>}
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