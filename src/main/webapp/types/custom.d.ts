// Attention: only types here - i.e. nothing that would be transpiled into 'real' JS code
declare module "CustomTypes" {

  interface UserVM {
    login: string,
    authorities: Array<string>,
    redirect: string
  }

  type User = Partial<UserVM>

}
