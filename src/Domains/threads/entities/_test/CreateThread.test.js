const CreateThread = require('../CreateThread');

describe('CreateThread entities', () => {
  it('should throw an error when payload not contain needed properties', () => {
    // Arrange
    const payload = { // missing 'body'
      title: "Judul Thread",
    }

    // Action dan Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  })
  it('should throw an error when payload not meet data type specification', () => {
    // Arrange
    const payload = { // should be string
      title: 69420,
      body: true,
    }

      // Action dan Assert
      expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  })
  it('should create CreateThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Judul Thread',
      body: 'Body Thread',
    }

    // Action
    const createThread = new CreateThread(payload);

    // Assert
    expect(createThread).toEqual(payload)
  })
})