import prisma from "../db/prismaClient"
import logger from "../logger/logger"
import executeAction from "./executeAction"
import Job from "./job"
import reloadCredits from "./reloadCredits"

class JobManager {
  private jobs = new Map<string, Job>()
  constructor() {
    this.jobs.set(executeAction.name, executeAction)
    this.jobs.set(reloadCredits.name, reloadCredits)
  }

  async startAllJobs() {
    logger.info('Starting all jobs')
    const queueEntryCount = (await prisma.queueEntry.aggregate({
      _count: true
    }))._count
    if(queueEntryCount) {
      this.jobs.get('Actions')!.start()
    } else logger.info('Job [Actions] not started (0 entry in queue)')
    this.jobs.get('Credits')!.start()
  }

  stopAllJobs() {
    logger.info('Shuting down all jobs')
    for(const [jobName, job] of this.jobs) {
      job.stop()
    }
  }

  startJob(jobName: string) {
    const job = this.jobs.get(jobName)
    if(!job) throw new Error(`Unregistered job [${jobName}]`)
    job.start()
  }

  stopJob(jobName: string) {
    const job = this.jobs.get(jobName)
    if(!job) throw new Error(`Unregistered job [${jobName}]`)
    job.stop()
  }
}

export default new JobManager()