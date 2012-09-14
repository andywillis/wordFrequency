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

`node chart s:none c:input/common.txt i:input/mjb.txt e:input/mjb_exceptions.txt r:10 b:rainbow p:yes l:0`

### Two

`node chart s:asc c:input/common.txt i:input/mjb.txt e:input/mjb_exceptions.txt r:5 b:red,white,blue p:yes l:3`
