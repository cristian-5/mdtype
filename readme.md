
# MarkDown Typesetting

This software is a markdown typesetting system based on *Deno*.\
It will convert your markdown text into `.html` that you can
then open in Google Chrome and print or save as `.pdf`.\
It can be used to write books, articles and publications.

## Main Goals

The main goal to this project is to overcome the limitations of
the markdown,and completely replace **TeX** with an easier to
use and more powerful system.

## Features

``` md
![pagebreak]
![index]
![author]
![date]
![title]
```

```

## How does it work?

It takes for input a `.json` file with the following structure:

``` json
{
	"title": "Title of the document",
	"author": "Author of the document",
	"date": "Date of publication",
	"format": "A4",
	"orientation": "portrait",
	"margins": {
		"top": "20pt",
		"bottom": "20pt",
		"left": "20pt",
		"right": "20pt"
	},
	"files": [
		"file1.md",
		"file2.md"
	],
	"styles": [
		"style1.css",
		"style2.css"
	],
	"dependencies": [
		"dependency1.js",
		"dependency2.js"
	]
}
```

``` shell
deno run --allow-all mdtype.js project.json
```
