import Form from "./Form";
import "./App.css";
import { useState } from "react";

function App() {
  const [takimUyeleri, settakimUyeleri] = useState([]);
  const addUser = (user) => {
    settakimUyeleri([...takimUyeleri, user]);
  };

  return (
    <>
      <div>Users</div>
      <ul>
        {takimUyeleri.map((uye, index) => (
          <li key={index}>
            {uye.name} {uye.email}
          </li>
        ))}
      </ul>
      <div>Form</div>
      <Form addUser={addUser} />
    </>
  );
}

export default App;
