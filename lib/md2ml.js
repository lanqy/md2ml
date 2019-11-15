const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const program = require('commander');
const inquirer = require('inquirer');
const shell = require('shelljs');
const figlet = require('figlet');
const {
  parse,
  print
} = require("recast");
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const download = require('download-git-repo');
const ora = require('ora')
const clear = require('clear');
const build = require('./build.js')
const template = 'lanqy/blog-template'
let install = async () => { // download template
  let loading = ora(chalk.green('fetching template......'));
  let answer = await inquirer.prompt([{  // input you project name
    type: 'input',
    name: 'projectName',
    message: 'Project name',
    default: 'blog' // default blog
    // validate: function(val) {
    //   console.log(val)
    // }
  }]);

  let project = answer.projectName; // project name
  loading.start();
  download(template, process.cwd() + '/' + project, (err) => {
    if (err) {
      console.log(err)
      return;
    }
    console.log(process.cwd() + '/' + project)
    loading.succeed();
  });
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
  program.version('1.0.0', '-v --version').parse(process.argv);
}

module.exports = entry;