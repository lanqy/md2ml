const path = require('path');
const {
  readFile,
  writeFile
} = require('fs');
const chalk = require('chalk');
const program = require('commander');
const inquirer = require('inquirer');
const shell = require('shelljs');
const figlet = require('figlet');
const {
  parse,
  print
} = require("recast");
const {
  promisify
} = require('util');
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const download = require('download-git-repo');
const ora = require('ora')
const clear = require('clear');
const build = require('./build.js')
const create = require('./create.js')
const template = 'lanqy/blog-template'
var reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

let install = async () => { // download template
  const loading = ora('fetching template......');
  let answer = await inquirer.prompt([{  // input you project name
    type: 'input',
    name: 'projectName',
    message: 'Project name',
    default: 'blog' // default blog
  }]);

  let project = answer.projectName; // project name
  const configFile = process.cwd() + '/' + project + '/' + 'config.json'
  loading.start();
  download(template, process.cwd() + '/' + project, (err) => {
    if (err) {
      console.log(err)
      return;
    }
    console.log(process.cwd() + '/' + project)
    loading.succeed();
  });
  
  let config = await inquirer.prompt([{  // input you site name
    type: 'input',
    name: 'siteName',
    message: 'site name',
    default: 'a blog', 
  }, {  // input you domain name
      type: 'input',
      name: 'baseUrl',
      message: 'enter you website url with http/https',
      validate: function (val) {
        if (reg.test(val)) {
          return true
        } else {
          console.log(chalk.green('Website not valid!'))
        }
      }
    }]);
  let configObj = JSON.parse(await readFileAsync(configFile, 'utf8'));

  const jsonObj = Object.assign(configObj, config)

  await writeFileAsync(configFile, JSON.stringify(jsonObj, null, 1))

}

function entry(cwd = process.cwd(), args) {
  program.command('install')
    .description('install template')
    .alias('i')
    .action(() => {
      install()
    })
  program.command('build')
    .description('building static site')
    .alias('b')
    .action(() => {
      build()
    })
  
  program.command('create')
    .option('-f, --file <type>', 'create a new post', 'post')
    .option('-a, --author <author>', 'please input author name', 'your name')
    .description('create a new post')
    .alias('c')
    .action((cmd, env) => {
      create({
        file: cmd.file,
        author: cmd.author
      })
    })
  program.version('1.0.0', '-v --version').parse(process.argv);
}

module.exports = entry;