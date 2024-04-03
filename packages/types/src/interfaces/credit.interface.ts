import { ActionBase } from ".."

interface Credit {
  id: number,
  creditsCount: number,
  action: ActionBase
}

export type {Credit}