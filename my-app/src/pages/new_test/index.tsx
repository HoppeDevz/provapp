import React, { useState, FormEvent } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './styles.css';
import api from '../../services/api';

interface Test {
    'awnser': String,
    'options': Array<String>,
    'correct': String
}

interface params {
    username: String
}

interface getTeacherName {
    name: String,
    lastname: String
}

export default function TeachersNewTest() {
    const params = useLocation<params>().state;
    const history = useHistory();
    const[NewTest, SetNewTest] = useState<Test[]>([]);
    const[username, SetUserName] = useState(params.username);

    const[TestTitle, SetTestTitle] = useState("");
    const[Grade, SetGrade] = useState("3em");

    const[quest00, SetQuest00] = useState("");
    const[questA, setQuestA] = useState("");
    const[questB, setQuestB] = useState("");
    const[questC, setQuestC] = useState("");
    const[questD, setQuestD] = useState("");

    const[CorrectOption, SetCorrectOption] = useState(1);
    

    function addQuestion(event: FormEvent) {
        event.preventDefault();
        if (quest00 == "") return alert("Campo da Pergunta Vazio!");

        const questions = []
        if ( questA != "" ) { questions.push(questA) }
        if ( questB != "" ) { questions.push(questB) }
        if ( questC != "" ) { questions.push(questC) }
        if ( questD != "" ) { questions.push(questD) }

        if (!questions[CorrectOption - 1]) return alert("Selecione a opção correta");

        const testadd = { 
            'awnser': quest00,
            'options': questions,
            'correct': questions[CorrectOption - 1]
        }

        const old_value = NewTest;
        const new_value = old_value.push(testadd);

        console.log(NewTest);

        // reset text areas
        SetQuest00("");
        setQuestA("");
        setQuestB("");
        setQuestC("");
        setQuestD("");
    }

    async function RegisterTestHandler(event: FormEvent) {
        event.preventDefault();
        if (TestTitle == "") return alert("Coloque um título para sua avaliação!");
        if (NewTest.length <= 0) return alert("A prova deve ter pelo menos uma questão!");

        const name = await api.post("teachers/getAllInfoByUsername", { username: username })
        //console.log("username", username)

        name.data.name = name.data.name.toUpperCase();
        name.data.lastname = name.data.lastname.toUpperCase();

        api.post("teachers/registerTest", { 
            title: TestTitle,
            test: NewTest,
            grade: Grade,
            authorUsername: username,
            authorName : name.data.name + name.data.lastname
         })

         alert("Avaliação Adicionada com sucesso!")
         setTimeout(() => {
            history.push("TeacherDashboard", { username: username })
         },1500)

         /*console.log({ 
            title: TestTitle,
            test: NewTest,
            grade: Grade,
            authorUsername: username,
            authorName : name.data.name + " " + name.data.lastname
         })*/
    }

    return(
        <div>
            <h1 className="newtest-title">Número de Questões: {NewTest.length}</h1>
            <input placeholder="Título da Avaliação" className="title-of-test" value={TestTitle} onChange={e => SetTestTitle(e.target.value)} />
            <div className="inputs-div-newtest">
                <input placeholder="Pergunta"    value={quest00} onChange={e => SetQuest00(e.target.value)} />
                <input placeholder="Resposta A)" value={questA} onChange={e => setQuestA(e.target.value)} />
                <input placeholder="Resposta B)" value={questB} onChange={e => setQuestB(e.target.value)} />
                <input placeholder="Resposta C)" value={questC} onChange={e => setQuestC(e.target.value)} />
                <input placeholder="Resposta D)" value={questD} onChange={e => setQuestD(e.target.value)} />

                <span className="select-correct-option">Selecione a opção correta:</span>
                <select className="select-element-correct-option" onChange={(e) => console.log(SetCorrectOption(Number(e.target.value)))}>
                    <option value="1" >A)</option>
                    <option value="2" >B)</option>
                    <option value="3" >C)</option>
                    <option value="4" >D)</option>
                </select>

                <button className="addquestion-button" onClick={addQuestion}>Adicionar Questão</button>
            </div>

            <div className="finish-div-newtest">
                <div>
                    <span>Série:</span>
                    <br></br>
                    <select onChange={ e => SetGrade(e.target.value) }>
                        <option value="3em">3EM</option>
                        <option value="2em">2EM</option>
                        <option value="1em">1EM</option>
                    </select>
                </div>
                <button className="newtest-finish-button" onClick={(e) => RegisterTestHandler(e)}>Finalizar</button>
            </div>
        </div>
    )
}