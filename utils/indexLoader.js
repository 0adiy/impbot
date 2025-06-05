import { glob } from "glob";
async function loadIndices(dirName) {
  let Files = await glob(
    `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/index.js`
  );
  Files = Files.map(file => `${file}#${Date.now()}`);
  return Files;
}

export { loadIndices };
