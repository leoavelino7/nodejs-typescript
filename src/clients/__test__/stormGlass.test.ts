import axios from 'axios'

import { StormGlass } from '@src/clients/stormGlass'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json'
import stormGlassNormalizedWeather3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json'

const apiKey = '4d507ecc-8595-11eb-9f69-0242ac130002-4d507f6c-8595-11eb-9f69-0242ac130002'

jest.mock('axios')

describe('StormGlass client', () => {
  it('should return the normalized forecast front the StormGlass service', async () => {
    const lat = -33.792726
    const lng = 151.289854

    axios.get = jest.fn().mockResolvedValue(stormGlassWeather3HoursFixture)

    const stormGlass = new StormGlass(axios, apiKey)
    const response = await stormGlass.fetchPoints(lat, lng)

    console.log(response);

    expect(response).toEqual(stormGlassNormalizedWeather3HoursFixture)
  })
})