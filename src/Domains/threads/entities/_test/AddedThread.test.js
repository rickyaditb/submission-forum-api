const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw an error when payload not contain needed properties', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: "Judul Thread",
    }

    // Action dan Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  })
  it('should throw an error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: {},
      owner: "valid-property"
    }

      // Action dan Assert
      expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  })
  it('should create DetailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Judul Thread',
      owner: 'owner-123',
    }

    // Action
    const addedThread = new AddedThread(payload);

    // Assert 
    expect(addedThread).toEqual(payload)
  })
})