//This holds the URL of the html MARKUS save file
let htmlFile = "";
//This holds the URL of the csv file
let csvFile = "";
//This holds the URL of the output file
let outputFile = "";
//Parse the command line arguments
if (process.argv.length < 4) {
    print("There were too few arguments supplied to the utility. Aborting...\n");
    showHelp();
} else if (process.argv.length > 6) {
    print("There were too many arguments supplied to the utility. Aborting...\n");
    showHelp();
} else {
    //Parse the input and output files
    for (let i = 2; i < process.argv.length; i++) {
        let arg = process.argv[i].toLowerCase().trim();
        if (arg == '-i' || arg == '--input')
            htmlFile = process.argv[i + 1];
        if (arg == '-o' || arg == '--output')
            outputFile = process.argv[i + 1];
    }
}

print("Importing JSDOM...\r");
//Only after checking the command line args start loading the imports, since this prevents alot of time in case of  an error
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
print("Creating JSDOM...\r");
const { window } = new JSDOM(`...`);
print("Importing JQuery...\r");
//Import JQuery, which we will later use to parse the loaded HTML string
const $ = require('jquery')(window);
print("Importing Filesystem library...\r");
//We need filesystem access to read and write the data files
const fs = require('fs');
print("All libraries imported!\n\n");


//See if the input file exists
if (!fs.existsSync(htmlFile)) {
    print("The supplied file '" + htmlFile + "' does not exist. Please check the name and try again...\n");
    process.exit();
}
//Set the CSV file location
csvFile = htmlFile.replace(/\.html/gi, '.csv');
//See if the CSV file exists
if (!fs.existsSync(csvFile)) {
    print("The accompanying mandatory CSV file '" + csvFile + "' does not exist. Please check your naming and try again...\n");
    process.exit();
}
//If the output file is not set, copy the name of the inputfile
if (outputFile.length < 1) {
    outputFile = htmlFile.replace(/\.html/gi, '.json');
}

//Now that we know all the files are correct, let's start the actual process
print(`Loading files...
HTML:   ${htmlFile}
CSV:    ${csvFile}
OUTPUT: ${outputFile}\n`);

//Read both files into memory, then continue the parsing
var html;
var htmlParsed = false;
fs.readFile(htmlFile, "utf-8", (err, data) => {
    if(err) showFileError(htmlFile);
    html = $.parseHTML(data);
    htmlParsed = true;
    print("HTML file loaded!\n");
    startConversion();
});
var csv = {};
var csvParsed = false;
fs.readFile(csvFile, "utf-8", (err, data) => {
    if(err) showFileError(csvFile);
    //Clear the chapters object on the csv object
    csv.chapters = [];
    //Replace any semicolons with a comma, just to catch any excel mishaps
    data = data.replace(/;/g, ',');
    const lines = data.replace(/\r/g, '').split("\n");
    let headerFound = false;
    for(let i = 0; i < lines.length; i++){
        let line = lines[i].trim();
        //Ignore comment lines, they are not necessary
        if(line.startsWith('#')) continue;
        if(!headerFound){
            headerFound = true;
            continue;//Skip the headerline
        }
        let parts = line.split(",");
        //Add it to the list of chapters
        csv.chapters.push({num: parseInt(parts[0]), title: parse[1].trim()});
    }
    csvParsed = true;
    print("CSV file loaded!\n");
    startConversion();
});

/**
 * Starts the actual conversion process after it checks that both data files
 * are done loading.
 */
function startConversion(){
    //Abort conversion untill both data files have been parsed.
    if(!csvParsed || !htmlParsed) return;
}


/**
 * Reports an error while trying to open the provided file. Also
 * immediately quits the process afterwards
 * @param {String} url 
 */
function showFileError(url){
    print("Could not open '" + url + "'. Please check it is not opened in another application...");
    process.exit();
}

/**
 * Shows the help menu and then exits the application
 */
function showHelp() {
    print(`
Welcome to the data parser, originaly developed for the ZGZY document browser. This parser
converts MARKUS .html files, combined with an index of .csv file into a output JSON file
that can be loaded by the browser for easy display.

USAGE:
The command takes only 2 parameter. The name of the HTML file we want to process and the name 
of the output JSON. The CSV should have the same name as the HTML file. An example:

node parse -i ./data/XBC.html -o ./output/XBC.json

This loads the XBC.html file, looks for the XBC.csv file, loads and parses both and combines them
into one .json file, which is saved into the output directory as XBC.json.

PARAMETERS:
-o or --output  sets the output file/directory. If no name is specified it will just output to the
                same directory as the HTML file using the name of the HTML file as a default.
-i or --input   sets the input .html file/directory. If no name is specified the command will fail.
`);
    //And then finally exit
    process.exit();
}

/**
 * Writes the supplied string message to the stdout
 * @param {String} msg 
 */
function print(msg){
    process.stdout.write(msg);
}