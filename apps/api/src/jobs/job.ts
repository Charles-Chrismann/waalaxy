import logger from "../logger/logger"

class Job {
  private _intervalId: NodeJS.Timeout | null = null
  constructor(
    private _name: string,
    private _interval: number,
    private _job: Function
  ) {}

  get name() {
    return this._name
  }

  get isActive() {
    return !!this._intervalId
  }

  public start() {
    if(this.isActive) return
    logger.info(`Starting job [${this.name}]`)
    this._intervalId = setInterval(() => {
      logger.info(`Running job [${this.name}]`)
      this._job(this.stop)
    }, this._interval)
  }

  public stop = (() => {
    return () => {
      logger.info(`Shutting down job [${this.name}]`)
      if(!this._intervalId) return
      clearInterval(this._intervalId)
      this._intervalId = null
    }
  })()
}

export default Job