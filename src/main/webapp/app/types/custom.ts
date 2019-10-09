// Attention: only types here - i.e. nothing that would be transpiled into 'real' JS code
export interface UserVM {
  login: string,
  authorities: Array<string>,
  redirect: string
}

export type User = Partial<UserVM>
