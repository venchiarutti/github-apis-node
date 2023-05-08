import App from './App';
import dotenv from 'dotenv';

dotenv.config();

const app = new App(process.env.PORT, process.env.AUTH_TOKEN);
app.listen();