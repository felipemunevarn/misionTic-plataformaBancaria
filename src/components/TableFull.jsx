import { Outlet } from 'react-router-dom'
import { TableSide } from './TableSide'

export function TableFull({ fechaInicio, fechaFin, idCuenta, onUpdate }) {
	return (
		<div className="row m-0" >
			<div className="col-2 p-0" style={{height:'91.3vh',background:'#606160'}}>
				<TableSide
					fechaInicio={fechaInicio} fechaFin={fechaFin}
					idCuenta={idCuenta} onUpdate={onUpdate} 
				/>
			</div>


			<Outlet />
		</div>
	)
}
