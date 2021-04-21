const testFolder = './media/';
const fs = require('fs');

fs.readdir(testFolder, (err, files) => {
  files.forEach((file) => {
    console.log(`![Slide](/media/${file})`);
  });
});
