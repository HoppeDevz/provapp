import { Request, Response } from 'express';
import connection from '../database/connection';

interface correctResponse {
    awnser: string,
    options: Array<string>,
    correct: string
}

interface personResponses {
    ID: number,
    testID: number,
    username: string,
    responses: Array<string>
}

class TeachersController {
    public async login (req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;

        connection.query(`SELECT * FROM teachers_accounts WHERE username = "${username}"`, (error, results, fields) => {
            if (results) {
                if (results.length > 0 ) {
                    if (results[0].password == password) {
                        res.json({
                            login:true
                        })
                    } else {
                        res.json({
                            login:false, reason: "Incorrect Password"
                        })
                    }
                }
            } else {
                return res.json({
                    login: false, reason: "Username/Password not found!"
                })
            }
        })
    }

    public async RegisterTest (req: Request, res: Response): Promise<void> {
        const { title, test, grade, authorUsername, authorName } = req.body;

        const formatted_test = JSON.stringify(test);

        connection.query(`INSERT INTO tests (title, test, grade, authorUsername, authorName) VALUES(
            '${title}',
            '${formatted_test}',
            '${grade}',
            '${authorUsername}',
            '${authorName}'
        )`)

        res.json({
            testCreated: true
        })
    }

    public async getAllInfoByUsername (req: Request, res: Response) : Promise<void> {
        const { username } = req.body;
        connection.query(`SELECT * FROM teachers_accounts WHERE username = '${username}' `, function(error, results, fields) {
            if (error) {
                res.status(200).send({
                    error: true
                })
                console.log(error)
                return
            }

            if (results) {
                if (results[0] && results[0]) {
                    res.status(200).send({
                        name: results[0].name,
                        lastname: results[0].lastname
                    })
                } else {
                    res.status(200).send({
                        name: "",
                        lastname: ""
                    })
                }
            }
        })
    }

    public async getResultsFromTest (req: Request, res: Response) : Promise<void> {
        const { testID } = req.body;

        connection.query(`SELECT * FROM tests_completed WHERE testID = ${testID}`, function(error, results, fields) {
            const data = <Array<Object>>[];
            const reponses = results;
            connection.query(`SELECT * FROM tests WHERE ID = ${testID}`, (error, results, fields) => {
                const test = results[0];

                for (let k = 0; k <= reponses.length; k++ ) {
                    if (reponses[k]) {
                        let resultPerson = 0;
                        let correct_responses = <correctResponse[]>JSON.parse(test.test);
                        let personResponses = JSON.parse(reponses[k].responses);

                        for (let j = 0; j <= correct_responses.length ; j ++ ) {
                            if (correct_responses[j]) {
                                if (personResponses[j] == correct_responses[j].correct) {
                                    resultPerson = resultPerson + 1;
                                }
                            }
                            
                        }

                        connection.query(`SELECT * FROM users_accounts WHERE username = "${reponses[k].username}"`,
                        (error, results, fields) => {
                            data.push({ 
                                username: reponses[k].username, 
                                name: results[0].name + " " + results[0].lastname,
                                result: resultPerson, 
                                total_questions: correct_responses.length,
                             })
                             res.json({
                                data
                            })
                        })
                    } else {
                        if (k == 0) {
                            res.json({
                                data
                            })
                        } 
                    }
                }
            })
        })
    }

    public async getAllTestsByUsername (req:Request, res:Response): Promise<void> {
        const { username } = req.body;
        connection.query(`SELECT * FROM tests WHERE authorUsername = "${username}"`,
        (error, results, fields) => {
            if (error) { return res.json({ error: true }) }
            if (results) {
                return res.status(200).json({ data: results })
            }
        })
    }
}

export default new TeachersController();