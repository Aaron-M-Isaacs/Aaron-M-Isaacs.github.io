---
title: 'Experimenting with Multithreading and Asyncio'
summary: >-
  Asyncio was the concurrency model I knew and liked. When I benchmarked it against
  multithreading on our actual workload, multithreading won for our specific use cases. 
  So we adapted, and moved forward with implementing multithreading into our app instead
  of Asyncio.
stack:
  - Python
  - Asyncio
  - multithreading
metrics:
  - label: Benchmark winner
    value: 'Multithreading'
  - label: Adoption
    value: 'Team-wide'
order: 4
draft: false
---

## Context

My first look into concurrency and parallelism was a project where I needed to
automate the patching process for tens of servers. The idea was this would save
tens if not hundreds of man hours running patching scripts and ensuring they worked
on each server. I automated this using Asyncio, as it was said to be a 'safe' form 
of concurrency, on a project I was told needed to be bulletproof. That set my
familiarity of concurrency.

Later I was optimizing two slow paths in our team's main web application, login
flows and some long-running database queries.

## Problem

The obvious move was to apply Asyncio, it was a tool I already knew, and it solves
the I/O lag we were experiencing. 

But this was the first time several other engineers on the team were working with
concurrency as well. They didn't know multithreading nor Asyncio, or why one was 
better over the other.

## Approach

I took this as an opportunity to not only dive deeper myself and understand the 
concepts and differences of multithreading and Asyncio, but as an opportunity
where I can share my findings with the team so that everyone understands the 
concepts.

After my deep research, and presenting my findings to the team, a team member
proposed that we have two different feature branches and testing the two approaches
to solve our slow login flow problem, one branch using multithreading and one for 
Asyncio.

**Multithreading won.**

That was not the result I expected, and I'm happy to have learned that multithreading
was faster for our specific use case. From then on, we used multithreading for other
portions of our application, and continue to do so today.


## Outcome

Two slow paths in the main application optimized on the basis of measurement, a team
default adopted to match the evidence, and a shared vocabulary for the underlying
concepts so the next person facing the choice can understand the code, and its
reasoning.