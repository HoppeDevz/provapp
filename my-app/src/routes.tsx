
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Test from './pages/Test';
import Register from './pages/Register';
import TeacherLogin from './pages/TeacherLogin';
import TeachersDashboard from './pages/TeachersDashBoard';
import ShowResults from './pages/ShowResults';
import NewTest from './pages/new_test';

export default function Routes() {
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/dashboard" exact component={Dashboard} />
                <Route path="/test" exact component={Test} />
                <Route path="/register" exact component={Register} />
                <Route path="/teachers/login" exact component={TeacherLogin} />
                <Route path="/teachers/TeacherDashboard" exact component={TeachersDashboard} />
                <Route path="/teachers/ShowResults" exact component={ShowResults} />
                <Route path="/teachers/newTest" exact component={NewTest} />
            </Switch>
        </BrowserRouter>
    )
}