import fastify from 'fastify'
const app = fastify()

app.get('/Hello', () => {
  return 'hello world!!'
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running!')
  })