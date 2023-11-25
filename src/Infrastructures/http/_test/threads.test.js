const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommonTestHelper = require('../../../../tests/CommonTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommonTestHelper.cleanUserAuth();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted addedThread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Judul Thread',
        body: 'Body Thread',
      };

      const accessToken = await CommonTestHelper.getAccessToken({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.owner).toEqual('user-123');
    });
  });
});