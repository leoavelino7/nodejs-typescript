import { Server } from '@overnightjs/core';
import { json } from 'body-parser';
import { Application } from 'express';
import { ForecastController } from './controllers/forecast';
import './util/module-alias';

import * as database from '@src/database'
export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }
  
  public async init(): Promise<void> {
    this.setupExpress();
    this.setupController();
    await this.databaseSetup()
  }

  private setupExpress(): void {
    this.app.use(json());
  }

  private setupController(): void {
    const forecastController = new ForecastController();

    this.addControllers([forecastController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect()
  }

  public getApp(): Application {
    return this.app;
  }

  public async close(): Promise<void> {
    await database.close()
  }

}
