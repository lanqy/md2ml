# md2ml
A commend line interface for generate static blog easy
## Install
```text
npm i -g md2ml
```
## Usage

### install a blog

```text
md2ml i
```

### Create new post

Create new-post.md with author jack

```text
md2ml create -f 'new-post.md' -a 'jack'
```

### Create new page

Create page.md with author jack

```text
md2ml create -p 'new-post.md' -a 'jack'
```

### Help

```text
md2ml -h
```

### build into html

cd into the folder than you install and run

```text
md2ml build
```
