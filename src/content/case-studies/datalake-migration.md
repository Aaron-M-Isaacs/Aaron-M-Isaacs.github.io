---
title: 'Migrating a Legacy Datalake'
summary: >-
  A legacy datalake application needed to change MFA services, and the maintainer
  was on parental leave. With responsibilities falling to me, and a strict deadline
  I needed to migrate this critical service before it starts costing the company even
  more money.
stack:
  - Typescript
  - Auth
  - Datalake
metrics:
  - label: Language
    value: 'Typescript'
  - label: Type
    value: 'Architectural Refactor'
order: 3
draft: false
---

## Context

Our organization was changing from one MFA service to another, and for most applications
this wasn't too difficult. I had set the standard for how to do it for our primary web
application, and guided others through the process as well.

There was a deadline to migrating however, and if we failed to meet the deadline, the
company would face hefty fines.

## Problem

One critical application in our stack, a legacy datalake solution, needed to be migrated
as well. The maintainer for the application had *just* gone on paternity leave, so his
responsibilities fell to me.

This application was rather old, it was built years before I had even become a developer,
and it was built by people that were no longer in the company, let alone on the team. The
aforementioned maintainer had barely worked on it before it was completed, and he was a
junior engineer when it was created.

I had just over a month and a half to work with the MFA team (who were already bogged down
working with teams across the entire company and helping migrate other applications), and
get this application migrated, or else our team would be billed hefty fines.

## Approach

Prior to the maintainer going on leave, I held several meetings with him. Going over the
parts that would need to change, the techniques he tried, the people he'd worked with on
the MFA team, the various different aspects of the code, what they do, architecture diagrams,
automation flows, getting up to speed as much as I could before he left.

Then, I dug in deep. I learned a cursory amount of Typescript so that I could understand the
syntax even better. I dug through many sections of the code, following functions and their
calls until I found definitions. I drew maps on my white board showing where critical 
variables where going, how they were manipulated, what they influenced. I held calls with
members of other teams in the organization to understand their processes, how they did
with their legacy applications.

## Outcome

It was tight, but I did end up successfully migrating both the dev and production instances
of the accounts with a few days to spare. It took lots of effort, days back and forth with
members of the MFA team, and consultation with engineers across the organization, but in the
end, I was able to save the company from paying exorbitant fees, and migrated the legacy app
on time.