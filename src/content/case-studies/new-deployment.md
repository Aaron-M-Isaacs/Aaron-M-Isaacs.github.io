---
title: 'Creating a Modular WebApp'
summary: >-
  Our team's first deployed API. Authentication was deliberately kept outside the
  service, and I experimented with different architectures to determine the right
  one for our team.
stack:
  - Python
  - AWS ECS
  - AWS ECR
  - AWS Lambda
  - AWS EventBridge
  - Docker
  - CI/CD
metrics:
  - label: Impact
    value: 'Major Release'
  - label: Type
    value: 'Architectural Refactor'
order: 1
draft: true
---

## Context

In my role as a software engineer at Koch Capabilities, we developed an internal
web application with hundreds of users, primarily supporting the tax capability.
While the application was completely internal to Koch, we had internal users 
(members of the data capability), as well as "external" users (members of the 
tax capability). For our "internal" users, we developed a system called "Bring
Your Own Page" or BYOP for short. It allowed our data products to develop and publish
their own web page and integrate it into our web application.

## Problem

The way we would need to implement the BYOPs was part of the web application's CI/CD
flow, but as the app grew, and more people were developing BYOPs, it became clear
that this process was unsustainable.

BYOP developers would need to reach out to our team and wait for one of our scheduled 
deployments for our application to bring in their new page. Not to mention the 
overhead that would be required from our team to make sure their deployments went 
smoothly. It also meant that any deployment of our web app would have a high impact,
as even if one page was misconfigured then we'd need to redeploy the whole app to fix
it.

## Approach

I designed a new architecture on a CDK stack where the BYOP developers wouldn't need
to wait for us to deploy, and our own internal pages would adopt the same architecture.
This way, each page in the web application was isolated and could be deployed independent
of the rest of the application. Allowing for more frequent, bite-sized deployments.

The main app would act as a "host" app, managing auth flows, access management, and
hosting the other web pages. While a different CDK stack would hold an ECS cluster
with Fargate nodes, where each node would be a BYOP.

The CI/CD flow for the BYOP pages would deploy a docker image of their BYOP to a specific
ECR repository, then when it lands, it would create an event on an eventbus and trigger a 
lambda, that would then find the new image, find the node that it is correlated with, and
update the node with the new image in real time.

## Outcome

The blast radius of each individual deployment reduced dramatically. Trust in deployments
increased, our development team no longer needed to be a part of BYOP teams' deployments,
and we could develop and deploy faster and safer than before.

Not to mention the security of the app as a whole improved as well. The isolation between
BYOPs made it such that there was no longer a shared environment between the nodes, but
each node could have its own environment variables and session state separate from other 
nodes.