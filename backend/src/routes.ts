import express from 'express';
import UserController from './controllers/UserController';
import TeachersController from './controllers/TeachersController';


const routes = express.Router();

routes.use("/users/createUser", UserController.createUser);
routes.use("/users/login", UserController.Login);
routes.use("/users/responseTest", UserController.ResponseTest);
routes.use("/users/getInfoByUsername", UserController.getInfoByUserName);
routes.use("/users/getAllTestsByGrade", UserController.getAllTestsByGrade);
routes.use("/users/getAllTestsCompleted", UserController.getAllTestsCompleted);

//teachers
routes.use("/teachers/login", TeachersController.login);
routes.use("/teachers/registerTest", TeachersController.RegisterTest);
routes.use("/teachers/getTestResults", TeachersController.getResultsFromTest);
routes.use("/teachers/getAllTestsByUsername", TeachersController.getAllTestsByUsername);
routes.use("/teachers/getAllInfoByUsername", TeachersController.getAllInfoByUsername);


export default routes;