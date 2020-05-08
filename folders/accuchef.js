import fs from 'fs'
import dashParser from './parsers/meal-master-dash-parser.js'

const file1 = fs
  .readFileSync(__dirname + '/../recipe-store/accuchef.com/0222-1.TXT')
  .toString('utf-8')

const file2 = fs.readFileSync(
  __dirname + '/../recipe-store/accuchef.com/0222-2.TXT'
)

const file3 = fs.readFileSync(
  __dirname + '/../recipe-store/accuchef.com/GERMAN.MMF'
)

const file4 = fs.readFileSync(
  __dirname + '/../recipe-store/accuchef.com/GERMAN.MMF'
)

const parsed1 = dashParser(file1)
const parsed2 = dashParser(file2)
const parsed3 = dashParser(file3)
const parsed4 = dashParser(file4)

console.log(parsed1.length + parsed2.length + parsed3.length + parsed4.length)
