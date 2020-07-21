import React, { useState } from 'react';
import './styles.css';
import api from '../../services/api';

export default function Register() : JSX.Element {
    const[name, setName] = useState("");
    const[lastname, setLastName] = useState("");
    const[username, setUserName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[grade, setGrade] = useState("3em");

    function registerHandler() {
        console.log(name, lastname, username, email, password, grade)
    }

    return(
        <div className="register-page">
            <div className="register-container">
                <h1 className="title-register-container">Cadastrar Aluno</h1>
                <div>
                    <input placeholder="Nome" onChange={event => setName(event.target.value)} />
                    <input placeholder="Sobrenome" onChange={event => setLastName(event.target.value)} />
                </div>
                <input placeholder="Usuário" onChange={event => setUserName(event.target.value)} />
                <input placeholder="Email" type="email" onChange={event => setEmail(event.target.value)} />
                <input placeholder="Senha" type="password" onChange={event => setPassword(event.target.value)} />
                <select onChange={event => setGrade(event.target.value)}>
                    <option value="3em" >3º Ensino Médio</option>
                    <option value="2em" >2º Ensino Médio</option>
                    <option value="1em" >1º Ensino Médio</option>
                </select>
                <button className="register-button" onClick={registerHandler} >Cadastrar</button>
            </div>
        </div>
    )
}