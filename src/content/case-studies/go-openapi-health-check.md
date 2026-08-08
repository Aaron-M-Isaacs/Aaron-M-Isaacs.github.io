---
title: 'A Health Check That Updates Itself'
summary: >-
  A Go Lambda that reads a deployed API's own openapi.json to discover its
  endpoints, then checks every one of them. Ship a new endpoint and it gets
  health-checked automatically — no change to the checker.
stack:
  - Go
  - AWS Lambda
  - OpenAPI
metrics:
  - label: Endpoints covered
    value: '~26'
  - label: Full run
    value: '< 2 seconds'
  - label: Manual updates needed
    value: 'Zero'
order: 2
draft: false
---

## Context

This was my first production Go project. I'd been building depth in Go deliberately
— I picked it over Rust because its use cases, services and Lambdas, matched the
work I actually do — and this was the problem that justified using it for real.

## Problem

Health-check tooling rots. The usual shape is a list of endpoints in a config file
somewhere, and that list is correct exactly until someone ships a new endpoint and
forgets to add it. Then you have a monitoring tool that reports green while covering
less than it used to, which is worse than no tool, because it's confidently wrong.

The failure isn't the code. It's that the checker's list of endpoints and the API's
actual endpoints are two separate sources of truth that drift.

## Approach

Rather than store the endpoint list, derive it. The Lambda pulls the deployed API's
`openapi.json` at runtime, reads the endpoints out of the spec, and runs a health
check against each one it finds.

There's only one source of truth now, and it's the API's own published description
of itself. A new endpoint appears in the spec as a consequence of shipping it, so
the health check picks it up without anyone remembering to do anything. Delete an
endpoint and it stops being checked for the same reason. The class of bug where
coverage silently degrades is gone, because there's nothing left to keep in sync.

At the time it covered around 26 endpoints, and a full run completed in under two
seconds.

## Tradeoffs and Decisions

**Why Go and not Python.** My team's default is Python, and defaulting would have
been the low-friction choice. Two properties decided it:

- **Cold-start speed.** This runs as a Lambda. Go's startup cost is low enough that
  the function is doing useful work almost immediately, which matters for something
  invoked on a schedule rather than kept warm.
- **Concurrency primitives.** Checking ~26 endpoints sequentially wastes almost all
  of the wall-clock time on waiting. The work is naturally parallel — every endpoint
  is independent — and Go's concurrency model expresses that directly. The sub-two-second
  number is a consequence of the checks overlapping rather than queueing.

**Runtime fetch vs. build-time generation.** Reading the spec at runtime means the
checker depends on the spec being reachable when it runs. Generating the endpoint
list at build time would remove that dependency, but it reintroduces exactly the
drift I was trying to eliminate: the list would be a snapshot, accurate as of the
last build. Runtime discovery keeps the guarantee that the checker reflects what's
actually deployed right now.

## Outcome

A health check covering roughly 26 endpoints in under two seconds, which requires no
maintenance when the API changes shape — and a first real Go project that earned the
language a place in my toolkit rather than just my reading list.

## What I'd Revisit

The design leans entirely on the spec being accurate. That's a reasonable bet when
the spec is generated from the code, and a worse one if it's ever hand-maintained —
the tool would faithfully check a fiction. If I extended this, the first thing I'd
add is a signal for when the spec itself looks wrong: an endpoint count that drops
sharply between runs is a more interesting alert than any individual endpoint
failing.
