import { useState, useEffect } from 'react'
import { ShowMessage } from './ShowMessage'

import Axios from 'axios'

const Reclamos = ({ data }) => {
	const [reclamos, setReclamos] = useState([])

	useEffect(() => {
		async function effectReclamos() {
			const reclamosData = await Axios.post(`${process.env.REACT_APP_URL}/getReclamos`, {
				numDoc: JSON.parse(localStorage.getItem("banAgrario")).userSession
			})
			// console.log("reclamosData", reclamosData.data)
			setReclamos(reclamosData.data)
		}
		effectReclamos()
	}, [])

	return (
		<div>
			{/* <p>
				Estos son todos tus reclamos, {JSON.parse(localStorage.getItem("banAgrario")).name.replace(/\w+/g, 
				function (w) { 
					return w[0].toUpperCase() + w.slice(1).toLowerCase() 
				})}
			</p>
			<br /> */}
			<table className="table table-striped table-hover">
				<thead>
					<tr>
						<th scope="col"># Reclamo</th>
						<th scope="col">Fecha</th>
						{/* <th scope="col">Monto</th> */}
						<th scope="col">Estado</th>
						<th scope="col">Mensajes</th>
					</tr>
				</thead>
				<tbody>
					{
						reclamos.map((e) => {
							// if (e.estadoReclamo) {
							return (
								<tr key={e._id}>
									<td>{e.numReclamo}</td>
									<td>{
										(e.fecha).substring(0, (e.fecha).indexOf('T'))
									}</td>
									{/* <td>$ {e.monto}</td> */}
									<td>{e.estado}</td>
									<td>
										<ShowMessage msg={e.mensaje} />
									</td>
								</tr>
							)
							// } else { return null }
						})
					}
				</tbody>
			</table>
		</div>
	)
}

export { Reclamos }