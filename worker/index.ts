type PortfolioEnv = {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

export default {
  fetch(request: Request, env: PortfolioEnv) {
    return env.ASSETS.fetch(request)
  },
}
