const AddThread = require('../AddThread');

describe('AddThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      title: 'mytitle',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      title: 123,
      body: [],
      owner: true,
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread entities correctly', () => {
    const payload = {
      title: 'thread',
      body: 'description',
      owner: 'user-123',
    };

    const addThread = new AddThread(payload);

    expect(addThread).toBeInstanceOf(AddThread);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.owner).toEqual(payload.owner);
  });

  it('should throw error when title contains more than 255 character', () => {
    // Arrange
    const payload = {
      title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicodingdygasdhadsaaaaaaaaaaaaaaaaaaaaasdadadawdasdsdawdawdadadadasdadasdawdasddadwadasdawdadaddasdasssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssawda',
      body: 'Dicoding Indonesia',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR');
  });
});
