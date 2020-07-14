# Monta CLI
Compiles [Monta](https://www.montajs.com) template files into html files

## Installation
```npm i -g @montajs/cli```

## Usage
```monta```
Compiles all `*.mt` files in the `./views` directory into html files, and writes them to the `./dist` directory.

```monta --watch```
Watches the directory and recompiles on change

```monta --root ./views```
Sets the template root directory

```monta --out ./dist```
Sets the output directory
