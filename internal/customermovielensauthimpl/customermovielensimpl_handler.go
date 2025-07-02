package customermovielensauthimpl

// func getAuthMe(ctx context.Context, req *httpz.MReq, params map[string]string) *httpz.MResp {
// 	token := req.ReadCookie("i6useraccess")
// 	info := auth.GetInfo(ctx, token)
// 	if info == nil {
// 		return req.Resp(http.StatusUnauthorized)
// 	}
// 	return req.Resp(http.StatusOK).FormatJson(info)
// }

// func logoutMe(ctx context.Context, req *httpz.MReq, params map[string]string) *httpz.MResp {
// 	return req.
// 		RedirectJS("/").
// 		DeleteCookie("i6useraccess")
// }

// func redirectToLogin(ctx context.Context, req *httpz.MReq, params map[string]string) *httpz.MResp {
// 	customermovielensEndpoint := discovery.Service(customermovielenscfg.ME).Endpoint
// 	userEndpoint := fmt.Sprintf("%s/%s", discovery.Service(servnames.User).Endpoint, "api/user/auth")
// 	backurl := req.Query.Get("backurl")
// 	redirect := fmt.Sprintf("%s/%s", customermovielensEndpoint, "api/customermovielens/auth/callback")

// 	backurl = cryptz.B64EncodeS2S(backurl)
// 	app := cryptz.B64EncodeS2S(string(customermovielenscfg.ME))
// 	redirect = cryptz.B64EncodeS2S(redirect)

// 	return req.Redirect(userEndpoint, "app", app, "state", backurl, "redirect", redirect)
// }

// func callbackHandle(ctx context.Context, req *httpz.MReq, params map[string]string) *httpz.MResp {
// 	code := req.Query.Get("code")
// 	backurl := cryptz.B64DecodeS2S(req.Query.Get("state"))

// 	accessToken := exchange.Exchange(ctx, code, string(customermovielenscfg.ME))

// 	return req.Resp(http.StatusOK).
// 		SetCookie("i6useraccess", accessToken.AccessToken, 60*60).
// 		SetHeader("Content-Type", "text/html; charset=utf-8").
// 		FormatText("<html><body onload=\"location='%s'\"></body></html>", backurl)
// }

// func AddHandlers(server *httpzserver.Server) {
// 	server.AddRestPattern("GET", "/api/customermovielens/auth/me", getAuthMe)
// 	server.AddRestPattern("GET", "/api/customermovielens/auth/logout", logoutMe)
// 	server.AddRestPattern("GET", "/api/customermovielens/auth/login", redirectToLogin)
// 	server.AddRestPattern("GET", "/api/customermovielens/auth/callback", callbackHandle)
// }
