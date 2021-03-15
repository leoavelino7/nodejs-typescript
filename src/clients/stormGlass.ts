import { AxiosStatic } from "axios"

export class StormGlass {

  readonly baseUrl = 'https://api.stormglass.io/v2/weather/point'

  readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed'

  readonly stormGlassAPISource = 'noaa'

  constructor(protected request: AxiosStatic, protected apiKey: string) {}

  public async fetchPoints(lat: number, lng: number): Promise<{}> {
    console.log(`${this.baseUrl}?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&end=1592113802&lat=${lat}&lng=${lng}`);
    
    return this.request.get(`
      ${this.baseUrl}?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&end=1592113802&lat=${lat}&lng=${lng}
    `, {
      headers: { Authorization: this.apiKey }
    })
  }
}