import express from 'express';
import routes from './routes';
import cors from 'cors';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middlewares();
        this.useCors();
        this.routes();
    }

    private useCors() {
        this.express.use(cors());
    }

    private middlewares (): void {
        this.express.use(express.json());
    }

    private routes (): void {
        this.express.use(routes)
    }
}

export default new App().express;