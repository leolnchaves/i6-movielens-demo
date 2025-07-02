package customermovielensserver

import (
	"context"
	"io"

	"go.code.infinity6.ai/customermovielens/internal/customermovielenscfg"
	"go.code.infinity6.ai/customermovielens/internal/stfiles"
	"go.code.infinity6.ai/customermovielens/version"
	"go.code.infinity6.ai/discovery/discovery"
	"go.code.infinity6.ai/discovery/systokenz/syshttpz"
	"go.code.infinity6.ai/platform/httpz/httpzserver"
	"go.code.infinity6.ai/platform/service/boxservice"
	"go.code.infinity6.ai/user/auth/authz"
)

type Options struct {
	Context      context.Context
	LocalAddress string
}

type Server struct {
	server   *httpzserver.Server
	reverter io.Closer
}

func (me *Server) Start() {
	me.server.Start()
}

func (me *Server) Stop() {
	if me.reverter != nil {
		defer me.reverter.Close()
	}
	if me.server != nil {
		defer me.server.Stop()
	}
}

func (me *Server) Address() string {
	return me.server.Address()
}

func (me *Server) Base() string {
	return me.server.Base()
}

func (me *Server) Serve() {
	me.server.Serve()
}

func Listen(opts Options) *Server {
	if opts.LocalAddress == "" {
		if boxservice.Config().Id == "local" {
			opts.LocalAddress = discovery.Service(customermovielenscfg.ME).Bind()
		}
	}

	ret := &Server{}
	ret.server = &httpzserver.Server{
		Context:      opts.Context,
		LocalAddress: opts.LocalAddress,
		Audit:        true,
		ServName:     string(customermovielenscfg.ME),
		ServVersion:  version.Version(),
	}
	ret.server.Listen()
	return ret
}

func (me *Server) AddHandlers() {
	me.server.Health()

	authCustomermovielens := authz.CreateAuthz("/api/customermovielens", customermovielenscfg.Mes(), customermovielenscfg.ME, customermovielenscfg.PrivKey())
	me.server.AddFilter(authCustomermovielens.Filter)

	syshttpz.ConfigServer(me.server, "customermovielens")
	me.server.AddRestPrefix("GET", "/static", stfiles.Handle())

	// customermovielensauthimpl.AddHandlers(me.server)
	me.server.AddRestPrefix("GET", "/", stfiles.IndexRedirect)
}

func Start(opts Options) *Server {
	server := Listen(opts)
	server.AddHandlers()
	server.Start()
	return server
}

func (me *Server) Server() *httpzserver.Server {
	return me.server
}
