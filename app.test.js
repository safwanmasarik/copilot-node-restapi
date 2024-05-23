const request = require('supertest');
const app = require('./app');
const fs = require('fs');

describe('GET /api/', () => {
  it('should return JSON data with message "Salam Malaysia Madani!!"', async () => {
    const response = await request(app).get('/api/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Salam Malaysia Madani!!" });
  });
});

describe('GET /api/negeri', () => {
  it('should return JSON data from "negeri.json" file', async () => {
    const response = await request(app).get('/api/negeri');
    expect(response.status).toBe(200);
    // Add your assertions for the JSON data here
  });

  it('should return 500 Internal Server Error if "negeri.json" file read fails', async () => {
    // Mock the fs.readFile function to simulate an error
    jest.spyOn(fs, 'readFile').mockImplementation((path, encoding, callback) => {
      callback(new Error('Mocked readFile error'));
    });

    const response = await request(app).get('/api/negeri');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });

    // Restore the original fs.readFile function
    jest.restoreAllMocks();
  });
});

describe('POST /api/negeri', () => {
  it('should add a new state to "negeri.json" file and return success message', async () => {
    const newState = {
        "id": 999,
        "name": "Unit test 999"
    };

    const response = await request(app)
      .post('/api/negeri')
      .send(newState);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "State added successfully" });

    // Add your assertions to check if the new state is added to the "negeri.json" file
  });

  it('should return 500 Internal Server Error if "negeri.json" file write fails', async () => {
    // Mock the fs.writeFile function to simulate an error
    jest.spyOn(fs, 'writeFile').mockImplementation((path, data, callback) => {
      callback(new Error('Mocked writeFile error'));
    });

    const newState = { name: 'New State' };

    const response = await request(app)
      .post('/api/negeri')
      .send(newState);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });

    // Restore the original fs.writeFile function
    jest.restoreAllMocks();
  });
});

describe('PUT /api/negeri/:id', () => {
  it('should update the name of a state in "negeri.json" file and return success message', async () => {
    const updatedState = { "name": "Johor Bharu" };

    const response = await request(app)
      .put('/api/negeri/1')
      .send(updatedState);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "State updated successfully" });

    // Add your assertions to check if the state name is updated in the "negeri.json" file
  });

  it('should return 500 Internal Server Error if "negeri.json" file write fails', async () => {
    // Mock the fs.writeFile function to simulate an error
    jest.spyOn(fs, 'writeFile').mockImplementation((path, data, callback) => {
      callback(new Error('Mocked writeFile error'));
    });

    const updatedState = { name: 'Updated State' };

    const response = await request(app)
      .put('/api/negeri/1')
      .send(updatedState);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });

    // Restore the original fs.writeFile function
    jest.restoreAllMocks();
  });

  it('should return 404 Not Found if the state with the given ID does not exist', async () => {
    const updatedState = { "name": "Johor Bharu" };

    const response = await request(app)
      .put('/api/negeri/0')
      .send(updatedState);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "State not found" });
  });
});

describe('DELETE /api/negeri/:id', () => {
  it('should delete a state from "negeri.json" file and return success message', async () => {

    const prepData = await request(app)
      .post('/api/negeri')
      .send({
        "id": 999,
        "name": "Unit test 999"
    });
    
    const response = await request(app).delete('/api/negeri/999');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "State deleted successfully" });

    // Add your assertions to check if the state is deleted from the "negeri.json" file
  });

  it('should return 500 Internal Server Error if "negeri.json" file write fails', async () => {
    // Mock the fs.writeFile function to simulate an error
    jest.spyOn(fs, 'writeFile').mockImplementation((path, data, callback) => {
      callback(new Error('Mocked writeFile error'));
    });

    const response = await request(app).delete('/api/negeri/1');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });

    // Restore the original fs.writeFile function
    jest.restoreAllMocks();
  });

  it('should return 404 Not Found if the state with the given ID does not exist', async () => {
    const response = await request(app).delete('/api/negeri/0');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "State not found" });
  });
});