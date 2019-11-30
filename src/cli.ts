import { readFile, writeFile } from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'

import program from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'

import fetch from 'isomorphic-fetch'
import { Dropbox } from 'dropbox'

const read = promisify(readFile)
const write = promisify(writeFile)

const configFile = resolve(__dirname, '../.dropbox')

const initQuestions = [
  {
    // TODO: Use auth instead of accessToken for Dropbox
    name: 'accessToken',
    type: 'input',
    message: 'Enter your access token',
    validate: function( value: any ) {
      return !!value;
    }
  },
  {
    name: 'path',
    type: 'input',
    message: 'Enter your Dropbox remote folder',
    validate: function(value: any) {
      return !!value;
    }
  }
];

const getFiles = async ( accessToken: string, path: string ) => {
  const dbx = new Dropbox({ accessToken, fetch: fetch });  
  const files = await dbx.filesListFolder({ path })
  return files.entries
}

const downloadFile = async (accessToken: string, file: { path: string, rev: string }) => {
  const dbx = new Dropbox({ accessToken, fetch: fetch });  
  const fileContent = await dbx.filesDownload(file)
  return fileContent
}

program
  .version('1.0.0')
  .description('Folder Sync')

program
  .command('init')
  .description('Init the folder configuration')
  .action(() => {
    console.log(chalk.yellow('Only dropbox is supported in this version'))
    
    inquirer.prompt(initQuestions).then(async (config) => {
      // TODO: Check if it was already init
      console.log(chalk.blue('Starting connection'))
      // TODO: Test connection
      // TODO: Show current files in the remote directory
      console.log(chalk.blue('Dropbox connection was successful'))

      const content = JSON.stringify(config, null, 2);
      await write(configFile, content)
    })
  })

program
  .command('pull')
  .description('Download this folder content from Dropbox')
  .action(async () => {
    console.log(chalk.yellow('=========*** Contact Management System ***=========='))
    // TODO: Check if the folder was initialized

    const content = (await read(configFile)).toString('utf8')
    const { accessToken, path } = JSON.parse(content)
    const files = await getFiles(accessToken, path)

    files.forEach(async (file) => {
      const fileData: any = await downloadFile(accessToken, {
        path: file.path_lower,
        rev: (file as any).rev
      })
      write(fileData.name, fileData.fileBinary)
      console.log(chalk.gray(`${fileData.name} was downloaded`))
    })
  })

program
  .command('push')
  .description('Upload this folder content to Dropbox')
  .action(() => {
    console.log(chalk.yellow('=========*** Contact Management System ***=========='))
    // inquirer.prompt(questions).then((answers) =>  actions.addContact(answers))
  })

program.parse(process.argv);