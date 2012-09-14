# Word Frequency Console Charting

An experiment to build (word frequency) bar charts in the console.

This experiment analyses the script for Meet Joe Black, written by Bo Goldman.

## How

Either run the `run.bat` batch file, or run `node chart` with the following parameters in this format:

[single-letter label] [colon] [parameter(s)]

**s** (sort-type) asc | desc | none

**c** (common words list) path

**i** (input file) path

**e** (exceptions file) path

**r** (range - minimum number of characters) integer

**b** (bar colour) a comination of grey|cyan|grey|green|grey|cyan|yellow|blue|red, or rainbow

**p** (run stemmer) yes | no

**l** (define minimum value) integer

## Examples

### One

`node chart s:asc c:input/common.txt i:input/mjb.txt e:input/mjb_exceptions.txt r:12 b:rainbow p:yes l:1`

![chart1](http://dl.dropbox.com/u/80737100/chart1.png)

### Two

`node chart s:asc c:input/common.txt i:input/mjb.txt e:input/mjb_exceptions.txt r:9 b:white,green p:no l:4`

![chart1](http://dl.dropbox.com/u/80737100/chart2.png)

## License

Copyright (C) 2012 Andy Willis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.