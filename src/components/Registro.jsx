import { Formik, Form, Field, ErrorMessage } from 'formik'
import Axios from 'axios'

import { REG_NOM, REG_CIU, REG_NUMDOC, REG_EMAIL, REG_PWD_VAR } from '../utils/resources'

import styles from '../styles/registro.module.css'

const REG_PWD = new RegExp(REG_PWD_VAR)

const Registro = () => {
	return (
		<Formik
			initialValues={{
				nombre: '',
				correo: '',
				tipoDoc: '',
				numDoc: '',
				ciudad: '',
				direccion: '',
				pwd: '',
				fechaExpDoc: '',
				fechaNacimiento: ''
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

				// Validar tipo de documento
				if (!valores.tipoDoc)
					errores.tipoDoc = 'Por favor seleccione su tipo de documento'

				// Validar número de documento
				if (!valores.numDoc)
					errores.numDoc = 'Por favor ingrese su número de documento'
				else if (!REG_NUMDOC.test(valores.numDoc))
					errores.numDoc = 'Longitud máxima de 13 caracteres'

				// Validar fecha de expedición del documento
				if (!valores.fechaExpDoc)
					errores.fechaExpDoc = 'Por favor ingrese la fecha de expedición de su documento'

				// Validar fecha de nacimiento
				if (!valores.fechaNacimiento)
					errores.fechaNacimiento = 'Por favor ingrese su fecha de nacimiento'

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
				Axios.post(`${process.env.REACT_APP_URL}/createUser`, {
					nombre: valores.nombre,
					correo: valores.correo,
					tipoDoc: valores.tipoDoc,
					numDoc: valores.numDoc,
					ciudad: valores.ciudad,
					direccion: valores.direccion,
					pwd: valores.pwd,
					fechaExpDoc: valores.fechaExpDoc,
					fechaNacimiento: valores.fechaNacimiento
				})
					// .then((response) => {
					// console.log(`SUCCESS: ${response.data}`)
					// })
					.catch((error) => {
						console.log(`ERROR: ${error}`)
					})

				resetForm();
				alert('Formulario enviado con éxito');
			}}>

			{({ errors }) => (
				// Formulario
				<div>
					<Form className={styles.form}>
						<div className="row mb-2">
							<div className="col">
								<label className='form-label mb-0' htmlFor='nombre'>Nombre completo:</label>
								<Field className='form-control' id='nombre' type='text' name='nombre' />
								<ErrorMessage name="nombre" component={() => (<p className="error">{errors.nombre}</p>)} />
							</div>
						</div>

						<div className="row mb-2">
							<div className="col">
								<label className='form-label mb-0' htmlFor='documento'>Tipo de documento: </label>
								<Field className='form-control' id='documento' name='tipoDoc' as="select">
									<option value='' disabled selected>Seleccione</option>
									<option value='cedulaCiudadania'>Cedula de ciudadanía</option>
									<option value='cedulaExtranjeria'>Cedula de extranjería</option>
									<option value='pasaporte'>Pasaporte</option>
								</Field>
								<ErrorMessage name="tipoDoc" component={() => (<p className="error">{errors.tipoDoc}</p>)} />
							</div>
						</div>

						<div className="row mb-2">
							<div className="col-12 col-sm-6">
								<label className='form-label mb-0' htmlFor='numDoc'>Número de documento: </label>
								<Field className='form-control' id='numDoc' type='number' name='numDoc' />
								<ErrorMessage name="numDoc" component={() => (<p className="error">{errors.numDoc}</p>)} />
							</div>
							<div className="col-12 col-sm-6">
								<label className='form-label mb-0' htmlFor='fechaExpDoc'>Fecha de expedición: </label>
								<Field className='form-control' id='fechaExpDoc' type='date' name='fechaExpDoc' />
								<ErrorMessage name="fechaExpDoc" component={() => (<p className="error">{errors.fechaExpDoc}</p>)} />
							</div>
						</div>

						<div className="row mb-2">
							<div className="col-12 col-sm-6">
								<label className='form-label mb-0' htmlFor='fechaNacimiento'>Fecha de nacimiento: </label>
								<Field className='form-control' id='fechaNacimiento' type='date' name='fechaNacimiento' />
								<ErrorMessage name="fechaNacimiento" component={() => (<p className="error">{errors.fechaNacimiento}</p>)} />
							</div>
							<div className="col-12 col-sm-6">
								<label className='form-label mb-0' htmlFor='ciudad'>Ciudad: </label>
								<Field className='form-control' id='ciudad' type='text' name='ciudad' />
								<ErrorMessage name="ciudad" component={() => (<p className="error">{errors.ciudad}</p>)} />
							</div>
						</div>

						<div className="row mb-2">
							<div className="col">
								<label className='form-label mb-0' htmlFor='direccion'>Dirección: </label>
								<Field className='form-control' id='direccion' type='text' name='direccion' />
								<ErrorMessage name="direccion" component={() => (<p className="error">{errors.direccion}</p>)} />
							</div>
						</div>

						<div className="row mb-2">
							<div className="col">
								<label className='form-label mb-0' htmlFor='correo'>E-mail: </label>
								<Field className='form-control' id='correo' type='email' name='correo' />
								<ErrorMessage name="correo" component={() => (<p className="error">{errors.correo}</p>)} />
							</div>
						</div>
						<div className="row mb-2">
							<div className="col">
								<label className='form-label mb-0' htmlFor='psswd'>Contraseña: </label>
								<Field className='form-control' id='psswd' type='password' name='pwd' />
								<ErrorMessage name="pwd" component={() => (<p className="error">{errors.pwd}</p>)} />
							</div>
						</div>

						<div className="row">
							<div className="col text-center">
								<input id="btn" className='btn btn-primary' type='submit' value='Registrarme' />
							</div>
						</div>
					</Form>
				</div>
			)}
		</Formik>
	)
}

export { Registro };