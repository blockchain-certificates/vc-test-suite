#!/usr/bin/env

echo "vc-test-suite postinstall script"
pwd
mkdir node_modules/vc-test-suite/node_modules
cp -r node_modules/cert-issuer-node-wrapper node_modules/vc-test-suite/node_modules/cert-issuer-node-wrapper
