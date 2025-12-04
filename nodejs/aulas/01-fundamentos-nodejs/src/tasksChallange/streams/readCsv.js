import fs, { open } from 'node:fs/promises'
import { parse } from 'csv-parse';

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2 // skip the header line
});

const taksPath = new URL('tasks.csv', import.meta.url)

const file = await open(taksPath)

const stream = file.createReadStream();

async function run() {
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;
    console.log(line)

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })

    // Uncomment this line to see the import working in slow motion (open the db.json)
     await wait(1000)
  }

}

run()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
