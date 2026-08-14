---
title: 'A Self-Updating Health Check Lambda'
summary: >-
  A Go Lambda that reads a deployed API's own openapi.json to discover its
  endpoints, then checks every one of them. Ship a new endpoint and it gets
  health-checked automatically, no change to the lambda needed.
stack:
  - Go
  - AWS Lambda
  - OpenAPI
metrics:
  - label: Language
    value: 'Go/Golang'
  - label: Full run
    value: '< 2 seconds'
  - label: Manual updates needed
    value: 'Zero'
order: 3
draft: false
---

## Context

This was my first production Go project. I'd been building depth in Go at home out
of curiosity fueled by my love for concurrency, and I knew it was a language commonly
supported in AWS as well. It was a way for me to get more experience building in Go 
and use it in a real world setting.

## Problem

Our API that we set up with FastAPI on an Apprunner instance didn't have much 
architecture support, and we were in a time our organization wanted to prioritize 
optimization across our tech stack. So I proposed an experiment, building a health 
check lambda for our API service.

It was dual purpose, I wanted to get more experience with Go, and the API would get
a health check lambda that would alert if the API went down instead of waiting for a 
user to discover and alert us.

## Approach

Following the theme we used when setting up the API in the first place, I wanted a
tool that would support the API but not necessarily take more valuable time from the
engineers to maintain it and ensure its reliability. I also wanted to make it relatively
cost efficient, a bonus of using Go, as it is designed specifically for I/O operations
such as making API calls concurrently.

This meant I wanted a lambda that wouldn't require an update anytime one of the engineers
added an endpoint to the API. So I used the one file I knew would always update 
automatically, the openapi.json file. On startup, the Lambda would ping the API's openapi.json
endpoint, scan it for all the endpoints and their HTTP Method (GET, POST, DELETE, etc.) then
it would run each one through a series of tests and output the results.


## Outcome

The end result was a health check lambda that automatically sends a request to each
endpoint, and notifies the team of any reported issues. The at the time of creation,
the lambda would cover 26 endpoints and have a runtime of less than 2 seconds. It has
notified the team of several outages, where we were able to setup triage and get the
API working again quickly. Often times before the users even noticed.

