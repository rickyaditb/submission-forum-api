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
    it('should create a new thread and return the added thread correctly', async () => {
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
    it('should throw NotFoundError when the thread is not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        threadRepositoryPostgres.checkExistingThread('thread-ZXC'),
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
  describe('getThreadById function', () => {
    it('should throw NotFoundError when the thread is not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        threadRepositoryPostgres.getThreadById('thread-ZXC'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return the detail of the thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const detailThread = await threadRepositoryPostgres.getThreadById(
        'thread-123',
      );

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById(
        'thread-123',
      );

      expect(detailThread).toStrictEqual(thread);
    });
  });
});
