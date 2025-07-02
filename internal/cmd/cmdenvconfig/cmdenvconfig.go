package cmdenvconfig

import (
	"fmt"

	"github.com/spf13/cobra"
)

func prepareEnvConfigs(cmd *cobra.Command) {
	retrieveCmd := &cobra.Command{
		Use: "keys",
		Run: func(cmd *cobra.Command, args []string) {
			keys := []string{
				"I6_FSZ_EMULATOR_HOST",
				"I6_KEY_PRIV_CUSTOMERMOVIELENS_API",
			}

			for _, key := range keys {
				fmt.Printf("%s\n", key)
			}
		},
	}
	cmd.AddCommand(retrieveCmd)
}

func Prepare(rootCmd *cobra.Command) {
	envConfigsCmd := &cobra.Command{Use: "envconfig"}
	rootCmd.AddCommand(envConfigsCmd)

	prepareEnvConfigs(envConfigsCmd)

}
