import { Router, Request, Response } from 'express';
import axios from 'axios';
import { Repo } from '../models/Repo';
import fs from 'fs-extra';
export const repos = Router();

//declaring ports
const REPOS_API = 'https://api.github.com/users/silverorange/repos';
const LOCAL_REPOS = 'data/repos.json';

//method for pulling data from repos api
async function getAPIRepos() {
  return axios.get(REPOS_API).then(function (response) {
    //Assigning type
    const data: Repo[] = response.data;

    return data;
  });
}
//Get local repo data from repos.json
async function getLocalRepos() {
  const data: Repo[] = await fs.readJson(LOCAL_REPOS);

  return data;
}

repos.get('/', async (_: Request, res: Response) => {
  res.header('Cache-Control', 'no-store');

  //Call data gathering functions
  const reposData = await getAPIRepos();
  // const reposData: any[] = [];
  const localReposData = await getLocalRepos();

  //Create jumbo array
  const aggregateArray = reposData.concat(localReposData);

  res.status(200);

  // TODO: See README.md Task (A). Return repo data here. You’ve got this!
  //Return array here
  res.json(aggregateArray);
});
