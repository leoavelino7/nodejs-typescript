import { Server } from '@overnightjs/core';
import { json } from 'body-parser';
import { Application } from 'express';
import { ForecastController } from './controllers/forecast';
import './util/module-alias'

export class SetupServer extends Server {
  constructor(private port = 3000) {
      super()
  }

  private setupExpress(): void {
    this.app.use(json())
  }

  private setupController(): void {
    const forecastController = new ForecastController()

    this.addControllers([forecastController])
  }

  public getApp(): Application {
    return this.app
  }

  public init(): void {
    this.setupExpress()
    this.setupController()
  }
}