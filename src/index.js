import React from 'react';
import ReactDom from 'react-dom';
import './index.css'

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
            <div className={itemClass}>
                <span className="mark" onClick={this.markDone}>✔</span>
                <span>{this.props.item.text}</span>
                <span className="close" onClick={this.removeItem}>✘</span>
            </div>
        );
    }
}

class ToDoList extends React.Component {
    render() {
        return (
            <div>
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
            <div style={{ padding: 10 }}>
                <form ref="form" onSubmit={this.onSubmit}>
                    <label>
                        <input type="text" ref="itemTodo" />
                    </label>
                    <label>
                        <button type="submit">Add</button>
                    </label>
                </form>
                <div style={{ maringTop: 10 }}>
                    <button
                        style={{ marginRight: 10 }}
                        onClick={this.filterActive}
                    >Active</button>
                    <button
                        onClick={this.filterDone}
                    >Done</button>
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
                text: "to do something",
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

    componentWillMount() {
        this.filterActive();
    }

    render() {
        return (
            <div>
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
}

ReactDom.render(<ToDoApp />, document.getElementById("root"));
