package customermovielensconfigimpl

import (
	"context"
	"net/http"

	"go.code.infinity6.ai/platform/httpz"
	"go.code.infinity6.ai/platform/httpz/httpzserver"
)

func sayHello(ctx context.Context, req *httpz.MReq, params map[string]string) *httpz.MResp {
	return req.Resp(http.StatusCreated).FormatText("Hello, World!")
}

func AddHandlers(server *httpzserver.Server) {
	server.AddRestPattern("GET", "/api/customermovielens/hello", sayHello)
}
