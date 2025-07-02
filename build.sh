#!/bin/bash -e

eval "$(i6dev meta debug i6go-customermovielens-build I6DEV_DEBUG)"

function cmd_env() {
    cmd_run envconfig keys | i6dev box-config vault-export-keys
}

function cmd_static() {
    i6dev go-platform static . static internal/stfiles
}

function cmd_update() {
    i6dev golang update
}

function cmd_run_server() {
    [ "x$(i6dev box-config jq -r .id)" == "xlocal" ]
    eval "$(cmd_env)"
    # ln -s app/dist/spa static
    go run api/main.go "$@"
}

function cmd_test() {
    i6dev golang test_all "$@"
}

function cmd_release() {
    cmd_static
    i6dev golang bin-compile
    i6dev golang release
    i6dev golang bin-release latest
}

function cmd_run() {
    go run main.go "$@"
}

function cmd_version-inc {
    i6dev dever version-inc version/version.go
    cat version/version.go | grep return | cut -d' ' -f2- | tr -d '"' > static/version.txt
}

cd "$(dirname "$0")"; _cmd="${1?"cmd is required"}"; shift; "cmd_${_cmd}" "$@"

