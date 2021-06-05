test("Testpost", async function() {it('respond with valid HTTP status code message', function (done) {
  //Make POST request
  const response = await supertest(app).post('/api/shorturl/new').send({
    title: 'creating new short url request',
    body: {'url':'https://editor.swagger.io/'}
  });
  
  //compare response with expectations
  expect(response.status).toBe(200);
})