#!/bin/bash

# NOTE: You will need to configure the PATH to point to your local install of Sonar Scanner
# Ref: https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner

# export SONAR_QUBE=~/Downloads/sonar-scanner-3.0.3.778-macosx
# export PATH=$PATH:$SONAR_QUBE/bin

sonar-scanner \
  -Dsonar.projectKey=joulica-reporting-dashboard \
  -Dsonar.exclusions=src/**/*spec.ts,src/**/*.js \
  -Dsonar.sources=src \
  -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info \
  -Dsonar.host.url=http://5.10.79.243:9000 \
  -Dsonar.login=74421cc3855c18f9f0b4d2b17ae38cab9717e974
