import config from 'config' 

import { InternalError } from "@src/util/errors/internal-error"
import * as HTTPUtil from '@src/util/request'

export interface StormGlassPointSource {
  [key: string]: number
}
export interface StormGlassPoint {
  readonly time: string
  readonly waveHeight: StormGlassPointSource
  readonly waveDirection: StormGlassPointSource
  readonly swellDirection: StormGlassPointSource
  readonly swellHeight: StormGlassPointSource
  readonly swellPeriod: StormGlassPointSource
  readonly windDirection: StormGlassPointSource
  readonly windSpeed: StormGlassPointSource
}
export interface StormGlassForecastResponse {
  hours: StormGlassPoint[]
}

export interface ForecastPoint {
  swellDirection: number
  swellHeight: number
  swellPeriod: number
  time: string
  waveDirection: number
  waveHeight: number
  windDirection: number
  windSpeed: number
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error when trying to communicate to StormGlass'

    super(`${internalMessage}: ${message}`)
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error returned by the StormGlass service'

    super(`${internalMessage}: ${message}`)
  }
}

interface StormGlassConfig {
  apiUrl: string
  apiToken: string
}

const stormGlassResourceConfig = config.get<StormGlassConfig>('App.resources.StormGlass')

export class StormGlass {

  readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed'

  readonly stormGlassAPISource = 'noaa'

  constructor(protected request = new HTTPUtil.Request()) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    try {
      const response = await this.request.get<StormGlassForecastResponse>(`
        ${stormGlassResourceConfig.apiUrl}/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&end=1592113802&lat=${lat}&lng=${lng}
      `, {
        headers: { Authorization: stormGlassResourceConfig.apiToken }
      })
  
      return this.normalizeResponse(response.data)
      
    } catch (error) {
      if (HTTPUtil.Request.isRequestError(error)) {
        throw new StormGlassResponseError(`Error: ${JSON.stringify(error.response.data)} Code: ${error.response.status}`)
      }
      throw new ClientRequestError(error.message)
    }
  }

  private normalizeResponse(points: StormGlassForecastResponse): ForecastPoint[] {

    return points.hours
      .filter(this.isValidPoint.bind(this))
      .map((point) => ({
        time: point.time,
        swellDirection: point.swellDirection[this.stormGlassAPISource],
        swellHeight: point.swellHeight[this.stormGlassAPISource],
        swellPeriod: point.swellPeriod[this.stormGlassAPISource],
        windDirection: point.windDirection[this.stormGlassAPISource],
        windSpeed: point.windSpeed[this.stormGlassAPISource],
        waveDirection: point.waveDirection[this.stormGlassAPISource],
        waveHeight: point.waveHeight[this.stormGlassAPISource]
      }))
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !! (
      point.time &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    )
  }
}