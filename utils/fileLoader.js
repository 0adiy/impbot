import { glob } from "glob";

async function loadFiles(dirName) {
  let Files = await glob(
    `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`
  );

  // Files.forEach((file) => delete require.cache[require.resolve(file)]);

  // FIXME: ESM Cache busting not possible so this is a workaround for reloading
  Files = Files.map(file => `${file}#${Date.now()}`);

  return Files;
}
export { loadFiles };
