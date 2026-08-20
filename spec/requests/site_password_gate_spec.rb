require "rails_helper"

RSpec.describe "Site password gate", type: :request do
  around do |example|
    original = ENV["PASSWORD"]
    ENV["PASSWORD"] = password
    example.run
    ENV["PASSWORD"] = original
  end

  context "when PASSWORD is not set" do
    let(:password) { nil }

    it "serves the app without asking for a password" do
      get root_path

      expect(response).to have_http_status(:ok)
    end

    it "redirects /unlock to the app" do
      get unlock_path

      expect(response).to redirect_to(root_path)
    end
  end

  context "when PASSWORD is set" do
    let(:password) { "s3cret" }

    it "redirects HTML requests to the unlock page" do
      get root_path

      expect(response).to redirect_to(unlock_path)
    end

    it "returns 401 for JSON requests" do
      get current_user_path, as: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "renders the unlock page" do
      get unlock_path

      expect(response).to have_http_status(:ok)
    end

    it "rejects an incorrect password" do
      post unlock_path, params: { password: "nope" }

      expect(response).to have_http_status(:unauthorized)

      get root_path
      expect(response).to redirect_to(unlock_path)
    end

    it "unlocks for the rest of the session and returns to the requested page" do
      get "/login"
      expect(response).to redirect_to(unlock_path)

      post unlock_path, params: { password: password }
      expect(response).to redirect_to("/login")

      get root_path
      expect(response).to have_http_status(:ok)
    end

    it "relocks the session when the password changes" do
      post unlock_path, params: { password: password }
      get root_path
      expect(response).to have_http_status(:ok)

      ENV["PASSWORD"] = "rotated"
      get root_path
      expect(response).to redirect_to(unlock_path)
    end
  end
end
