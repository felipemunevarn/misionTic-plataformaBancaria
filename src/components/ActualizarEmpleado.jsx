import { Formik, Form, Field, ErrorMessage } from 'formik'
import Axios from 'axios'

import { REG_NOM, REG_CIU, REG_NUMDOC, REG_EMAIL, REG_PWD_VAR } from '../utils/resources'

import styles from '../styles/registro.module.css'

const REG_PWD = new RegExp(REG_PWD_VAR)

export function ActualizarEmpleado({
	nombre,
	correo,
	ciudad,
	direccion,
	pwd,
	tipoUsuario,
	_id
}) {
	return (
		<Formik
			initialValues={{
				nombre: '',
				correo: '',
				ciudad: '',
				direccion: '',
				pwd: ''
			}}

			validate={(valores) => {
				let errores = {};
				// Validar nombre
				if (!valores.nombre)
					errores.nombre = 'Por favor ingrese un nombre'
				else if (!REG_NOM.test(valores.nombre))
					errores.nombre = 'Nombre no válido. Solo se permiten letras, longitud máxima de 100 caracteres'

				// Validar correo
				if (!valores.correo)
					errores.correo = 'Por favor ingrese un correo'
				else if (!REG_EMAIL.test(valores.correo))
					errores.correo = 'Email no válido'

				// Validar ciudad
				if (!valores.ciudad)
					errores.ciudad = 'Por favor ingrese su ciudad de residencia'
				else if (!REG_CIU.test(valores.ciudad))
					errores.ciudad = 'Solo se permiten letras, longitud máxima de 70 caracteres'

				// Validar número dirección
				if (!valores.direccion)
					errores.direccion = 'Por favor ingrese su dirección de residencia'
				else if (valores.direccion.length > 70)
					errores.direccion = 'Longitud máxima de 70 caracteres'

				// Validar contraseña
				if (!valores.pwd)
					errores.pwd = 'Por favor ingrese una contraseña'
				else if (!REG_PWD.test(valores.pwd))
					errores.pwd = 'La contraseña debe contener mayusculas, numeros, caracteres especiales y estar entre 8 y 15 caracteres'

				return errores;
			}}

			onSubmit={(valores, { resetForm }) => {
				Axios.post(`${process.env.REACT_APP_URL}/updateUser`, {
					id: _id,
					nombre: valores.nombre,
					correo: valores.correo,
					ciudad: valores.ciudad,
					direccion: valores.direccion,
					tipoUsuario,
					pwd: valores.pwd,
				})
					// .then((response) => {
					// 	console.log(`SUCCESS: ${response.data}`)
					// })
					.catch((error) => {
						console.log(`ERROR: ${error}`)
					})

				resetForm();
				alert('Formulario enviado con éxito');
			}}>

			{({ errors }) => (
				// Formulario
				<div style={{ height: '91.3vh' }}>
					<Form className={styles.form}>
						<div className="row mb-2">
							<div className="col">
								<label className='form-label mb-0' htmlFor='nombre'>Nombre completo:</label>
								{/* <Field className='form-control' id='nombre' type='text' name='nombre' value={nombre || ''} /> */}
								<Field className='form-control' id='nombre' type='text' name='nombre' />
								<ErrorMessage name="nombre" component={() => (<p className="error">{errors.nombre}</p>)} />
							</div>
						</div>

						<div className="row mb-2">
							<div className="col">
								<label className='form-label mb-0' htmlFor='direccion'>Dirección: </label>
								{/* <Field className='form-control' id='direccion' type='text' name='direccion' value={direccion || ''} /> */}
								<Field className='form-control' id='direccion' type='text' name='direccion' />
								<ErrorMessage name="direccion" component={() => (<p className="error">{errors.direccion}</p>)} />
							</div>
							<div className="col-12 col-sm-6">
								<label className='form-label mb-0' htmlFor='ciudad'>Ciudad: </label>
								{/* <Field className='form-control' id='ciudad' type='text' name='ciudad' value={ciudad || ''} /> */}
								<Field className='form-control' id='ciudad' type='text' name='ciudad' />
								<ErrorMessage name="ciudad" component={() => (<p className="error">{errors.ciudad}</p>)} />
							</div>
						</div>

						<div className="row mb-2">
							<div className="col">
								<label className='form-label mb-0' htmlFor='correo'>E-mail: </label>
								{/* <Field className='form-control' id='correo' type='email' name='correo' value={correo || ''} /> */}
								<Field className='form-control' id='correo' type='email' name='correo' />
								<ErrorMessage name="correo" component={() => (<p className="error">{errors.correo}</p>)} />
							</div>
						</div>
						<div className="row mb-2">
							<div className="col">
								<label className='form-label mb-0' htmlFor='psswd'>Contraseña: </label>
								{/* <Field className='form-control' id='psswd' type='password' name='pwd' value={pwd || ''} /> */}
								<Field className='form-control' id='psswd' type='password' name='pwd' />
								<ErrorMessage name="pwd" component={() => (<p className="error">{errors.pwd}</p>)} />
							</div>
						</div>

						<div className="row">
							<div className="col text-center">
								<input id="btn" className='btn btn-primary' type='submit' value='Actualizar' />
							</div>
						</div>
					</Form>
				</div>
			)}
		</Formik>
	)
}