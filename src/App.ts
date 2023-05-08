import express, { Application, Request, Response } from 'express';
import axios, { AxiosInstance } from 'axios';

export default class App {
    public readonly app: Application;
    private readonly axiosInstance: AxiosInstance;
  
    constructor(private readonly port: string, private readonly authToken: string) {
      this.app = express();
      this.axiosInstance = axios.create({
        baseURL: 'https://api.github.com',
        headers: { Authorization: `Bearer ${this.authToken}` },
      });
  
      this.configureRoutes();
    }
  
    private configureRoutes(): void {
      this.app.get('/api/users', async (req: Request, res: Response) => {
        try {
          const since = req.query.since;
          const response = await this.axiosInstance.get(`/users?since=${since}`);
          res.send(response.data);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error retrieving users');
        }
      });
  
      this.app.get('/api/users/:username/details', async (req: Request, res: Response) => {
        try {
          const username = req.params.username;
          const response = await this.axiosInstance.get(`/users/${username}`);
          res.send(response.data);
        } catch (error) {
          console.error(error);
          if (error.response && error.response.status === 404) {
            res.status(404).send('User not found');
          } else {
            res.status(500).send('Error retrieving user details');
          }
        }
      });
  
      this.app.get('/api/users/:username/repos', async (req: Request, res: Response) => {
        try {
          const username = req.params.username;
          const response = await this.axiosInstance.get(`/users/${username}/repos`);
          res.send(response.data);
        } catch (error) {
          console.error(error);
          if (error.response && error.response.status === 404) {
            res.status(404).send('User not found');
          } else {
            res.status(500).send('Error retrieving user repositories');
          }
        }
      });
    }
  
    public listen(): void {
      this.app.listen(this.port);
    }
  }