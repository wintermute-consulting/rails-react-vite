module SitePasswordProtection
  extend ActiveSupport::Concern

  SESSION_KEY = "site_unlocked".freeze
  RETURN_TO_KEY = "return_to_after_unlock".freeze

  included do
    before_action :require_site_password
  end

  private

  # Nil when the PASSWORD env var is missing/blank, which disables the gate.
  def site_password
    ENV["PASSWORD"].presence
  end

  def site_password_digest
    Digest::SHA256.hexdigest(site_password)
  end

  # Storing the digest (not a boolean) means rotating PASSWORD relocks
  # every session that was unlocked with the previous value.
  def site_unlocked?
    site_password.blank? || session[SESSION_KEY] == site_password_digest
  end

  def unlock_site!
    session[SESSION_KEY] = site_password_digest
  end

  def valid_site_password?(candidate)
    return false if site_password.blank?

    ActiveSupport::SecurityUtils.secure_compare(
      Digest::SHA256.hexdigest(candidate.to_s),
      site_password_digest
    )
  end

  def require_site_password
    return if site_unlocked?

    if request.format.json?
      render json: { error: I18n.t("gate.locked") }, status: :unauthorized
    else
      session[RETURN_TO_KEY] = request.fullpath if request.get?
      redirect_to unlock_path
    end
  end
end
