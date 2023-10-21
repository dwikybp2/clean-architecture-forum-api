const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'content reply',
      owner: 'user-123ds',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-23d',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockFindComment = [
      {
        id: 'comment-123',
        thread_id: 'thread-123',
        content: 'komentar netijen',
        owner: 'user-123',
        is_delete: 0,
        date: '2023-10-20T03:11:53.205Z',
      },
    ];

    const mockFindThread = {
      id: 'thread-123',
      title: 'title132',
      body: 'body12342',
      owner: 'user-123',
      date: '2023-10-20T03:07:44.419Z',
      username: 'dicoding',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockFindComment));
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockFindThread));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-23d',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
    expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.findCommentById).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      commentId: useCasePayload.commentId,
    }));
  });
});
