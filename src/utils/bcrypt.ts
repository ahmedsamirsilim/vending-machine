import bcrypt from 'bcrypt'

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  return await bcrypt.hash(password, salt)
}

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}

export const BcryptService = {
  hashPassword,
  comparePassword,
}
