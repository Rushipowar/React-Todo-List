import { useState } from "react";
import { MdSunny } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { IoMoonSharp } from "react-icons/io5";

const todoList = [
  { item: "Jog around the park 3x", id: 1, Done: false },
  { item: "10 minutes meditation", id: 2, Done: false },
  { item: "Read for 1 hour", id: 3, Done: false },
  { item: "Pick up groceries", id: 4, Done: false },
  { item: "Complete Todo App on Frontend Mentor", id: 5, Done: false },
];

export default function App() {
  const [lightTheme, setLightTheme] = useState(false);
  const [todoItems, setTodoItems] = useState(todoList);
  const [activeCard, setActiveCard] = useState(null);

  function HandleTheme() {
    setLightTheme((theme) => !theme);
  }

  function onDrop(position) {
    if (activeCard == null || activeCard === undefined) return;

    const itemToMove = todoItems[activeCard];

    const updatedTodoList = todoItems.filter(
      (item, index) => index !== activeCard
    );

    updatedTodoList.splice(position, 0, itemToMove);

    setTodoItems(updatedTodoList);
  }

  return (
    <div className={`App ${lightTheme ? "light" : ""}`}>
      <Logo onHandleTheme={HandleTheme} lightTheme={lightTheme} />
      <TodoInput lightTheme={lightTheme} setTodoItems={setTodoItems} />
      <TodoList
        todoItems={todoItems}
        lightTheme={lightTheme}
        setTodoItems={setTodoItems}
        setActiveCard={setActiveCard}
        onDrop={onDrop}
      />
      <Footer />
      <Attribution />
    </div>
  );
}

function Logo({ onHandleTheme, lightTheme }) {
  return (
    <div className="logo">
      <h1>TODO</h1>
      <div onClick={onHandleTheme}>
        {lightTheme ? (
          <IoMoonSharp className="logo-icon" />
        ) : (
          <MdSunny className="logo-icon" />
        )}
      </div>
    </div>
  );
}

function TodoInput({ lightTheme, setTodoItems }) {
  const [task, setTask] = useState("");

  function HandleSubmit(e) {
    e.preventDefault();

    const todo = { item: task, id: Date.now(), Done: false };

    setTodoItems((items) => [todo, ...items]);

    setTask("");
  }

  return (
    <form
      className={`form ${lightTheme ? "light" : ""}`}
      onSubmit={HandleSubmit}
    >
      <div className="check-box-form"></div>
      <input
        type="text"
        id="todoInput"
        name="todoInput"
        placeholder="Create a new todo"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
    </form>
  );
}

function TodoList({
  todoItems,
  lightTheme,
  setTodoItems,
  setActiveCard,
  onDrop,
}) {
  const [activeEl, setActiveEl] = useState("All");

  function clearCompletedItems() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all completed items?"
    );

    if (confirmed) setTodoItems(todoItems.filter((item) => !item.Done));
  }

  let sortedItem;

  if (activeEl === "All") {
    sortedItem = todoItems;
  }

  if (activeEl === "Active") {
    sortedItem = todoItems.filter((item) => item.Done === false);
  }
  if (activeEl === "Completed") {
    sortedItem = todoItems.filter((item) => item.Done === true);
  }
  return (
    <div className={`todolist ${lightTheme ? "light" : ""}`}>
      <DropArea onDrop={() => onDrop(0)} />
      {sortedItem.map((item, index) => (
        <>
          <TodoItem
            item={item}
            key={item.id}
            index={index}
            lightTheme={lightTheme}
            todoItems={todoItems}
            setTodoItems={setTodoItems}
            setActiveCard={setActiveCard}
          />

          <DropArea onDrop={() => onDrop(index + 1)} />
        </>
      ))}
      <Stat
        todoItems={todoItems}
        activeEl={activeEl}
        setActiveEl={setActiveEl}
        onClearItems={clearCompletedItems}
      />
    </div>
  );
}

function DropArea({ onDrop }) {
  const [showDrop, setShowDrop] = useState(false);

  return (
    <div
      onDragEnter={() => setShowDrop(true)}
      onDragLeave={() => setShowDrop(false)}
      onDrop={() => {
        onDrop();
        setShowDrop(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      className={showDrop ? "drop_area" : "hide_drop"}
    >
      Drop here
    </div>
  );
}

function TodoItem({
  item,
  lightTheme,
  todoItems,
  setTodoItems,
  index,
  setActiveCard,
}) {
  const completed = item.Done;
  const num = item.id;

  function handleChange() {
    const newTodoItems = todoItems.map((item) =>
      item.id === num ? { ...item, Done: !item.Done } : item
    );
    setTodoItems(newTodoItems);
  }

  function deleteTask() {
    setTodoItems((items) => items.filter((item) => item.id !== num));
  }

  return (
    <div
      className={`todo-item ${lightTheme ? "light" : ""}`}
      draggable
      onDragStart={() => setActiveCard(index)}
      onDragEnd={() => setActiveCard(null)}
    >
      <CheckBox
        lightTheme={lightTheme}
        completed={completed}
        handleChange={handleChange}
        num={num}
      />
      <p className={completed ? "todo-item-completed" : ""}>{item.item}</p>
      <RxCross1
        className={`cross-sign ${lightTheme ? "light" : ""}`}
        onClick={deleteTask}
      />
    </div>
  );
}

function CheckBox({ lightTheme, completed, handleChange, num }) {
  return (
    <div className={`check-box ${lightTheme ? "light" : ""}`}>
      <input
        type="checkbox"
        id={num}
        checked={completed}
        onChange={() => handleChange()}
      />
      <label htmlFor={num}></label>
    </div>
  );
}

function Stat({ todoItems, activeEl, setActiveEl, onClearItems }) {
  const itemsLeft = todoItems.filter((item) => item.Done === false).length;
  return (
    <div className="stat">
      <p>{itemsLeft > 1 ? `${itemsLeft} items ` : `${itemsLeft} item `}left</p>
      <div className="stat-cta">
        <button
          className={activeEl === "All" ? "active" : ""}
          onClick={() => setActiveEl("All")}
        >
          All
        </button>
        <button
          className={activeEl === "Active" ? "active" : ""}
          onClick={() => setActiveEl("Active")}
        >
          Active
        </button>
        <button
          className={activeEl === "Completed" ? "active" : ""}
          onClick={() => setActiveEl("Completed")}
        >
          Completed
        </button>
      </div>
      <button onClick={onClearItems}>Clear completed</button>
    </div>
  );
}
function Footer() {
  return (
    <div className="drag-drop">
      <p>Drag and drop to reorder list</p>
    </div>
  );
}
function Attribution() {
  return (
    <div className="attribution">
      Challenge by{" "}
      <a
        href="https://www.frontendmentor.io?ref=challenge"
        target="_blank"
        rel="noreferrer noopener"
      >
        Frontend Mentor
      </a>
      . Coded by{" "}
      <a href="https://twitter.com/Chukwuyem_ego" rel="noreferrer noopener">
        Rushikesh Powar
      </a>
      .
    </div>
  );
}
