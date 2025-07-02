package stfiles

import (
	"context"
	"net/http"

	"go.code.infinity6.ai/platform/httpz"
	"go.code.infinity6.ai/platform/httpz/statichandler"
)

type tpack statichandler.PackageName

var pack tpack = "customermovielens"

func init() {
	statichandler.Instance().Config(pack, ".", "")
}

func Handle() httpz.Rest {

	return statichandler.Instance().Handler(pack)
}

func IndexRedirect(ctx context.Context, req *httpz.MReq) *httpz.MResp {
	resp := req.Resp(http.StatusTemporaryRedirect)
	resp.SetHeader("location", "/static/index.html")
	return resp
}
