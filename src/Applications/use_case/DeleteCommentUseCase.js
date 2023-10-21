class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository
      .verifyCommentOwner(useCasePayload.commentId, useCasePayload.userId);
    await this._commentRepository.deleteCommentById(useCasePayload.commentId);
  }
}

module.exports = DeleteCommentUseCase;
