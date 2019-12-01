# Remote Folder Sync

**remote-folder-sync** is a npm command line tool to download and upload directories to cloud services (ie: Dropbox)

## Current state: proof of concept (PoC)

**remote-folder-sync** up to now supports only Dropbox. Its aim is to allow synchronization between Emacs and Orgzly. As a proof of concept, there are still several task to do. But there is already a working flow described in this post (TODO: Link post)

## Getting started

### Installation

**Remote Folder Sync** requires [Node.js](https://nodejs.org/) v4+ to run.

Install it as a global package

```sh
$ npm -g install remote-folder-sync
```

### Use

Initialize the folder

```sh
$ cd folder-to-sync
$ remote-folder-sync init
```

Download the latest version of the files

```sh
$ cd folder-to-sync
$ remote-folder-sync pull
```

Upload your changes

```sh
$ cd folder-to-sync
$ remote-folder-sync push
```

## Tips and tricks!

### Custom alias
Setup an alias for remote-folder-sync

```sh
$ alias folder remote-folder-sync
```

That way, instead of:

```sh
$ cd folder-to-sync
$ remote-folder-sync pull
$ remote-folder-sync push
```

Just do:

```sh
$ cd folder-to-sync
$ folder pull
$ folder push
```

## TO DOs

**Remote Folder Sync** is in state PoC. Further improvements can be done

| Priority | TODO |
| ------ | ------ |
| 1 | Check if the file already exist and provides a diff
| 1 | Only uploads changed files
| 2 | Use auth instead of accessToken for Dropbox
| 2 | Check if the folder was initialized
| 3 | Test connection
| 3 | Show current files in the remote directory

### Development

Want to contribute? Great!

**remote-folder-sync** uses Nodesjs + Typescript.

Open your favorite Terminal and run these commands.

Setup the project:
```sh
$ git clone https://github.com/johmsalas/remote-folder-sync.git
$ cd remote-folder-sync
$ yarn install
$ npm link
```

To test the project, run `remote-folder-sync-dev` instead of `remote-folder-sync`, like this:
```sh
$ remote-folder-sync-dev init
$ remote-folder-sync-dev pull
$ remote-folder-sync-dev push
```

License
----

MIT