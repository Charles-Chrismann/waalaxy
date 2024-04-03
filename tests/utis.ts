export default class Utils {
  static checkQueueEntry(queueEntry: any) {
    return (
      typeof queueEntry.id === 'number'
      && typeof queueEntry.createdAt === 'string'
      && typeof queueEntry.updatedAt === 'string'
      && typeof queueEntry.actionId === 'number'
      && typeof queueEntry.order === 'number'
      && typeof queueEntry.action?.id === 'number'
      && typeof queueEntry.action?.name === 'string'
      && typeof queueEntry.action?.maxCreditsCount === 'number'
    )
  }
}