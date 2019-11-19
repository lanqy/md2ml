const {
    readFile,
    writeFile
  } = require('fs');
  const {
    promisify
  } = require('util');
  
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const configFile = 'config.json';
const chalk = require('chalk');





function getCurrentDate() {
    var mm = new Date().getMonth() + 1;
    var dd = new Date().getDate();

    return [new Date().getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('/');
}

async function createPost(o) {
    const config = JSON.parse(await readFileAsync(configFile));
    var path = config.sourceDir.split('/');
    path.pop()
    var p = path.join('/')
    await writeFileAsync(p + '/' + o.file, createMarkdown(o))
    console.log(chalk.bold.green('New Post: ' + o.file + ' create into ' + p))
}

function createMarkdown(o) {
const markdown = 
`---
title: New Post
description: New Post description
created: ${getCurrentDate()}
author: ${o.author ? o.author : 'your name'}
---

# New Post

a New Post
`;
    return markdown
}

module.exports = function create(o) {
    createPost(o)
      .then(function () { })
      .catch(function (error) {
        console.log(error);
      });
  
  }

