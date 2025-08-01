import morgan from "morgan"
import fs from "fs"
import path from "path"
import type { RequestHandler } from "express"

const logDirectory = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory)
}

// prod
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), {
  flags: 'a'
})

export const logger = (env: string): RequestHandler => {
  if (env === 'production') return morgan('combined', { stream: accessLogStream })
  return morgan('dev')
}