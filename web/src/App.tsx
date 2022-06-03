import moment from 'moment';
import React, { useEffect, useState } from 'react';
import './App.css';
interface RepoProperties {
  name: string;
  description: string;
  language: string;
  forks: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_at: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  updated_at: number;
}

export function App() {
  const repoAPI = 'http://localhost:4000/repos/';

  const [name, setName] = useState<RepoProperties[]>([]);

  useEffect(() => {
    repos();
  }, []);

  //Fetch api data
  const repos = async () => {
    const response = await fetch(repoAPI);
    setName(await response.json());
  };

  //Sort array by date in reverse-chronological order
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const formatDate = name.map((data) => {
    const newArray = moment(data.created_at).format('yyyy.MM.dd, h:mm:ss a');
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ...data,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      created_at: newArray,
    };
  });

  const sortedArray = formatDate
    .sort((a, b) => {
      return parseInt(b.created_at, 10) - parseInt(a.created_at, 10);
    })
    .reverse();

  return (
    <div className="App">
      <header className="App-header">
        <ol>
          {sortedArray.map((data) => {
            return (
              <div key={data.created_at}>
                <li key={data.created_at}>
                  {
                    <>
                      <h2>Name: {data.name}</h2>
                      <p>Description: {data.description}</p>
                      <p>Language: {data.language}</p>
                      <p>Forks: {data.forks}</p>
                      <p>Created: {data.created_at}</p>
                    </>
                  }
                </li>
              </div>
            );
          })}
        </ol>
      </header>
    </div>
  );
}
