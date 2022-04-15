import React from 'react'
import {Link} from 'react-router-dom'


const ToDoListItem = ({item, deleteTodo}) => {
    return (
        <tr>
            <td>{item.id}</td>
            <td>{item.text}</td>
            <td>{item.create}</td>
            <td>{item.project}</td>
            <td>{item.creator}</td>
            <td>
                <button className="col-sm btn btn-danger" onClick={() => deleteTodo(item.id)}
                        type="button">Delete</button>
            </td>
        </tr>
    )
}

const ToDoList = ({items, deleteTodo}) => {
    //console.log(users)
    return (
        <div className="container">
            <table className="table">
                <tr>
                    <th>Id</th>
                    <th>Text</th>
                    <th>Create</th>
                    <th>Project</th>
                    <th>Creator</th>
                </tr>
                {items.filter((item) => item.isActive).map((item) => <ToDoListItem item={item} deleteTodo={deleteTodo}/>)}
            </table>
            <Link class="col-sm btn btn-success" to='/todos/create'>Create</Link>
        </div>
)
}

export default ToDoList