import { ActionBase } from ".."

interface QueueEntry {
  id: number,
  createdAt: string,
  updatedAt: string,
  actionId: number,
  order: number,
  userId: number
  action: ActionBase
}

export type {QueueEntry}