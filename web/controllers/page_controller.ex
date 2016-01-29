defmodule Kukunochi.PageController do
  use Kukunochi.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
