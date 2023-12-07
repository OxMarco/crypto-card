#!/bin/bash

# Clean up
avalanche network clean

# Create subnet
avalanche subnet create cardNetworkSubnet
avalanche subnet deploy cardNetworkSubnet --local
avalanche subnet elastic cardNetworkSubnet --local