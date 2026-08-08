---
title: 'Benchmarking Multithreading Against Asyncio'
summary: >-
  Asyncio was the concurrency model I knew and liked. When I benchmarked it against
  multithreading on our actual workload, multithreading won — so we changed our
  default, and I taught the team why.
stack:
  - Python
  - asyncio
  - threading
metrics:
  - label: Benchmark winner
    value: 'Multithreading'
  - label: Adoption
    value: 'Team-wide'
order: 3
draft: false
---

## Context

I got into Python concurrency by building a server-patching orchestrator with
asyncio. It worked, it was the first time concurrency clicked for me properly, and
it left me with a preference: asyncio was the tool I reached for.

Later I was optimizing two slow paths in our team's main web application — login
flows and some long-running database queries.

## Problem

The obvious move was to apply the thing that had already worked. I'd used asyncio
successfully, I understood it, and both problems looked like I/O-bound waiting,
which is asyncio's home ground.

The trouble with that reasoning is that it's an argument from familiarity dressed up
as an argument from architecture. "This worked before" and "this is correct here"
are different claims, and I couldn't actually distinguish them for this workload.

## Approach

So I measured instead of assuming. I benchmarked Python multithreading against
asyncio on our real workload — the actual login flows and the actual long-running
queries, not a synthetic loop that would have told me whatever I wanted to hear.

**Multithreading won.**

That was not the result I expected, and it's the reason the benchmark was worth
running. If it had confirmed my prior, I'd have learned nothing and shipped the same
code.

## Tradeoffs and Decisions

**Changing the team default.** A benchmark that only changes one branch is a wasted
benchmark. We adopted multithreading team-wide for this class of work, which meant
the finding outlived the specific tickets that prompted it.

**Then teaching it.** Adopting a new default without explaining it produces cargo
cult — people using threads because that's what we do now, with no model of when it
stops being right. So I ran an internal training session on the distinction between
multithreading and parallel processing, which is precisely the confusion that makes
these decisions feel arbitrary.

The goal wasn't to make the team memorize an answer. It was to leave people able to
tell which situation they were in, so the next decision could be made on the merits
instead of by precedent.

**What the result does not mean.** Multithreading won *for our workload*. It isn't a
general verdict on asyncio, and I'd be misrepresenting the finding if I presented it
as one. The transferable part is the method, not the winner.

## Outcome

Two slow paths in the main application optimized on the basis of measurement, a team
default changed to match the evidence, and a shared vocabulary for the underlying
concepts so the next person facing the choice can reason about it themselves.

## What I'd Revisit

I ran the benchmark because I happened to be suspicious of my own preference that
day. That's a fragile way to catch a wrong default — it depends on somebody
remembering to doubt themselves. The improvement isn't to the benchmark, it's to
make measuring the cheap and normal step for this class of decision, so it doesn't
depend on a mood. Anything expensive enough to argue about is usually cheap enough
to test.
