package service_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.code.infinity6.ai/customermovielens/internal/appstack"
	"go.code.infinity6.ai/customermovielens/internal/customermovielenscfg"
	"go.code.infinity6.ai/discovery/discovery"
	"go.code.infinity6.ai/platform/httpz"
	"go.code.infinity6.ai/user/usertestutil"
)

func TestUnitCustomermovielensAuth(t *testing.T) {
	ctx := context.Background()
	stack := appstack.StartForTest(ctx)
	defer stack.Stop()

	// todo: make reverter
	usertestutil.MockRetrieve("test7@test")

	client := httpz.CreateClient(discovery.Service(customermovielenscfg.ME).Endpoint)

	req := httpz.CreateReq("GET", "/api/customermovielens/auth/me")

	resp := client.Execute(ctx, req)

	assert.Equal(t, 401, resp.StatusCode)

	// token := usertestutil.MockAccessToken(ctx, "test7@test", "customermovielens")

	// req = httpz.CreateReq("GET", "/api/customermovielens/auth/me").SetHeader("Cookie", fmt.Sprintf("i6useraccess=%s", token))
	// resp = client.Execute(ctx, req)
	// assert.Equal(t, 200, resp.StatusCode)

	// // todo: not follow the redirect
	// req = httpz.CreateReq("GET", "/api/customermovielens/auth/login?backurl=backurl")
	// resp = client.Execute(ctx, req)
	// assert.Equal(t, 200, resp.StatusCode)
	// assert.NotEmpty(t, resp.ParseText())

	// req = httpz.CreateReq("GET", "/api/customermovielens/auth/logout")
	// resp = client.Execute(ctx, req)
	// assert.Equal(t, 200, resp.StatusCode)
	// assert.Equal(t, "<html><body onload=\"location='/'\"></body></html>", string(resp.Body))

}
