package cmd

import (
	"fmt"
	"os"

	"go.code.infinity6.ai/customermovielens/internal/cmd/cmdenvconfig"

	"github.com/spf13/cobra"
	"go.code.infinity6.ai/customermovielens/version"
)

func Prepare() *cobra.Command {
	var rootCmd = &cobra.Command{
		Version: version.Version(),
		Use:     "i6customermovielens",
		Short:   "i6 customermovielens",
	}

	rootCmd.AddCommand(&cobra.Command{
		Use: "version",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Printf("%s\n", version.Version())
		},
	})

	cmdenvconfig.Prepare(rootCmd)
	return rootCmd
}

func Execute(rootCmd *cobra.Command) {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
