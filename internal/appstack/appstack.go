package appstack

import (
	"context"
	"fmt"
	"io"

	"go.code.infinity6.ai/customermovielens/api/customermovielensapi/customermovielensserver"
	"go.code.infinity6.ai/customermovielens/internal/customermovielenscfg"
	"go.code.infinity6.ai/discovery/discovery"
	"go.code.infinity6.ai/discovery/discovery/discoveryservice"
	"go.code.infinity6.ai/platform/cryptz"
	"go.code.infinity6.ai/platform/fsz/fszserver"
	"go.code.infinity6.ai/platform/service/boxservice"
	"go.code.infinity6.ai/user/api/userapi/userserver"
	"go.code.infinity6.ai/user/usercfg"
)

type Options struct {
	Context                       context.Context
	FSZLocalAddress               string
	CustomermovielensLocalAddress string
	UserLocalAddress              string
}

type Server struct {
	fszserver               *fszserver.Server
	customermovielensserver *customermovielensserver.Server
	userserver              *userserver.Server
	reverters               []io.Closer
}

func (me *Server) Stop() {
	for _, reverter := range me.reverters {
		defer reverter.Close()
	}
	if me.customermovielensserver != nil {
		defer me.customermovielensserver.Stop()
	}
	if me.fszserver != nil {
		defer me.fszserver.Stop()
	}
	if me.userserver != nil {
		defer me.userserver.Stop()
	}
}

func (me *Server) CustomermovielensServer() *customermovielensserver.Server {
	return me.customermovielensserver
}

func StartWithOptions(opts Options) *Server {
	ret := &Server{}
	success := false
	defer (func() {
		if !success {
			ret.Stop()
		}
	})()

	ret.fszserver = fszserver.Start(fszserver.Options{
		Context:      opts.Context,
		LocalAddress: opts.FSZLocalAddress,
	})

	ret.reverters = append(ret.reverters, boxservice.MockConfig(&boxservice.BoxConfig{
		StorageBase: fmt.Sprintf("file://%s", ret.fszserver.BasedirAbs()),
	}))

	privKey := cryptz.RSAPrivKeyCreate(1024)
	ret.reverters = append(ret.reverters, customermovielenscfg.I6_KEY_PRIV_CUSTOMERMOVIELENS_API_ENCODED.Set(
		"%s", cryptz.B64EncodeS2S(cryptz.RSAPrivKeyExport(privKey)),
	))

	boxservice.Config().MockDataset("mydataset")

	ret.customermovielensserver = customermovielensserver.Listen(customermovielensserver.Options{
		Context:      opts.Context,
		LocalAddress: opts.CustomermovielensLocalAddress,
	})

	ret.reverters = append(ret.reverters, discovery.MockConfig(&discoveryservice.Service{
		Name:     "customermovielens",
		Endpoint: ret.customermovielensserver.Base(),
		PubKey:   customermovielenscfg.PubKey(),
	}))

	privKey = cryptz.RSAPrivKeyCreate(1024)
	ret.reverters = append(ret.reverters, usercfg.I6_KEY_PRIV_USER_API_ENCODED.Set(
		"%s", cryptz.B64EncodeS2S(cryptz.RSAPrivKeyExport(privKey)),
	))
	ret.userserver = userserver.Listen(userserver.Options{
		Context:      opts.Context,
		LocalAddress: opts.UserLocalAddress,
	})
	ret.reverters = append(ret.reverters, discovery.MockConfig(&discoveryservice.Service{
		Name:     "user",
		Endpoint: ret.userserver.Base(),
		PubKey:   &privKey.PublicKey,
	}))

	ret.userserver.AddHandlers()
	ret.customermovielensserver.AddHandlers()

	ret.userserver.Start()
	ret.customermovielensserver.Start()
	success = true
	return ret
}

func StartForTest(ctx context.Context) *Server {
	return StartWithOptions(Options{
		Context:                       ctx,
		FSZLocalAddress:               "127.0.0.1:0",
		CustomermovielensLocalAddress: "127.0.0.1:0",
		UserLocalAddress:              "127.0.0.1:0",
	})
}
