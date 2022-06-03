import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import './App.css';

interface RepoProperties {
  name: string;
  description: string;
  language: string;
  forks: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_at: number;
}

export function App() {
  const repoAPI = 'http://localhost:4000/repos/';

  const [name, setName] = useState<RepoProperties[]>([]);

  useEffect(() => {
    repos();
  }, []);

  const repos = async () => {
    const response = await fetch(repoAPI);

    setName(await response.json());
  };
  //Sort array by date in reverse-chronological order
 

  return (
    <div className="App">
      <header className="App-header">
        <ol>
          {name.map((data) => {
            return (
              <div key={data.created_at}>
                <li key={data.created_at}>
                  <h2>Name: {data.name}</h2>
                  <p>Description: {data.description}</p>
                  <p>Language: {data.language}</p>
                  <p>Forks: {data.forks}</p>
                  <p>Created: {data.created_at}</p>
                </li>
              </div>
            );
          })}
        </ol>
      </header>
    </div>
  );
}
