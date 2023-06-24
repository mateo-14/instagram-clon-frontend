export interface AuthData {
  token: string
  id: number
}

export interface LoginErrors {
  errors: {
    error?: string
    password?: string
    username?: string
  }
}

export interface SignUpErrors {
  errors: {
    error?: string
    username?: string
    password?: string
  }
}
