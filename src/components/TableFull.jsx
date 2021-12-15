import React from 'react';
import {
	Outlet
  } from 'react-router-dom';

import { TableSide } from './TableSide';

export function TableFull({ fechaInicio, fechaFin, idCuenta, onUpdate }) {
	return (
		// <BrowserRouter>
		<div className="row m-0">
			<div className="col-3 p-0">
				<TableSide 
					fechaInicio={fechaInicio} fechaFin={fechaFin} 
					idCuenta={idCuenta} onUpdate={onUpdate} 
				/>
			</div>
			<Outlet/> 
		</div> 
	)
}
