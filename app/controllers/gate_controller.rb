class GateController < ApplicationController
  skip_before_action :require_site_password

  rate_limit to: 10, within: 3.minutes, only: :create,
             with: -> { redirect_to unlock_path, alert: t("gate.throttled") }

  def new
    redirect_to root_path if site_unlocked?
  end

  def create
    if valid_site_password?(params[:password])
      unlock_site!
      redirect_to session.delete(SitePasswordProtection::RETURN_TO_KEY) || root_path
    else
      flash.now[:alert] = t("gate.invalid")
      render :new, status: :unauthorized
    end
  end
end
