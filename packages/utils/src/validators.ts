export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6 && password.length <= 32
}
