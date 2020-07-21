import React, { useEffect, useState, FormEvent } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';

interface params {
    username: string,
}

interface tests {
    ID: number,
    title: string,
    test: string,
    grade: string,
    authorUsername: string,
    authorName: string
}

interface allTestsResponse {
    data: Array<tests>
}

interface dataResponse {
    data: allTestsResponse
}

export default function TeachersDashboard (): JSX.Element {
    const history = useHistory();

    const params = useLocation<params>();
    const[username, setUsername] = useState(params.state.username);
    const[data, setData] = useState<tests[]>([]);
    const[showpage, setShowPage] = useState(false);

    useEffect(() => {
        api.post("teachers/getAllTestsByUsername", { username }).then((response : dataResponse) => {
            //console.log(response.data.data)
            response.data.data.map(response => {
                response.test = JSON.parse(response.test)
            })

            setData(response.data.data);
        })

    },[])

    useEffect(() => {
        if (data[0]) {
            setShowPage(true)
            console.log(data)
        }
    },[data])

    function showResultsByTest(event: FormEvent, testID : number) {
        event.preventDefault();
        history.push("showResults", { testID })
    }

    function newTestHandler(event: FormEvent) {
        event.preventDefault();
        history.push("newTest", {username});
    }

    if (!showpage) {
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        )
    } else {
        return(
            <div>
                <div className="header-page">
                    <h1>{username.toUpperCase()}</h1>
                </div>
                <div className="newtest-div">
                    <button className="newtest-button" onClick={ e => newTestHandler(e)}>Criar Prova</button>
                </div>
                <div className="tests-container">
                    {data.map(test => {
                        return(
                            <div className="teachers-test-list-div">
                                <h1>{test.title}</h1>
                                <p>Professor: {test.authorName}</p>
                                <p>Série: {test.grade}</p>
                                <button onClick={event => showResultsByTest(event, test.ID)} >Ver resultados</button>
                            </div>    
                        )
                    })}
                </div>
            </div>
        )
    }
    
}