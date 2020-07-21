import { Request, Response } from 'express';
import connection from '../database/connection';

class UserController {
    public async createUser (req: Request, res: Response): Promise<void> {
        const { username, name, lastname, email, password, grade } = req.body;
        
        if (name && lastname && email && password && grade ) {
            connection.query(`SELECT * FROM users_accounts WHERE username = "${username}"`, function (error, results, fields) {
                if (error) { return res.json({
                    createdAccount: false, reason: "Error"
                })};
                if (fields) {  } //read fields
    
                if (results.length > 0 ) {
                    return res.json({
                        createdAccount: false, reason: "Username already exist"
                    })
                } else {
                    connection.query(`SELECT * FROM users_accounts WHERE email = "${email}"`, function(error, results, fields) {
                        if (error) { return res.json({
                            createdAccount: false, reason: "Error"
                        })};
                        if (fields) {  } //read fields
    
                        if (results.length > 0) {
                            return res.json({
                                createdAccount: false, reason: "Email already exist"
                            })
                        } else {
                            //create account
                            connection.query(`INSERT INTO users_accounts (username, name, lastname, email, password, grade) VALUES(
                                "${username}",
                                "${name}",
                                "${lastname}",
                                "${email}",
                                "${password}",
                                "${grade}"
                            )`)
    
                            return res.json({
                                createdAccount: true
                            })
                        }
                    })
                }
            })
        } else {
            res.json({
                createdAccount: false, reason: "data invalid"
            })
        }
    }

    public async Login (req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;
        connection.query(`SELECT * FROM users_accounts WHERE username = "${username}"`, (error, results, fields) => {
            if (results) {
                if (results.length > 0) {
                    if (results[0].password == password) {
                        res.json({
                            login: true
                        })
                    }
                } else {    
                    return res.json({   
                        login: false, reason: "Invalid username/password"
                    })
                }
            } else {
                return res.json({
                    login: false, reason: "Username not found"
                })
            }
        })
    }

    public async ResponseTest (req:Request, res:Response ): Promise<void> {
        const { testID , username, responses } = req.body;

        const formatted_responses = JSON.stringify(responses)

        connection.query(`SELECT * FROM tests_completed WHERE username = '${username}' AND testID = ${testID}`, (error, results, fields) => {
            if (results[0]) {
                return res.json({
                    response: false, reason: "Already response this test"
                })
            } else {
                connection.query(`INSERT INTO tests_completed (testID, username, responses) VALUES (
                    ${testID},
                    '${username}',
                    '${formatted_responses}'
                )`)

                return res.json({
                    response: true
                })
            }
        })
    }

    public async getInfoByUserName (req: Request, res: Response): Promise<void> {
        const {username} = req.body;
        connection.query(`SELECT * FROM users_accounts WHERE username = "${username}"`, 
        (error, results, fields) => {
            if (results) {
                return res.status(200).json({
                    results
                })
            } else {
                res.status(400).json({
                    error : true
                })
            }
        })
    } 

    public async getAllTestsByGrade (req: Request, res: Response) : Promise<void> {
        const { grade } = req.body;
        connection.query(`SELECT * FROM tests WHERE grade = "${grade}"`,
        (error, results, fields) => {
            if (error) return res.status(400).json({ error: true });
            if (results) {
                res.status(200).json({ results })
            }
        })
    } 

    public async getAllTestsCompleted (req: Request, res: Response): Promise<void> {
        const { username } = req.body;
        connection.query(`SELECT * FROM tests_completed WHERE username = "${username}"`,
        (error, results, fields) => {
            if (error) { res.status(400).send({ error: true }) }
            if (results) {
                res.status(200).send({ data: results })
            }
        })
    }
}

export default new UserController();