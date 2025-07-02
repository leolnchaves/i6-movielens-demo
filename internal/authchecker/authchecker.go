package authchecker

import (
	"context"

	"go.code.infinity6.ai/customermovielens/internal/customermovielenscfg"
	"go.code.infinity6.ai/discovery/discovery/discoveryservice/servnames"
	"go.code.infinity6.ai/user/auth/authz"
	"go.code.infinity6.ai/user/service/grantservice"
)

func sysIssuers() []servnames.ServiceName {
	return []servnames.ServiceName{
		customermovielenscfg.ME,
	}
}

func CheckGrant(ctx context.Context, resourceType grantservice.ResourceType, resource string, grant grantservice.Grant) {
	authz.CheckGrant(ctx, resourceType, resource, grant, sysIssuers())
}
