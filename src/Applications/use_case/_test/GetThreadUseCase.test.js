const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadUseCase', () => {
  it('should throw error when use case payload not contain threadId', async () => {
    const useCasePayload = {};
    const getThreadUseCase = new GetThreadUseCase({});

    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects.toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error threadId not string', async () => {
    const useCasePayload = {
      threadId: 123,
    };
    const getThreadUseCase = new GetThreadUseCase({});

    await expect(getThreadUseCase.execute(useCasePayload))
      .rejects.toThrowError('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating get thread action correctly with comments', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const comments = [
      {
        id: 'comment-1w',
        username: 'dwiky',
        date: '2023-10-20T03:07:44.419Z',
        content: 'komentarr netijeeen',
        isDelete: 1,
      },
      {
        id: 'comment-223',
        username: 'dwiky',
        date: '2023-10-20T03:07:44.419Z',
        content: '222komentarr netijeeen',
        isDelete: 0,
      },
    ];

    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockFindReply = [
      {
        id: 'reply-123',
        content: 'balasan komentar netijen',
        date: '2023-10-20T03:15:19.321Z',
        username: 'dwiky',
        isDelete: 1,
      },
      {
        id: 'reply-1234',
        content: 'balasan komentar netijen',
        date: '2023-10-20T03:15:19.321Z',
        username: 'dwiky',
        isDelete: 0,
      },
    ];

    const mockFindThread = {
      id: 'thread-123',
      title: 'title132',
      body: 'body12342',
      owner: 'user-123',
      date: '2023-10-20T03:07:44.419Z',
      username: 'dwiky',
    };

    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockFindThread));
    mockCommentRepository.findCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockReplyRepository.findReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockFindReply));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadUseCase.execute(useCasePayload);

    const expectedMappedComments = [
      {
        id: 'comment-1w',
        username: 'dwiky',
        date: '2023-10-20T03:07:44.419Z',
        content: '**komentar telah dihapus**',
        isDelete: 1,
      },
      {
        id: 'comment-223',
        username: 'dwiky',
        date: '2023-10-20T03:07:44.419Z',
        content: '222komentarr netijeeen',
        isDelete: 0,
      },
    ];

    const expectedMappedReplies = [
      {
        id: 'reply-123',
        content: '**balasan telah dihapus**',
        date: '2023-10-20T03:15:19.321Z',
        username: 'dwiky',
        isDelete: 1,
      },
      {
        id: 'reply-1234',
        content: 'balasan komentar netijen',
        date: '2023-10-20T03:15:19.321Z',
        username: 'dwiky',
        isDelete: 0,
      },
    ];

    expect(mockThreadRepository.findThreadById)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.findCommentByThreadId)
      .toHaveBeenCalledWith(useCasePayload.threadId);

    expect(mockReplyRepository.findReplyByCommentId).toHaveBeenCalledWith('comment-1w');
    expect(mockReplyRepository.findReplyByCommentId).toHaveBeenCalledWith('comment-223');
    expect(thread.comments.length).toEqual(comments.length);

    expect(thread.comments[0].content).toEqual(expectedMappedComments[0].content);
    expect(thread.comments[1].content).toEqual(expectedMappedComments[1].content);

    expect(thread.comments[0].replies[0].content).toEqual(expectedMappedReplies[0].content);
    expect(thread.comments[0].replies[1].content).toEqual(expectedMappedReplies[1].content);

    expect(thread).toStrictEqual({
      id: 'thread-123',
      title: 'title132',
      body: 'body12342',
      owner: 'user-123',
      date: '2023-10-20T03:07:44.419Z',
      username: 'dwiky',
      comments: [
        {
          id: 'comment-1w',
          username: 'dwiky',
          date: '2023-10-20T03:07:44.419Z',
          content: '**komentar telah dihapus**',
          isDelete: 1,
          replies: [
            {
              id: 'reply-123',
              content: '**balasan telah dihapus**',
              date: '2023-10-20T03:15:19.321Z',
              username: 'dwiky',
              isDelete: 1,
            },
            {
              id: 'reply-1234',
              content: 'balasan komentar netijen',
              date: '2023-10-20T03:15:19.321Z',
              username: 'dwiky',
              isDelete: 0,
            },
          ],
        },
        {
          id: 'comment-223',
          username: 'dwiky',
          date: '2023-10-20T03:07:44.419Z',
          content: '222komentarr netijeeen',
          isDelete: 0,
          replies: [
            {
              id: 'reply-123',
              content: '**balasan telah dihapus**',
              date: '2023-10-20T03:15:19.321Z',
              username: 'dwiky',
              isDelete: 1,
            },
            {
              id: 'reply-1234',
              content: 'balasan komentar netijen',
              date: '2023-10-20T03:15:19.321Z',
              username: 'dwiky',
              isDelete: 0,
            },
          ],
        },
      ],
    });
  });

  it('should orchestrating get thread action correctly with empty comments', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const comments = [];

    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockFindReply = [
      {
        id: 'reply-123',
        content: 'balasan komentar netijen',
        date: '2023-10-20T03:15:19.321Z',
        username: 'dicoding',
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

    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockFindThread));
    mockCommentRepository.findCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockReplyRepository.findReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockFindReply));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.findThreadById)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.findCommentByThreadId)
      .toHaveBeenCalledWith(useCasePayload.threadId);

    expect(thread.comments.length).toEqual(0);
    expect(thread).toStrictEqual({
      id: 'thread-123',
      title: 'title132',
      body: 'body12342',
      owner: 'user-123',
      date: '2023-10-20T03:07:44.419Z',
      username: 'dicoding',
      comments: [],
    });
  });
});
