package customermovielenscfg

import (
	"crypto/rsa"
	"net/url"

	"go.code.infinity6.ai/discovery/discovery"
	"go.code.infinity6.ai/discovery/discovery/discoveryservice"
	"go.code.infinity6.ai/discovery/discovery/discoveryservice/servnames"

	"go.code.infinity6.ai/platform/config"
	"go.code.infinity6.ai/platform/cryptz"
	"go.code.infinity6.ai/platform/util"
)

var I6_KEY_PRIV_CUSTOMERMOVIELENS_API_ENCODED = config.Create("I6_KEY_PRIV_CUSTOMERMOVIELENS_API_ENCODED", "")

const ME = servnames.Customermovielens

func Service() *discoveryservice.Service {
	return discovery.Service(ME)
}

func Host() string {
	fullurl := Service().Endpoint
	parsed, err := url.Parse(fullurl)
	util.Check(err)
	host := parsed.Hostname()
	return host
}

func Mes() []string {
	return []string{string(ME)}
}

func PrivKey() *rsa.PrivateKey {
	keyStr := cryptz.B64DecodeS2S(string(I6_KEY_PRIV_CUSTOMERMOVIELENS_API_ENCODED.Req()))
	privKey := cryptz.RSAPrivKeyImport(keyStr)
	return privKey
}

func PubKey() *rsa.PublicKey {
	return &PrivKey().PublicKey
}

func PubKeys() []*rsa.PublicKey {
	return []*rsa.PublicKey{&PrivKey().PublicKey}
}
