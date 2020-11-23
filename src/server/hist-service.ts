import fs from 'fs';

export const write = (pathToFile: string, text: string) => new Promise<void>((resolve, reject) => {
  fs.writeFile(pathToFile, text, (err) => {
    if (err) return reject(err);
    resolve();
  });
});
