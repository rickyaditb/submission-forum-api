const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

const pool = require('../../database/postgres/pool');


describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should create new thread and return added user correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({}); 

      const createThread = new CreateThread({
        title: 'Judul Thread',
        body: 'Body Thread',
      });

      const fakeIdGenerator = () => '123'; 
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const userId = 'user-123'

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        createThread,
        userId,
      );

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: `thread-${fakeIdGenerator()}`,
          title: createThread.title,
          owner: userId,
        }),
      );
    });
  });
  describe('checkExistingThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        threadRepositoryPostgres.checkExistingThread('thread-xxx'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should resolve when thread is found', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.checkExistingThread('thread-123'),
      ).resolves.not.toThrowError();
    });
  });
});