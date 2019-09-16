//Import JSDOM, which we need for JQuery to work
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`...`);
//Import JQuery, which we will later use to parse the loaded HTML string
const $ = require('jquery')(window);
//We need filesystem access to read and write the data files
const fs = require('fs');

//This holds the URL of the html MARKUS save file
let htmlFile = "";
//This holds the URL of the csv file
let csvFile = "";
//This holds the URL of the output file
let outputFile = "";
//Parse the command line arguments
if (process.argv.length < 4) {
    console.log("There were too few arguments supplied to the utility. Aborting...");
    showHelp();
} else if (process.argv.length > 6) {
    console.log("There were too many arguments supplied to the utility. Aborting...");
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

//See if the input file exists
if (!fs.existsSync(htmlFile)) {
    console.log("The supplied file '" + htmlFile + "' does not exist. Please check the name and try again...");
    process.exit();
}
//Set the CSV file location
csvFile = htmlFile.replace(/\.html/gi, '.csv');
//See if the CSV file exists
if (!fs.existsSync(csvFile)) {
    console.log("The accompanying mandatory CSV file '" + csvFile + "' does not exist. Please check your naming and try again...");
    process.exit();
}
//If the output file is not set, copy the name of the inputfile
if (outputFile.length < 1) {
    outputFile = htmlFile.replace(/\.html/gi, '.json');
}

//Now that we know all the files are correct, let's start the actual process
console.log(`Loading files...
HTML:   ${htmlFile}
CSV:    ${csvFile}
OUTPUT: ${outputFile}`);

//Read both files into memory, then continue the parsing
const htmlContent = fs.readFileSync(htmlFile, "utf-8");
const csvContent = fs.readFileSync(csvFile, "utf-8");

const html = $.parseHTML(htmlContent);
console.log(html);



/**
 * Shows the help menu and then exits the application
 */
function showHelp() {
    console.log(`
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
