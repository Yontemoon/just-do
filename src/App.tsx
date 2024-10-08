import { FormEvent, useEffect, useState } from "react";
// import "./App.css";
import { userLogin, pb, getTodos } from "./lib/pocketbase";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [todos, setTodos] = useState<[] | null>(null);

  useEffect(() => {
    async function handleTodos() {
      const response = await getTodos();
      setTodos(response);
    }
    handleTodos();
  }, []);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    console.log(email);
    console.log(password);

    try {
      const response = await userLogin(email, password);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSignOut() {
    pb.authStore.clear();
  }

  return (
    <div>
      <div>{pb.authStore.isValid.toString()}</div>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleSignOut}>Sign out</button>
      {JSON.stringify(todos)}
    </div>
  );
}

export default App;
