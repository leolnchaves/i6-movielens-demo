package main

import (
	"context"

	"go.code.infinity6.ai/customermovielens/api/customermovielensapi/customermovielensserver"
)

// func initTracer() {
// 	res, err := resource.Merge(resource.Default(),
// 		resource.NewWithAttributes(semconv.SchemaURL,
// 			semconv.ServiceName("i6-customermovielens"),
// 			semconv.ServiceVersion(version.Version()),
// 		))

// 	if err != nil {
// 		util.Check(err)
// 	}

// 	exporter, err := stdouttrace.New(stdouttrace.WithPrettyPrint())
// 	if err != nil {
// 		util.Check(err)
// 	}

// 	tracerProvider := sdktrace.NewTracerProvider(
// 		sdktrace.WithResource(res),
// 		sdktrace.WithBatcher(exporter),
// 		sdktrace.WithSampler(sdktrace.TraceIDRatioBased(0.1)),
// 	)

// 	otel.SetTracerProvider(tracerProvider)
// }

func main() {
	ctx := context.Background()

	server := customermovielensserver.Listen(customermovielensserver.Options{
		Context: ctx,
	})
	server.AddHandlers()
	server.Serve()
}

// func init() {
// 	initTracer()
// }
