import { useEffect, useState } from 'react';

function App () {
  const [status,setstatus]= useState('chargement...');

  useEffect(() => {
    fetch('http://localhost:3000/health')
        .then((response) => response.json())
        .then((data) => setstatus(data.status))
        .catch(() => setstatus('Erreur API'));
  }, []);
  return(
      <main>
        <h1>JobTrack</h1>
        <p>API : {status}</p>
      </main>
  );
}


export default App
