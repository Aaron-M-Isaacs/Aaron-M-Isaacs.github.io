---
title: 'Determining the best Architecture for our API'
summary: >-
  Our team's first deployed API. Authentication was deliberately kept outside the
  service, and I experimented with different architectures to determine the right
  one for our team.
stack:
  - Python
  - FastAPI
  - AWS API Gateway
  - AWS Lambda
  - AWS AppRunner
  - AWS Cognito
  - AWS EKS
metrics:
  - label: Decision base
    value: 'AWS Architecture'
  - label: Auth code in the API
    value: 'External'
order: 5
draft: false
---

## Context

This was the first API my team deployed to production. Everything before it had been
internal tooling or batch work, so we were making a lot of decisions for the first
time, and setting precedent for whatever we built next.

## Problem

Two questions had to be answered before any endpoint mattered:

1. Where does authentication live?
2. What runs the service?

The tempting answer to the first one is "in the API", a middleware, a decorator on
each route, a dependency that checks a token. It works, it's easy to demo, and it
puts credential validation inside the same process that handles business logic. But
the security side of my brain said not to put the auth flow in the same place as where
the API is hosted. Which got me thinking about how we should host it.

## Approach

We pulled auth out of the service entirely. A separate Lambda authorizer leveraging 
AWS Cognito sits in front of API Gateway and validates credentials before a request
is ever routed to the app server.

And we compared several architectures for the API using various different CDK stacks.
Two of my comparisons were using EKS or AWS Apprunner. While EKS and Kubernetes in 
general is amazing, it was also something no one on our team had touched before, 
including myself. I found that while it does give the developers absolute freedom
to configure their architecture, it also requires an intense amount of training to 
understand. So for our team of four engineers, who worked in a fast paced environment,
it made more sense to adopt a less configurable, more curated and self-managed system
like Apprunner.


## Outcome

The API shipped as our team's first production service, with credential validation
isolated in a component separate from the application and a an API hosted on Apprunner
using Python's FastAPI. It allowed our team to scale the API seamlessly and require
almost no time from us for maintenance.