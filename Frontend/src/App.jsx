import axios from "axios";
import "./App.css";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <h1 className="text-zinc-900 font-semibold text-4xl">Nitish</h1>
    </>
  );
}

export default App;
