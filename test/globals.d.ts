declare namespace NodeJS {
  interface Global {
    testRequest: import('supertest').SuperTest<import('supertest').Test>;
  }

  interface ProcessEnv {
    STORM_GLASS_API_KEY: string
  }
}
