const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw an error when payload not contain needed properties', () => {
    // Arrange
    const payload = { // 
      title: 'Judul Thread',
      body: 'Body Thread',
    }

    // Action dan Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  })
  it('should throw an error when payload not meet data type specification', () => {
    // Arrange
    const payload = { 
      id: 123,
      title: 'Judul Thread',
      body: {},
      date: 2022,
      username: {},
      comments: 'Comment Thread',
    }

    // Action dan Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  })
  it('should create DetailThread object correctly', () => {
    // Arrange
    const timestamp = new Date().toISOString();

    const payload = {
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Body Thread',
      date: timestamp,
      username: 'rickyaditya',
      comments: [{}],
    }

    // Action
    const detailThread = new DetailThread(payload);

    // Assert 
    expect(detailThread).toEqual(payload)
  })
})