import React, { useState } from 'react';
import BookACall from './screens/BookACall'
import ShowAllEvents from './screens/ShowAllEvents'
import 'bootstrap/dist/css/bootstrap.min.css';

import en from "./locales/en.json";

function App() {
  const [page, setPage] = useState(false)
  return (
    <div>
      <button className="btn" onClick={() => setPage(!page)} style={{ position: "absolute", right: 0, bottom: 0 }}>{en["navigate"]}</button>

      {page ?
        <ShowAllEvents />
        :
        <BookACall />
      }
    </div>
  );
}

export default App;
