defmodule Changelog.Router do
  use Changelog.Web, :router

  if Mix.env == :dev do
    forward "/sent_emails", Bamboo.EmailPreviewPlug
  end

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Changelog.Plug.Auth, repo: Changelog.Repo
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :admin do
    plug :put_layout, {Changelog.LayoutView, :admin}
    plug Changelog.Plug.RequireAdmin
  end

  scope "/admin", Changelog.Admin, as: :admin do
    pipe_through [:browser, :admin]

    get "/", PageController, :index
    get "/search", SearchController, :all
    get "/search/channel", SearchController, :channel
    get "/search/person", SearchController, :person
    get "/search/post", SearchController, :post
    get "/search/sponsor", SearchController, :sponsor

    resources "/channels", ChannelController, except: [:show]
    resources "/people", PersonController, except: [:show]
    resources "/podcasts", PodcastController do
      resources "/episodes", EpisodeController
    end
    resources "/posts", PostController
    resources "/sponsors", SponsorController
  end

  scope "/", Changelog do
    pipe_through :browser

    resources "/channels", ChannelController, only: [:show]
    resources "/people", PersonController, only: [:show]
    resources "/posts", PostController, only: [:show]

    get "/", PageController, :index

    get "/in", AuthController, :new, as: :sign_in
    post "/in", AuthController, :new, as: :sign_in
    get "/in/:token", AuthController, :create, as: :create_sign_in
    get "/out", AuthController, :delete, as: :sign_out
    get "/:slug", PodcastController, :show, as: :podcast
    get "/:slug/feed", PodcastController, :feed, as: :podcast_feed
    get "/:podcast/:slug", PodcastController, :episode, as: :episode
  end
end
