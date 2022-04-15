import React from 'react'


class TodoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: this.props.projects[0].id,
            text: '',
            user: this.props.users[0].id }
    }

    handleUserChange(event) {
        if (!event.target.selectedOptions) {
            this.setState({
                user: this.props.users[0]
            })
            return;
        }

        this.setState({
            user: event.target.selectedOptions.item(0).value
        })
    }

    handleProjectChange(event) {
        if (!event.target.selectedOptions) {
            this.setState({
                project: this.props.projects[0]
            })
            return;
        }

        this.setState({
            project: event.target.selectedOptions.item(0).value
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
        this.props.createTodo(this.state.project, this.state.text, this.state.user)
        event.preventDefault()
    }


    render() {
        return (
            <div className="text-center">
                <div className="container mt-4">
                    <form onSubmit={(event) => this.handleSubmit(event)}>
                        <select style={{width: 180 + 'px'}} name="project"
                                onChange={(event) => this.handleProjectChange(event)}>
                            {this.props.projects.map((project) => <option value={project.id}> {project.name} </option>)}
                        </select>

                        <div style={{paddingBottom: 20 + 'px'}}>
                            <label for="login">ToDo text</label>
                            <input type="text" className="form-control" name="text" value={this.state.text}
                                   onChange={(event) => this.handleChange(event)}/>
                        </div>

                        <select style={{width: 180 + 'px'}} name="user"
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

export default TodoForm
