import React from 'react';
import ReactDom from 'react-dom';
import './index.css'

import { Button } from 'react-bootstrap';

class ToDoItem extends React.Component {
    constructor(props) {
        super(props);
        this.removeItem = this.removeItem.bind(this);
        this.markDone = this.markDone.bind(this);
    }

    removeItem() {
        const index = this.props.index;
        this.props.removeItem(index);
    }

    markDone() {
        const index = this.props.index;
        this.props.markDone(index);
    }

    render() {
        const itemClass = this.props.item.isDone ? "done" : "item";
        return (
            <div className={itemClass + " row"}>
                <div className="col-md-6">
                    <button className="btn-check" onClick={this.markDone}><i className="fa fa-check"></i></button>
                    <span className="display-4">{this.props.item.text}</span>
                    <button className="btn-close" onClick={this.removeItem}><i className="fa fa-close"></i></button>
                </div>
            </div>
        );
    }
}

class ToDoList extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col">
                    {
                        this.props.items.map((item, index) =>
                            <ToDoItem
                                key={index}
                                index={index}
                                item={item}
                                markDone={this.props.markDone}
                                removeItem={this.props.removeItem}
                            />)
                    }
                </div>
            </div>
        );
    }
}

class ToDoForm extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.filterActive = this.filterActive.bind(this);
        this.filterDone = this.filterDone.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        const todoItem = this.refs.itemTodo.value;
        if (todoItem) {
            this.props.addNewItem({ todoItem });
            this.refs.form.reset();
        }
    }

    filterActive() {
        this.props.filterActive();
    }

    filterDone() {
        this.props.filterDone();
    }

    render() {
        return (
            <div
                className="row"
            >
                <div className="col">
                    <div className="row" style={{ marginBottom: 20, marginTop: 20 }}>
                        <div className="col">

                            <form className="form-inline"
                                ref="form"
                                onSubmit={this.onSubmit}
                            >
                                <div class="form-group" style={{ marginRight: 10 }}>
                                    <label style={{ marginRight: 10 }} for="inputItem"><b>Need to do</b></label>
                                    <input type="text" className="form-control" id="inputItem" ref="itemTodo" />
                                </div>
                                <Button type="submit" variant="primary">Add</Button>
                            </form>

                        </div>
                    </div>

                    <div
                        className="row"
                        style={{ maringTop: 10 }}
                    >
                        <Button
                            className="col"
                            style={{ marginRight: 5 }}
                            variant="primary"
                            onClick={this.filterActive}
                        >Active</Button>
                        <Button
                            className="col"
                            style={{ marginLeft: 5 }}
                            variant="warning"
                            onClick={this.filterDone}
                        >Done</Button>
                    </div>
                </div>
            </div>
        );
    }
}

class ToDoApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [{
                text: "something",
                isDone: false,
            }],
            filterList: [],
            isDisplayActive: true,
        }
        this.addNewItem = this.addNewItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.markDone = this.markDone.bind(this);
        this.filterActive = this.filterActive.bind(this);
        this.filterDone = this.filterDone.bind(this);
    }

    addNewItem(newTodoItem) {
        const newItemList = this.state.items.slice();
        newItemList.unshift({
            text: newTodoItem.todoItem,
            isDone: false,
        });

        this.setState({
            items: newItemList,
            filterList: newItemList.slice().filter(item => !item.isDone),
            isDisplayActive: true,
        });
    }

    removeItem(index) {
        const newItemList = this.state.items.slice();
        newItemList.splice(index, 1);

        var filterList;
        const isDisplayActive = this.state.isDisplayActive;
        if (isDisplayActive) {
            filterList = newItemList.slice().filter(item => !item.isDone);
        } else {
            filterList = newItemList.slice().filter(item => item.isDone);
        }

        this.setState({
            items: newItemList,
            filterList: filterList,
        });
    }

    markDone(index) {
        const newItemList = this.state.filterList.slice();
        const markedItem = newItemList[index];
        markedItem.isDone = !markedItem.isDone;

        var filterList;
        const isDisplayActive = this.state.isDisplayActive;
        if (isDisplayActive) {
            filterList = newItemList.slice().filter(item => !item.isDone);
        } else {
            filterList = newItemList.slice().filter(item => item.isDone);
        }

        this.setState({
            filterList: filterList,
        });
    }

    filterActive() {
        const newItemList = this.state.items.slice().filter(item => !item.isDone);
        this.setState({
            filterList: newItemList,
            isDisplayActive: true
        });
    }

    filterDone() {
        const newItemList = this.state.items.slice().filter(item => item.isDone);
        this.setState({
            filterList: newItemList,
            isDisplayActive: false
        });
    }

    render() {
        return (
            <div className="container">
                <ToDoForm
                    addNewItem={this.addNewItem}
                    filterActive={this.filterActive}
                    filterDone={this.filterDone}
                />
                <ToDoList
                    items={this.state.filterList}
                    markDone={this.markDone}
                    removeItem={this.removeItem}
                />
            </div>
        );
    }

    componentDidMount() {
        this.filterActive();
    }
}

ReactDom.render(<ToDoApp />, document.getElementById("root"));
