const EditCommentLikesUseCase = require('../EditCommentLikesUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikesRepository = require('../../../Domains/commentLikes/CommentLikesRepository');

describe('EditCommentLikesUseCase', () => {
  it('should throw error when use case payload not contain needed property', async () => {
    const useCasePayload = {};
    const editCommentLikesUseCase = new EditCommentLikesUseCase({});

    await expect(editCommentLikesUseCase.execute(useCasePayload))
      .rejects.toThrowError('EDIT_COMMENT_LIKES_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when use case payload does not meet data type specification', async () => {
    const useCasePayload = {
      threadId: 123,
      commentId: [],
      userId: {},
    };
    const editCommentLikesUseCase = new EditCommentLikesUseCase({});

    await expect(editCommentLikesUseCase.execute(useCasePayload))
      .rejects.toThrowError('EDIT_COMMENT_LIKES_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  describe('should orchestrating comment likes action correctly', () => {
    it('delete like if user already liked comment', async () => {
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockCommentLikesRepository = new CommentLikesRepository();

      const useCasePayload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      };

      const mockFindCommentLikes = true;

      mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
      mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
      mockCommentLikesRepository.verifyCommentLikesOwner = jest.fn(
        () => Promise.resolve(mockFindCommentLikes),
      );
      mockCommentLikesRepository.deleteCommentLike = jest.fn(() => Promise.resolve());

      const editCommentLikesUseCase = new EditCommentLikesUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        commentLikesRepository: mockCommentLikesRepository,
      });

      await editCommentLikesUseCase.execute(useCasePayload);

      expect(mockThreadRepository.verifyThreadAvailability)
        .toHaveBeenCalledWith(useCasePayload.threadId);
      expect(mockCommentRepository.verifyCommentAvailability)
        .toHaveBeenCalledWith(useCasePayload.commentId);
      expect(mockCommentLikesRepository.verifyCommentLikesOwner)
        .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
      expect(mockCommentLikesRepository.deleteCommentLike)
        .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    });

    it('add like if user not yet liked comment', async () => {
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockCommentLikesRepository = new CommentLikesRepository();

      const useCasePayload = {
        threadId: 'thread-123',
        commentId: 'comment-123',
        userId: 'user-123',
      };

      const mockFindCommentLikes = undefined;

      mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
      mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
      mockCommentLikesRepository.verifyCommentLikesOwner = jest.fn(
        () => Promise.resolve(mockFindCommentLikes),
      );
      mockCommentLikesRepository.addCommentLike = jest.fn(() => Promise.resolve());

      const editCommentLikesUseCase = new EditCommentLikesUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        commentLikesRepository: mockCommentLikesRepository,
      });

      await editCommentLikesUseCase.execute(useCasePayload);

      expect(mockThreadRepository.verifyThreadAvailability)
        .toHaveBeenCalledWith(useCasePayload.threadId);
      expect(mockCommentRepository.verifyCommentAvailability)
        .toHaveBeenCalledWith(useCasePayload.commentId);
      expect(mockCommentLikesRepository.verifyCommentLikesOwner)
        .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
      expect(mockCommentLikesRepository.addCommentLike)
        .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    });
  });
});
