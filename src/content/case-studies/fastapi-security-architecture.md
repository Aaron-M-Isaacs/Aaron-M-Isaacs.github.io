---
title: 'Keeping Auth Out of the API'
summary: >-
  Our team's first deployed API. Authentication was deliberately kept outside the
  service, behind a Lambda authorizer at API Gateway, so malformed requests never
  reached the app server at all.
stack:
  - FastAPI
  - AWS API Gateway
  - AWS Lambda
  - AWS AppRunner
metrics:
  - label: Team size
    value: '4 engineers'
  - label: Auth code in the API
    value: 'None'
order: 1
draft: false
---

## Context

This was the first API my team deployed to production. Everything before it had been
internal tooling or batch work, so we were making a lot of decisions for the first
time — and setting precedent for whatever we built next.

## Problem

Two questions had to be answered before any endpoint mattered:

1. Where does authentication live?
2. What runs the service?

The tempting answer to the first one is "in the API" — a middleware, a decorator on
each route, a dependency that checks a token. It works, it's easy to demo, and it
puts credential validation inside the same process that handles business logic.

## Approach

We pulled auth out of the service entirely. A separate Lambda authorizer sits in
front of API Gateway and validates credentials before a request is ever routed to
the app server.

The practical consequence is the part I care about: a malicious or malformed request
never touches the core service. It's rejected at the edge by a small, single-purpose
function whose only job is to say yes or no. The FastAPI application contains no
authentication code at all, which means there is no auth logic to accidentally
bypass, no decorator to forget on a new route, and no shared state between "is this
caller allowed" and "what does this caller want."

This follows a pattern I reach for generally: several single-purpose resources
rather than one resource doing many things. The authorizer is easy to reason about
because it does exactly one thing.

## Tradeoffs and Decisions

**Hosting: AppRunner over EKS.** We evaluated AWS AppRunner against EKS/Kubernetes.
Kubernetes is the more powerful and more flexible answer, and on a larger team it
might well have been the right one.

We chose AppRunner, and the reason was team size, not technology. We were four
engineers, none with Kubernetes experience. Running a cluster would have meant
spending more time operating infrastructure than shipping features — and the
features were the point. That's an explicit tradeoff, not a default: we did the
comparison, and the constraint that decided it was the team, not the workload.

I think about this as "slow is smooth, smooth is fast." Picking the tool the team
can actually operate beats picking the most technically elegant option, because the
elegant option has an operational cost that someone pays every week.

**Auth at the edge costs a hop.** Putting the authorizer in front of API Gateway
adds a validation step to every request. That's a real cost, and it buys a real
guarantee: the service's attack surface no longer includes unauthenticated traffic.

## Outcome

The API shipped as our team's first production service, with credential validation
isolated in a component separate from the application and a hosting choice matched
to the people operating it.

## What I'd Revisit

The AppRunner decision is explicitly conditional — it was correct *for four
engineers without Kubernetes experience*. That's the kind of decision worth
re-opening when the input changes. If the team grew, or picked up real Kubernetes
depth, the comparison deserves to be run again rather than inherited. Decisions
made under a constraint should be revisited when the constraint moves; the failure
mode is letting a good call calcify into an unexamined default.
