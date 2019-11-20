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

async function getConfig() {
    const config = JSON.parse(await readFileAsync(configFile));
    return config.sourceDir
}

async function createPost(o) {
    const config = await getConfig()
    var path = config.split('/');
    path.pop()
    var p = path.join('/')
    await writeFileAsync(p + '/' + o.file, createMarkdown(o))
    console.log(chalk.bold.green('\n New Post: ' + o.file + ' create into ' + p + '\n'))
}

async function createPage(o) {
    const config = await getConfig()
    const path = config.split('/');
    await writeFileAsync(path[0] + '/' + o.file, createPageMd(o))
    console.log(chalk.bold.green('\n New Page: ' + o.file + ' create into ' + path[0] + '\n'))
}

function createMarkdown(o) {
const markdown = 
`---
title: ${o.title ? o.title : 'post title'}
description: ${o.description ? o.description : 'New post description'}
created: ${getCurrentDate()}
author: ${o.author ? o.author : 'your name'}
---

# New Post

a New Post
`;
    return markdown
}

function createPageMd(o) {
const markdown = 
`---
title: ${o.title ? o.title : 'page title'}
description: ${o.description ? o.description : 'New page description'}
author: ${o.author ? o.author : 'your name'}
---

# New Post

a New Post
`;
    return markdown
}

const post = function(o) {
    createPost(o)
    .then(function () { })
    .catch(function (error) {
    console.log(error);
    });
}

const page = function(o) {
    createPage(o)
    .then(function () { })
    .catch(function (error) {
    console.log(error);
    });
}

module.exports = {
    post,
    page
}


