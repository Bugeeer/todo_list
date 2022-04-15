import React from 'react'


class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            url: '',
            users_create: []
        }
    }

    handleUserChange(event) {
        if (!event.target.selectedOptions) {
            this.setState({
                users_create: []
            })
            return;
        }

        let users = []
        for (let i = 0; i < event.target.selectedOptions.length; i++) {
            users.push(event.target.selectedOptions.item(i).value)
        }

        this.setState({
            users_create: users
        })
    }


    handleChange(event) {
        this.setState(
            {
                [event.target.name]: event.target.value
            }
        )
    }

    handleSubmit(event) {
        this.props.createProject(this.state.name, this.state.url, this.state.users_create)
        event.preventDefault()
    }


    render() {
        return (
            <div className="text-center">
                <div className="container mt-4">
                    <form onSubmit={(event) => this.handleSubmit(event)}>
                        <div style={{paddingBottom: 20 + 'px'}}>
                            <label for="login">Project name</label>
                            <input type="text" className="form-control" name="name" value={this.state.name}
                                   onChange={(event) => this.handleChange(event)}/>
                        </div>
                        <div style={{paddingBottom: 20 + 'px'}}>
                            <label for="login">Project URL</label>
                            <input type="text" className="form-control" name="url" value={this.state.url}
                                   onChange={(event) => this.handleChange(event)}/>
                        </div>
                        <select style={{width: 180 + 'px'}} name="user" multiple
                                onChange={(event) => this.handleUserChange(event)}>
                            {this.props.users.map((user) => <option
                                value={user.id}> {user.firstName} {user.lastName}</option>)}
                        </select>
                        <div>
                            <input type="submit" className="btn btn-primary" value="Save"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default ProjectForm
