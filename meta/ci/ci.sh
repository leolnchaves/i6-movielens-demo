#!/bin/bash -xe

function cmd_build() {
  i6dev golang auth-meta
  ./build.sh update
  i6dev golang vendor
}

function cmd_test() {
  ./build.sh test
}

function cmd_release() {
  i6dev golang release-describe || ./build.sh release
}

function cmd_deploy() {
  true
}

cd "$(dirname "$0")/../.."; _cmd="${1?"cmd is required"}"; shift; "cmd_${_cmd}" "$@"

