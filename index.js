const Queue = require('bee-queue')
const tilebelt = require('@mapbox/tilebelt')
const queue = new Queue('extent')

const z = 6
for (let x = 0; x < 2 ** z; x++) {
  for (let y = 0; y < 2 ** z; y++) {
    const job = queue.createJob({z: z, x: x, y: y})
    job.save()
    job.on('succeeded', async result => {
      console.log(`${job.id} -> ${result}`)
      const c = await queue.checkHealth()
      console.log(c)
      if (c.waiting === 0) {
        queue.close()
        process.exit()
      }
    })
  }
}

queue.process(async job => {
  return tilebelt.tileToBBOX([job.data.x, job.data.y, job.data.z])
})

