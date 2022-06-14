import moment from 'moment';
import { Repo } from '../../api/src/models/Repo';
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import './App.css';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Commit } from '../../api/src/models/Commit';

export function App() {
  const repoAPI = 'http://localhost:4000/repos/';
  const [name, setName] = useState<Repo[]>([]);
  const [repoData, setRepoData] = useState<Commit[]>([]);
  const [readMe, setReadMe] = useState<any>(null);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = (data: Repo) => {
    getRepoData(data);
    getReadMe(data);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  useEffect(() => {
    repos();
  }, []);
  //Fetch api data
  const repos = async () => {
    const response = await fetch(repoAPI);
    setName(await response.json());
  };
  const getRepoData = async (data: Repo) => {
    const response = await fetch(
      'https://api.github.com/repos/' + data.full_name + '/commits'
    );
    setRepoData(await response.json());
  };
  const getReadMe = async (data: Repo) => {
    const response = await fetch(
      `https://raw.githubusercontent.com/${data.full_name}/master/README.md`
    );
    setReadMe(await response.text());
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

  //Format date in sorted array
  const sortedArray = formatDate
    .sort((a, b) => {
      return parseInt(b.created_at, 10) - parseInt(a.created_at, 10);
    })
    .reverse();

  //assign language for filter
  const handleChange = (e: any) => {
    const value = e.target.value;
    setFilter(value);
    return filter;
  };

  //filter array by language if "filter" is not == ""
  const filteredArray = sortedArray.filter((a) => {
    if (filter !== '') {
      return a.language === filter;
    } else {
      return sortedArray;
    }
  });

  //Display data within
  function displayData() {
    if (repoData != null && repoData.length > 0) {
      return (
        <>
          <p>{repoData[0].commit.author.name}</p>
          <p>{repoData[0].commit.author.date}</p>
          <p>{repoData[0].commit.message}</p>
        </>
      );
    } else {
      return (
        <>
          <p>Notice: No data found</p>
        </>
      );
    }
  }
  //Check if read me exists and display if so
  function displayReadme() {
    if (readMe != null) {
      return <Markdown>{readMe}</Markdown>;
    } else {
      return (
        <>
          <p>Notice: No README found</p>
        </>
      );
    }
  }

  //Show information in popup. Take login, splice into api, gather api data, display messages and commit.
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <span>
            <p>Filter by Language</p>
            <select defaultValue="" onChange={handleChange}>
              <option value="">Default</option>
              {sortedArray.map((data) => (
                <option key={data.id}>{data.language}</option>
              ))}
              ;
            </select>
          </span>
        </div>
        <ol>
          {filteredArray.map((data) => {
            return (
              <div key={data.id}>
                <li key={data.id}>
                  {
                    <div onClick={() => handleOpen(data)}>
                      <h2>Name: {data.id}</h2>
                      <p>Description: {data.description}</p>
                      <p>Language: {data.language}</p>
                      <p>Forks: {data.forks}</p>
                      <p>Created: {data.created_at}</p>
                    </div>
                  }
                </li>
              </div>
            );
          })}
          <Modal className="modal" open={open}>
            <>
              <Button variant="contained" onClick={() => handleClose()}>
                Close
              </Button>
              <div className="modal-content">{displayData()}</div>
              <div className="modal-content">{displayReadme()}</div>
            </>
          </Modal>
        </ol>
      </header>
    </div>
  );
}
