import React from 'react';
import axios from "axios";
import logo from './logo.svg';
import './App.css';

import UserList from "./components/User";
import Header from "./components/Header";
import Footer from "./components/Footer";


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            'users': []
        }
    }

    componentDidMount() {
        // const users = [
        //     {
        //         'username': 'TheBoyWhoSurvived',
        //         'first_name': 'Гарри',
        //         'last_name': 'Поттер',
        //     },
        //     {
        //         'username': 'GrandmaKiller',
        //         'first_name': 'Родион',
        //         'last_name': 'Раскольников',
        //     },
        // ]

        axios.get('http://127.0.0.1:8000/api/users/').then(response => {
            const users = response.data
            this.setState(
                {
                    'users': users
                })
        }).catch(error => console.log(error))
    }

    render() {
        return (
            <div>
                <Header />
                <UserList users={this.state.users}/>
                <Footer />
            </div>
        );
    }
}

export default App;
