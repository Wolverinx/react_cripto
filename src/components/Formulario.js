import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Error from './Error';
import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda';
import axios from 'axios';

const Boton = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;
    &:hover {
        background-color: #326AC0;
        cursor:pointer;
    }
`

const Formulario = ({guardarMoneda,  guardarCriptomoneda }) => {
    // state del listado de criptomonedas
    const [ listacripto, guardarCriptomonedas ] = useState([]);
    const [ error, guardarError] = useState(false);

    const MONEDAS = [
        { codigo: 'CLP', nombre: 'Peso Chileno' },
        { codigo: 'USD', nombre: 'Dolar de Estados Unidos' },
        { codigo: 'MXN', nombre: 'Peso Mexicano' },
        { codigo: 'EUR', nombre: 'Euro' },
        { codigo: 'GBP', nombre: 'Libra Esterlina' }
    ];

    // Utilizar useMoneda
    const [ moneda, SelectMonedas ] = useMoneda('Choose your Currency', '', MONEDAS);
    // utilizar useCriptomoneda
    const [criptomoneda, SelectCripto] = useCriptomoneda('Choose your Cryptocoin', '', listacripto);

    // Ejecutar llamado a la API
    useEffect(() => {
        const consultarAPI = async () => {
            let top = Math.floor(Math.random() * 10) + 1;
            const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=${top}&tsym=USD`;
            const resultado = await axios.get(url);

            guardarCriptomonedas(resultado.data.Data);
        }
        consultarAPI();
    }, []);

    // cuando el usuario hace submit
    const cotizarMoneda = e => {
        e.preventDefault();

        // validar si ambos campos estan llenos
        if(moneda === '' || criptomoneda === '') {
            guardarError(true);
            return;
        }

        // pasar los datos al componente principal
        guardarError(false);

        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
    }


    return ( 
        <form onSubmit={cotizarMoneda}>
            {error ? <Error mensaje="All fields are required" /> : null}
            
            <SelectMonedas />

            <SelectCripto />

            <Boton
                type="submit"
                value="Calcular"
            />
        </form>
     );
}

export default Formulario;