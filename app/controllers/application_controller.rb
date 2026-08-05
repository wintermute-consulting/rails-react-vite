class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  after_action :set_csrf_token_header

  private

  def set_csrf_token_header
    return unless protect_against_forgery?
    return unless request.format.json?

    response.headers["X-CSRF-Token"] = form_authenticity_token
  end
end
