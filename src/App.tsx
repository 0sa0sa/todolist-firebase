import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "./App.css";
import { firestore } from "./firebase";
import { blankTodo, Todo } from "./services/models/todo";

function App() {
  const [inputText, setInputText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    // データ取得.
    const load = async () => {
      const snapshot = await getDocs(collection(firestore, "todos"));
      // snapshot.forEach(doc => {
      //   console.log(doc.id, doc.data());
      // });
      setTodos(
        snapshot.docs.map(todos => {
          return { ...todos.data() };
        }) as Todo[]
      );
    };
    load();

    // realtime 反映.
    onSnapshot(collection(firestore, "todos"), snapshot => {
      // console.log(
      //   "onSnapshot",
      //   snapshot.docs.map(todos => {
      //     return { ...todos.data() };
      //   })
      // );
      setTodos(
        snapshot.docs.map(todos => {
          return { ...todos.data() };
        }) as Todo[]
      );
    });
  }, []);

  const onChangeCreateTodoTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const createNewTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const getId = () => {
      return Math.max(...todos.map(todo => todo.id)) + 1;
    };

    const newTodo = {
      ...blankTodo,
      title: inputText,
      id: getId(),
      checked: false,
      isSoftDeleted: false,
      createdAt: serverTimestamp(),
    };
    console.log("newTodo ", newTodo);
    try {
      await addDoc(collection(firestore, "todos"), newTodo);
      // onSnapshot でTodoが更新されるため、ここで setTodos は使用しない.
      // setTodos(pre => [...pre, newTodo]);
      setInputText("");
    } catch {
      console.error("Error adding Todo", e);
    }
  };

  const onChangeEditTotoTitle = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, title: e.target.value };
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const reverseCheck = (id: number) => {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, checked: !todo.checked };
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const getClickedTodo = async (id: number) => {
    const q = query(collection(firestore, "todos"), where("id", "==", id));
    const snapshot = await getDocs(q);

    // dataは一件しかないはず.
    const data = snapshot.docs.map(todo => {
      // console.log("delete ", todo.id, " ", todo.data())
      return { ref: todo.id, todo: todo.data() as Todo };
    });

    return data;
  };

  const moveTodo = async (id: number) => {
    // const ref = doc(collection(firestore, "todos"));
    // console.log("ref ", ref.id);

    const data = await getClickedTodo(id);
    console.log("data  ", data);

    // const newTodos = todos.filter(todo => todo.id !== id);
    try {
      const ref = doc(firestore, "todos", data[0].ref);

      await updateDoc(ref, {
        ...data[0].todo,
        isSoftDeleted: !data[0].todo.isSoftDeleted,
        softDeletedAt: serverTimestamp(),
      });
      // await deleteDoc(collection(firestore, "todos"), newTodo);
    } catch (e) {
      console.error("Error deleting or returning Todo", e);
    }
  };

  const deleteTodo = async (id: number) => {
    const data = await getClickedTodo(id);
    // NOTE: ドキュメントを削除しても、そのドキュメントのサブコレクションは削除されないので注意.
    deleteDoc(doc(firestore, "todos", data[0].ref));
  };

  return (
    <div className="App">
      <div>
        <h2>TodoList</h2>
        <form onSubmit={e => createNewTodo(e)}>
          <input
            autoFocus
            tabIndex={10}
            type="text"
            onChange={e => onChangeCreateTodoTitle(e)}
            value={inputText}
            className="inputText"
          />
          <input type="submit" value="create" className="submitButton" />
        </form>
        <div className="mainArea">
          <ul className="todoList">
            <span>TODO</span>
            {todos.map(
              todo =>
                !todo.isSoftDeleted && (
                  <li key={todo.id}>
                    <input
                      onChange={e => onChangeEditTotoTitle(todo.id, e)}
                      value={todo.title}
                      disabled={todo.checked}
                    />
                    <input
                      type="checkbox"
                      onClick={() => reverseCheck(todo.id)}
                    />
                    <input
                      type="button"
                      value={"削除"}
                      onClick={() => moveTodo(todo.id)}
                    />
                  </li>
                )
            )}
          </ul>
          <ul className="doneList">
            <span>完了</span>
            {todos.map(
              todo =>
                todo.isSoftDeleted && (
                  <li key={todo.id}>
                    <input
                      onChange={e => onChangeEditTotoTitle(todo.id, e)}
                      value={todo.title}
                      disabled={todo.checked}
                    />
                    <input
                      type="checkbox"
                      onClick={() => reverseCheck(todo.id)}
                    />
                    <input
                      type="button"
                      value={"戻す"}
                      onClick={() => moveTodo(todo.id)}
                    />
                    <input
                      type="button"
                      value={"完全削除"}
                      onClick={() => deleteTodo(todo.id)}
                    />
                  </li>
                )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
