import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Componente({ saludo }) {
  return (
    <h1>{saludo}</h1>
  )
}

ReactDOM.render(
  <Componente saludo="Hola mundo" />,
  document.getElementById('root')
);
