export interface UserVM {
  login: string
  authorities: Array<string>
  redirect: string
}

export type User = Partial<UserVM>
