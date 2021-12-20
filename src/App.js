import { useState, useEffect } from 'react'
import {
	BrowserRouter,
	Routes,
	Route
} from 'react-router-dom'

import data from './utils/data'

import { Landing } from './components/Landing'
import { Footer } from './components/Footer'
import { Login } from './components/Login'
import { NavBar } from './components/NavBar'
import { Error } from './components/ErrorPage'
import { TableFull } from './components/TableFull'
import { Cuentas } from './components/Cuentas'
import { Transferencias } from './components/Transferencias'
import { NuevaCuenta } from './components/NuevaCuenta'
import { CuentasPendientes } from './components/CuentasPendientes'
import { Registro } from './components/Registro'
import { GestionarEmpleado } from './components/GestionarEmpleado'
import { Reclamos } from './components/Reclamos'
import { ManejoCuentas } from './components/ManejoCuentas'
import { HomePanel } from './components/HomePanel'
import { Depositos } from './components/Depositos'
import { ReclamosEmpleado } from './components/ReclamosEmpleado'

// import appStyles from './styles/root.module.css'
import navStyles from './styles/navbar.module.css'
// import logStyles from './styles/login.module.css'

export default function App() {
	const [fechaInicio, setFechaInicio] = useState('')
	const [fechaFin, setFechaFin] = useState('')
	const [idCuenta, setIdCuenta] = useState(0)
	const [session, setSession] = useState('off')

	const updateHandler = (newFechaInicio, newFechaFin, newIdCuenta) => {
		setFechaInicio(newFechaInicio)
		setFechaFin(newFechaFin)
		setIdCuenta(newIdCuenta)
	}

	useEffect(() => {
		setFechaInicio(fechaInicio)
		setFechaFin(fechaFin)
		setIdCuenta(idCuenta)
	}, [fechaInicio, fechaFin, idCuenta])


	const sessionHandler = (estado) => {
		setSession(estado)
	}

	return (
		<>
			<BrowserRouter>
				<NavBar className={navStyles.prueba} session={session} onChange={sessionHandler} />

				<Routes>
					<Route path="/" element={
						<div>
							<Landing />
						</div>
					} />

					<Route path="/login" element={
						<div className="row m-0">
							<div className="col-12 col-lg-6">
								<Login onChange={sessionHandler} />
							</div>
							<div className="col-12 col-lg-6">
								<Registro session={session} onChange={sessionHandler} />
							</div>
						</div>
					} />

					<Route path="/cliente/*" element={
						<TableFull
							onUpdate={updateHandler} fechaInicio={fechaInicio} fechaFin={fechaFin} idCuenta={idCuenta}
						/>
					} >
						<Route path='' element={
							<div className="col-10 p-0" style={{height:'91.3vh'}}>
								<HomePanel />
							</div>}
						/>
						<Route path='Cuentas' element={
							<div className="col-10">
								<Cuentas data={data} />
							</div>}
						/>
						<Route path='Transferencias' element={
							<div className="col-10">
								<Transferencias data={data} fechaInicio={fechaInicio} fechaFin={fechaFin} idCuenta={idCuenta} />
							</div>}
						/>
						<Route path='Reclamos' element={
							<div className="col-10">
								<Reclamos data={data} />
							</div>}
						/>
						<Route path='NuevaCuenta' element={
							<div className="col-10">
								<NuevaCuenta />
							</div>}
						/>
					</Route>

					<Route path="/empleado/*" element={<TableFull />} >
						<Route path='' element={
							<div className="col-10 p-0" style={{height:'91.3vh'}}>
								<HomePanel />
							</div>}
						/>
						<Route path='Depositos' element={
							<div className="col-10">
								<Depositos />
							</div>}
						/>
						<Route path='CuentasPendientes' element={
							<div className="col-9">
								<CuentasPendientes />
							</div>}
						/>
						<Route path='ManejodeCuentas' element={
							<div className="col-10">
								<ManejoCuentas />
							</div>}
						/>
						<Route path='Reclamos' element={
							<div className="col-10">
								Reclamos
							</div>}
						/>
					</Route>

					<Route path="/administrador/" element={<TableFull />}>
						<Route path='' element={
							<div className="col-10 p-0" style={{height:'91.3vh'}}>
								<HomePanel />
							</div>}
						/>
						<Route path='Depositos' element={
							<div className="col-10">
								<Depositos />
							</div>}
						/>
						<Route path='CuentasPendientes' element={
							<div className="col-9">
								<CuentasPendientes />
							</div>}
						/>
						<Route path='ManejodeCuentas' element={
							<div className="col-10">
								<ManejoCuentas />
							</div>}
						/>
						<Route path='Reclamos' element={
							<div className="col-10">
								Reclamos
							</div>}
						/>
						<Route path='GestionarPersonal' element={
							<div className="col-10">
								<GestionarEmpleado />
							</div>}
						/>
					</Route>

					<Route path="*" element={<Error />} />

				</Routes>

				<Footer />
			</BrowserRouter>
		</>
	)
}
