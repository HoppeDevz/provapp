import React, { useState, FormEvent } from 'react';
import './styles.css';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';

export default function TeacherLogin() : JSX.Element {
    const history = useHistory();

    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[alert, setAlert] = useState("");

    function loginHandler(event : FormEvent) {
        event.preventDefault();
        api.post("teachers/login", { username, password }).then(response => {
            if (response.data.login) {
                history.push("TeacherDashboard", { username })
            } else {
                setAlert("Senha incorreta!")
                setTimeout(() => {
                    setAlert("");
                },3000)
            }
        })
    }

    return(
        <div className="login-page">
            <img src="https://i.imgur.com/NpdQn5t.jpg" width="800px" height="800px" />
            <div className="login-container">
                <h1 className="login-title">Login Professores</h1>
                <input type="text" placeholder="Usuário" value={username} onChange={event => setUsername(event.target.value)} />
                <input type="password" placeholder="Senha" value={password} onChange={event => setPassword(event.target.value)} />
                <button onClick={event => loginHandler(event)} >Login</button>
                <span>{alert}</span>
            </div>
        </div>
    )
}