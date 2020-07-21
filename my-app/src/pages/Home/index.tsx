import React, { useState, FormEvent } from 'react';
import './styles.css';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';


export default function Home() {
    const history = useHistory();

    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");

    function loginHandler() {
        const data = {username, password}
        if (username !== "" && password !== "") {
            api.post("users/login", data).then(response => {
                if (response.data.login) {
                    history.push("dashboard", { username })
                } else {
                    alert("Usuário e senha incorretos!")
                }
            })
        } else {
            alert("Campos Vazios!")
        }
        
    }

    function RegisterHandler(e : FormEvent) {
        e.preventDefault();
        history.push("register")
    }

    return(
        <div className="page-login-student">
            <img src="https://i.imgur.com/OxlxnQH.jpg" width="800px" height="500px" />
            <div className="login-container">
                <h1 className="login-title" >Login</h1>
                <input placeholder="Usuário" onChange={event => setUsername(event.target.value)} />
                <input type="password" placeholder="Senha" onChange={event => setPassword(event.target.value)} />
                <button type="submit" onClick={loginHandler}> <FiLogIn size={16} color="white" className="icon-login" /> Login</button>
                <span>Ainda não é cadastrado?</span>
                <a onClick={RegisterHandler}>Cadastrar</a>
            </div>
            <footer className="footer-page">
                Desenvolvido por Gabriel Hoppe
            </footer>
        </div>
    )
}