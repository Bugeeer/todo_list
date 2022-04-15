import React from 'react';
import axios from "axios";
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
}
    from "react-router-dom";
import UserList from "./components/User"
import Navbar from "./components/Header"
import Footer from "./components/Footer"
import {ProjectList, ProjectDetail} from './components/Project.js'
import ToDoList from './components/ToDo.js'
import LoginForm from './components/Auth.js'
import ProjectForm from './components/ProjectForm'
import TodoForm from './components/TodoForm'


const DOMAIN = 'http://127.0.0.1:8001/api/'
const get_url = (url) => `${DOMAIN}${url}`


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            navbarItems: [
                {name: 'Users', href: '/'},
                {name: 'Projects', href: '/projects'},
                {name: 'TODOs', href: '/todos'},
            ],
            users: [],
            projects: [],
            project: {},
            todos: [],
            auth: {username: '', is_login: false},
        }
    }

    login(username, password) {
        console.log(username, password)
        axios.post(get_url('token/'), {username: username, password: password})
            .then(response => {
                const result = response.data
                const access = result.access
                const refresh = result.refresh
                localStorage.setItem('login', username)
                localStorage.setItem('access', access)
                localStorage.setItem('refresh', refresh)
                this.setState({'auth': {username: username, is_login: true}})
                this.load_data()
            }).catch(error => {
            if (error.response.status === 401) {
                alert('Неверный логин или пароль')
            } else {
                console.log(error)
            }
        })
    }

    logout() {
        localStorage.setItem('login', '')
        localStorage.setItem('access', '')
        localStorage.setItem('refresh', '')
        this.setState({'auth': {username: '', is_login: false}})
    }

    load_data() {
        let headers = {
            'Content-Type': 'application/json'
        }
        console.log(this.state.auth)
        if (this.state.auth.is_login) {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        axios.get(get_url('users/'), {headers})
            .then(response => {
                this.setState({users: response.data})
            }).catch(error => {
            this.setState({users: []})
            console.log(error)
        })

        axios.get(get_url('projects/', {headers}))
            .then(response => {
                this.setState({users: response.data})
            }).catch(error => {
            this.setState({projects: []})
            console.log(error)
        })

        axios.get(get_url('todos/', {headers}))
            .then(response => {
                this.setState({users: response.data})
            }).catch(error => {
            this.setState({todos: []})
            console.log(error)
        })
    }

    componentDidMount() {

        // Получаем значения из localStorage
        const username = localStorage.getItem('login')
        if ((username !== "") & (username != null)) {
            this.setState({'auth': {username: username, is_login: true}}, () => this.load_data())
        }
    }

    deleteProject(id) {
        const headers = this.get_headers()
        axios.delete(get_url(`projects/${id}`), {headers}).then(
            response => {
                this.load_data()

            }
        ).catch(error => {
            console.log(error)
            this.setState({projects: []})
        })

    }

    deleteTodo(id) {
        const headers = this.get_headers()
        axios.delete(get_url(`todos/${id}`), {headers}).then(
            response => {
                this.load_data()

            }
        ).catch(error => {
            console.log(error)
            this.setState({todos: []})
        })

    }

    createProject(name, url, users) {
        const headers = this.get_headers()
        const data = {name: name, url: url, users: users}
        console.log(data)

        axios.post(get_url('project/'), data, {headers}).then(
            response => {
                this.load_data()
            }
        ).catch(error => {
            console.log(error)
            this.setState({projects: []})
        })

    }

    createTodo(project, text, user) {
        const headers = this.get_headers()
        const data = {project: project, text: text, user: user}
        console.log(data)

        axios.post(get_url('todo/'), data, {headers}).then(
            response => {
                this.load_data()
            }
        ).catch(error => {
            console.log(error)
            this.setState({todos: []})
        })

    }

    render() {
        return (
            <Router>
                <header>
                    <Navbar navbarItems={this.state.navbarItems} auth={this.state.auth} logout={() => this.logout()}/>
                </header>
                <main role="main" class="flex-shrink-0">
                    <div className="container">
                        <Router>
                            <Route exact path='/'>
                                <UserList users={this.state.users}/>
                            </Route>
                            <Route exact path='/projects' component={() => <ProjectList projects={this.state.projects}
                                                                                        deleteProject={(id) => this.deleteProject(id)}/>}/>
                            <Route exact path='/todos'>
                                <ToDoList items={this.state.todos}
                                          deleteTodo={(id) => this.deleteTodo(id)}/>
                            </Route>
                            <Route exact path='/login'>
                                <LoginForm login={(username, password) => this.login(username, password)}/>
                            </Route>
                            <Route path="/projects/:id"
                                   children={<ProjectDetail getProject={(id) => this.getProject(id)}
                                                            item={this.state.project}/>}/>

                            <Route exact path='/projects/create' component={
                                () => <ProjectForm
                                    users={this.state.users}
                                    createProject={(name, url, users) => this.createProject(name, url, users)}/>}/>

                            <Route exact path='/todos/create' component={
                                () => <TodoForm
                                    projects={this.state.projects}
                                    users={this.state.users}
                                    createTodo={(project, text, user) => this.createTodo(project, text, user)}/>}/>

                        </Router>
                    </div>
                </main>
                <Footer/>
            </Router>


        )
    }

    getProject(id) {

        let headers = {
            'Content-Type': 'application/json'
        }
        console.log(this.state.auth)
        if (this.state.auth.is_login) {
            const token = localStorage.getItem('access')
            headers['Authorization'] = 'Bearer ' + token
        }

        axios.get(get_url(`/api/projects/${id}`), {headers})
            .then(response => {
                this.setState({project: response.data})
            }).catch(error => console.log(error))
    }
}


export default App;
