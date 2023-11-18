const file_system = require('fs');
const luamin = require('lua-format');

const pattern = /\b[A-Za-z0-9_]+\[[A-Za-z0-9_]+\] = [A-Za-z0-9_]+;/g; // Regular expression to match table assignments (e.g., a[b] = c)

file_system.readFile('input.lua', 'utf8', (read_error, script) => { // Read the script file
  if (read_error) { 
    console.error('Error reading the file:', read_error);
    return;
  }

  const beautified = luamin.Beautify(script, { RenameVariables: false, RenameGlobals: false, SolveMath: false }); // Beautify the script

  let modified = beautified;
  let regex_match;
  let is_modified = false;

  while ((regex_match = pattern.exec(beautified)) !== null) { // Loop through each match of the pattern
    
    const matched_variable = regex_match[0].match(/(?<== )[A-Za-z0-9_]+/)[0]; // Extract the variable name from the match for the print statement
    
    modified = modified.replace(regex_match[0], `${regex_match[0]}\nprint(${matched_variable})`); // Append a print statement for each matched var
    is_modified = true;
    console.log(`Found and added print statement for: ${matched_variable}`);
  }

  if (!is_modified) {
    console.log('No matches found');
    return;
  }

  file_system.writeFile('output.lua', modified, (write_error) => { // Write the modified script to a new file
    if (write_error) {
      console.error('Error writing to file:', write_error);
      return;
    }
  });
});

console.log('Completed');
