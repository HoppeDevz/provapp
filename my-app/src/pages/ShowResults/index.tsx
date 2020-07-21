import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';

interface params {
    testID: number
}

interface personResult {
    username: string,
    name: string,
    result: number,
    total_questions: number
}

interface DataResponse {
    data: Array<personResult>
}

interface ResultResponse {
    data: DataResponse
}

export default function ShowResults (): JSX.Element {
    const params = useLocation<params>();
    const[testID, setTestID] = useState(params.state.testID);
    const[results, setResults] = useState<personResult[]>([]);

    const[alternateresults, setalternateresults] = useState(false);
    const[showpage, setShowPage] = useState(false);
    
    const[voidresults, setVoidresults] = useState(false)

    useEffect(() => {
        api.post("teachers/getTestResults", { testID }).then((response : ResultResponse) => {
            if (response.data.data.length == 0) {
                setVoidresults(true);
                setShowPage(true);
            } else {
                setResults(response.data.data)
            }
            
        })
    },[])

    useEffect(() => {
        if (!alternateresults) { setalternateresults(true) }
        if (alternateresults) {
            console.log(results)
            setShowPage(true);
        }
    },[results])

    if(!showpage) {
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        )
    } else {
        if (showpage && !voidresults) {
            return(
                <div>
                    <div className="header-page">
                        <h1>Resultados da avaliação</h1>
                    </div>
                    <div className="results-page">
                        {results.map(res => {
                            return(
                                <div className="results-container">
                                    <h1>{res.name.toUpperCase()}</h1>
                                    <p>{res.result}/{res.total_questions}</p>
                                </div>    
                            )
                        })}
                    </div>
                </div>
            )
        } else {
            return(
                <div>
                    <div className="header-page">
                        <h1>Resultados da avaliação</h1>
                    </div>
                    <div className="results-page">
                        <h1>Nenhuma resposta</h1>
                    </div>
                </div>
            )
        }
    }
    
}