import axios from 'axios'
import dotenv from 'dotenv'

import { StormGlass } from '@src/clients/stormGlass'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import stormGlassNormalizedWeather3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json'

dotenv.config()

jest.mock('axios')

describe('StormGlass client', () => {
  it('should return the normalized forecast front the StormGlass service', async () => {
    const lat = 58.7984
    const lng = 17.8081

    axios.get = jest.fn().mockResolvedValue({data: stormGlassWeather3HoursFixture})

    const stormGlass = new StormGlass(axios, process.env.STORM_GLASS_API_KEY)
    const response = await stormGlass.fetchPoints(lat, lng)

    expect(response).toEqual(stormGlassNormalizedWeather3HoursFixture)
  })
})