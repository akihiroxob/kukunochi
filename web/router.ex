defmodule Kukunochi.Router do
  use Kukunochi.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Kukunochi do
    pipe_through :api
  end
end
