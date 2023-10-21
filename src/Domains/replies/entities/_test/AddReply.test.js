const AddReply = require('../AddReply');

describe('AddReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      owner: 'user-reply',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    const payload = {
      content: [],
      owner: {},
      commentId: 123,
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddReply entities correctly', () => {
    const payload = {
      content: 'replyyy',
      owner: 'user-rep123',
      commentId: 'reply-123',
    };

    const addReply = new AddReply(payload);

    expect(addReply).toBeInstanceOf(AddReply);
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.owner).toEqual(payload.owner);
    expect(addReply.commentId).toEqual(payload.commentId);
  });
});
