import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import "./styles.css";
import api from '../../services/api';

interface TestInfo {
    ID: number,
    title: string,
    test: string,
    grade: string,
    authorUsername: string,
    authorName: string,
    
    username: string //student username
}

interface testSchema {
    awnser: string,
    correct: string,
    options: Array<string>
}

export default function Test () : JSX.Element {
    const history = useHistory();
    const params = useLocation<TestInfo>();
    
    const[test, SetTest] = useState<testSchema[]>(JSON.parse(params.state.test));
    const[responses, SetResponses] = useState<Array<string>>([]);
    const[defaultOptions, setDefaultOptions] = useState<Array<string>>([]);

    useEffect(() => {
        const testOptions = test;
        const defaultOpt = [];
        for (let k = 0; k <= testOptions.length; k ++ ) {
            if (testOptions[k]) {
                defaultOpt.push(testOptions[k].options[0]);
            }
        } 
        setDefaultOptions(defaultOpt);  
        SetResponses(defaultOpt);     
    },[])

    function finishTestHandler(event : FormEvent) {
        event.preventDefault();
        console.log(responses);
        api.post("/users/ResponseTest", { testID: params.state.ID, username: params.state.username, responses }).then(response => {
            console.log(response);
            if (!response.data.response) {
                if (response.data.reason == "Already response this test") {
                    alert("Você já respondeu esta prova!")
                }
            } else {
                alert("Sua resposta foi enviada com sucesso!")
                history.push("Dashboard", { username: params.state.username })
            }
        })
    }

    function updateOptions(e: ChangeEvent<HTMLSelectElement>, position : number) {
        console.log(e.target.value, position)
        const data = responses;
        data[position] = e.target.value;
        SetResponses(data);
    }
    

    if (!test[0].awnser) {
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        )
    } else {
        return(
            <div className="test-page">
                <div className="test-questions" >
                {test.map(testAwnser => {
                    return(
                        <div className="questions">
                            <h1>{testAwnser.awnser}</h1>
                            <ul className="options">
                                {testAwnser.options.map(option => {
                                    return(
                                        <li value={option} >{option}</li>
                                    )
                                })}
                            </ul>

                                <select className="input-quest" onChange={(event) => updateOptions(event, test.indexOf(testAwnser))}>
                                {testAwnser.options.map(option => {
                                    return(
                                        <option value={option}>{option}</option>  
                                    )
                                })}
                                </select>

                        </div>
                    )
                })}
                <button className="finish-test-button" onClick={finishTestHandler} >Responder</button>
                </div>
            </div>
        )
    }
    
}