import React, { useState } from "react";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { Chat } from "./components/chat/Chat";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-center py-4">Chat App</h1>
      {!user ? (
        <div className="container mx-auto mt-12 text-center px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <Register setUser={setUser} />
            </div>
            <div>
              <Login setUser={setUser} />
            </div>
          </div>
        </div>
      ) : (
        <Chat user={user} />
      )}
    </div>
  );
};

export default App;
