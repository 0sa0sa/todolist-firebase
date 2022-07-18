import React, { useState } from "react";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  type Todo = {
    inputValue: string;
    id: number;
    checked: boolean;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTodo = {
      inputValue: inputText,
      id: inputText.length,
      checked: false,
    };
    setTodos(pre => [...pre, newTodo]);
    setInputText("");
  };

  const handleEdit = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, inputValue: e.target.value };
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleClick = (id: number) => {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, checked: !todo.checked };
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleDelete = (id: number) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
  };

  return (
    <div className="App">
      <div>
        <h2>TodoList</h2>
        <form onSubmit={e => handleSubmit(e)}>
          <input
            autoFocus
            tabIndex={10}
            type="text"
            onChange={e => handleChange(e)}
            value={inputText}
            className="inputText"
          />
          <input type="submit" value="create" className="submitButton" />
        </form>
        <ul className="todoList">
          {todos.map(todo => (
            <li key={todo.id}>
              <input
                onChange={e => handleEdit(todo.id, e)}
                value={todo.inputValue}
                disabled={todo.checked}
              />
              <input type="checkbox" onClick={() => handleClick(todo.id)} />
              <input
                type="button"
                value={"削除"}
                onClick={() => handleDelete(todo.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
