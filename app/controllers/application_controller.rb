class ApplicationController < ActionController::Base
  # Site-wide password gate, independent from Devise sign-in.
  include SitePasswordProtection

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # The SPA never reloads, so signing in/out rotates the session's CSRF token
  # while the page still holds the old one. Hand a fresh token back on every
  # JSON response so the frontend can keep its meta tag in sync.
  after_action :set_csrf_token_header

  private

  def set_csrf_token_header
    return unless protect_against_forgery?
    return unless request.format.json?

    response.headers["X-CSRF-Token"] = form_authenticity_token
  end
end
