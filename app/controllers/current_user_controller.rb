class CurrentUserController < ApplicationController
  def show
    if user_signed_in?
      render json: { user: UserSerializer.new(current_user).serializable_hash }
    else
      render json: { user: nil }, status: :ok
    end
  end
end
