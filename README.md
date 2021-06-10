# ZGZY Dataparser
To prepare the MARKUS save files for the edition website, we will parse them using this small Node JS utility that cleans the data and removes any unnecessary 
tags. The usage of this tool will also be described in this repository at a later date.

## Usage
Use the python parser on the linking file and the Node js conversion tool on the html and csv files

## Data Requirements
The data needs to contain at least the following:
- The text of all the passages
- The id of every passage, as well as the title
- Any 'normal' MARKUS tags, such as people, places or titles
- The index of that specific text

## Replacing stuff with regex
```
<[cC](\d+.\d+)>  gets replaced by &lt;C$1&gt;
```