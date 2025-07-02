package main

import (
	"go.code.infinity6.ai/customermovielens/internal/cmd"
)

func main() {
	rootCmd := cmd.Prepare()
	cmd.Execute(rootCmd)
}
