module Users
  class PasswordsController < Devise::PasswordsController
    respond_to :json

    private

    def respond_with(resource, _opts = {})
      if resource.errors.empty?
        render json: { message: I18n.t("devise.passwords.send_instructions", default: "Password updated") }, status: :ok
      else
        render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
end
