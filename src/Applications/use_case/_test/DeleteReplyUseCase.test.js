const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };
    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockReplyRepository.verifyReplyOwner)
      .toHaveBeenCalledWith(useCasePayload.replyId, useCasePayload.userId);
    expect(mockReplyRepository.deleteReplyById)
      .toHaveBeenCalledWith(useCasePayload.replyId);
  });
});
