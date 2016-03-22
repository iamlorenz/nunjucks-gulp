# Nunjucks + Gulp Boilerplate

## Getting Started

First of all you will need [gulp.js](http://gulpjs.com) and all the gulp dependencies.

`$ npm install --global gulp`  

```shell
$ cd path/to/nunjucksBoilerplate
$ npm install
```
  
## Gulp Tasks

Run the site on your local server (the browser should reload on every change to a .js and .scss file as well as every .nunjucks template), compile & minify .scss and .js files:  
`$ gulp`

#### Compile all nunjucks files into html:  
`$ gulp nunjucks`

#### Compress and cache images:  

Add images to **./src/images**  
`$ gulp images`

#### Deploy changes to AWS:  

Create the file with the AWS credentials named **./aws.json** in the root of the project, with the following content:  

```json
{
  	"accessKeyId": "[ACCESS KEY GOES HERE]",
  	"secretAccessKey": "[SECRET KEY GOES HERE]",
  	"params": {
    	"Bucket": "hellocode.io"
    },
  	"region": "us-east-1"
}
```
`$ gulp deploy`
 



