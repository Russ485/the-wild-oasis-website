"use client";

import { useState } from "react";

function Counter({ users }) {
  const [counter, setCounter] = useState(0);

  function increase() {
    setCounter((value) => value + 1);
  }

  function decrease() {
    setCounter((value) => value - 1);
  }

  console.log(users);

  return (
    <div>
      <button onClick={increase}>+</button>
      <div>{counter}</div>
      <button onClick={decrease}>-</button>
      <div>Amount of users is {users.length}</div>
    </div>
  );
}

export default Counter;
