import { readFile, writeFile, readdir } from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'

import program from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'

import fetch from 'isomorphic-fetch'
import { Dropbox } from 'dropbox'

const read = promisify(readFile)
const write = promisify(writeFile)
const ls = promisify(readdir)

const cwd = process.cwd()
const configFile = resolve(cwd, '.dropbox')

const ignore = [
  '.dropbox'
]

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
  const dbx = new Dropbox({ accessToken, fetch });  
  const files = await dbx.filesListFolder({ path })
  return files.entries
}

const downloadFile = async (accessToken: string, file: { path: string, rev: string }) => {
  const dbx = new Dropbox({ accessToken, fetch });  
  const fileContent = await dbx.filesDownload(file)
  return fileContent
}

const uploadFile = async (accessToken: string, path: string, contents: any) => {
  const dbx = new Dropbox({ accessToken, fetch });  
  try {
    dbx.filesUpload({
      path,
      contents
    })    
  } catch (error) {
    console.log({error})
  }
}

program
  .version('1.0.0')
  .description('Remote Folder Sync')

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
    // TODO: Check if the folder was initialized

    const content = (await read(configFile)).toString('utf8')
    const { accessToken, path } = JSON.parse(content)
    
    console.log(chalk.grey(`Downloading ${path}`))

    const files = await getFiles(accessToken, path)

    files.forEach(async (file) => {
      const fileData: any = await downloadFile(accessToken, {
        path: file.path_lower,
        rev: (file as any).rev
      })

      // TODO: Check if the file already exist and provides a diff
      write(fileData.name, fileData.fileBinary)
      console.log(chalk.gray(`${fileData.name} was downloaded`))
    })
  })

program
  .command('push')
  .description('Upload this folder content to Dropbox')
  .action(async () => {
    // TODO: Check if the folder was initialized

    const content = (await read(configFile)).toString('utf8')
    const { path, accessToken } = JSON.parse(content)
    
    console.log(chalk.grey(`Uploading ${path}`))

    const files = await ls(cwd)
    files.forEach(async (name) => {
      // TODO: Only uploads changed files
      if (!ignore.includes(name)) {
        const content = (await read(resolve(cwd, name))).toString('utf8')
        console.log({content})
        await uploadFile(accessToken, `${path}/name`, content)
      }
    })
  })

program.parse(process.argv);