import fs from 'fs'
import dashParser from './parsers/meal-master-dash-parser.js'

const file = fs.readFileSync(
  __dirname + '/../recipe-store/accuchef.com/0222-1.TXT'
).toString('utf-8')

dashParser(file)

