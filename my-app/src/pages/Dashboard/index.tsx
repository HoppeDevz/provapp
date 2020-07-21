import React, { useState, useEffect, useReducer, FormEvent } from 'react';
import api from '../../services/api';
import { useHistory, useLocation } from 'react-router-dom';
import './styles.css';

interface RouteParams {
    username: string;
}

interface UserSchema {
    ID: number
    email: string,
    grade: string,
    lastname: string,
    name: string,
    password: string,
    username: string
}

interface Tests {
    ID: number,
    title: string,
    test: string,
    grade: string,
    authorUsername: string,
    authorName: string,
    completed: boolean
}

export default function Dashboard() {
    const route = useLocation<RouteParams>().state;
    const history = useHistory();

    const[username, setUsername] = useState(route.username);
    const[userSchema, setUserSchema] = useState<UserSchema>();
    const[tests, setTests] = useState<Tests[]>([]);
    const[showpage, setShowPage] = useState(false);

    useEffect(() => {
        api.post("users/getInfoByUsername", { username }).then(res => {
            setUserSchema(res.data.results[0]);
            api.post("users/getAllTestsByGrade", { grade: res.data.results[0].grade }).then(res => {
                setTests(res.data.results)
                const data = res.data.results;
                api.post("users/getAllTestsCompleted", { username }).then(res => {
                    for (let j = 0; j <= data.length; j++) {
                        if (data[j]) {
                            for (let k = 0; k <= res.data.data.length; k++ ) {
                                if (res.data.data[k]) {
                                    if (data[j].ID == res.data.data[k].testID) {
                                        data[j].completed = true;
                                    } else {
                                        data[j].completed = false;
                                    }
                                }
                                
                            }
                        }
                    }

                    /*while (data[0].completed == null) {
                        console.log(data[0].completed)
                        setTimeout(() => {
                            if (data[0].completed !== null) {
                                setShowPage(true)
                            }
                        },500)
                    }*/

                    if (data[0].completed !== null) {
                        setShowPage(true)
                    }

                })
            })
        }).catch(err => {
            throw err;
        }) 
    },[])

    function initTestHandler(event: FormEvent, testInfo : Tests ) {
        event.preventDefault();
        if (!testInfo.completed) {
            history.push("test", {...testInfo, username})
        } else {
            alert("Você já respondeu essa prova!")
        }
        
    }

    if (showpage) {
        return(
            <div>
                <div className="header-page">
                    <h1>{userSchema?.name.toUpperCase() + " " + userSchema?.lastname.toUpperCase()}</h1>
                </div>
    
                <div className="tests-container">
                {tests.map(test => {
                    if (test.completed) {
                        return(
                            <div className="test-list-div">
                                <h1>{test.title}</h1>
                                <p>Professor: {test.authorName}</p>
                                <span className="completed">Completo</span>
                                    <button type='submit' onClick={(event) => initTestHandler(event, { 
                                        ID: test.ID,
                                        title: test.title,
                                        test: test.test,
                                        grade: test.grade,
                                        authorUsername: test.authorUsername,
                                        authorName: test.authorName,
                                        completed: test.completed
                                    })} >Realizar prova</button>
                            </div>
                        )
                    } else {
                        return(
                            <div className="test-list-div">
                                <h1>{test.title}</h1>
                                <p>Professor: {test.authorName}</p>
                                <span className="completed">A fazer</span>
                                <button type='submit' onClick={(event) => initTestHandler(event, { 
                                    ID: test.ID,
                                    title: test.title,
                                    test: test.test,
                                    grade: test.grade,
                                    authorUsername: test.authorUsername,
                                    authorName: test.authorName,
                                    completed: test.completed
                                 })} >Realizar prova</button>
                            </div>
                        )
                    }
                    
                })}
                </div>
                <div className="footer-center">
                    <footer className="footer-page">
                        Desenvolvido por Gabriel Hoppe
                    </footer>
                </div>
            </div>
        )
    } else {
        return(
            <h1>Loading...</h1>
        )
    }
    
}