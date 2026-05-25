---
descriptions: Read this file to understand how to fetch data in the project.
---

# Data Fetching Instructions

This document outlines the best practices and guidelines for fetching data in our Next.js application. Adhering to these instructions will help ensure that our data fetching is efficient, maintainable, and consistent across the codebase.

## 1. Use Server Components for Data Fetching

In Next.js ALWAYS use Server Components to fetch data. NEVER use Client Components for data fetching.

## 2. Data Fetching Methods

ALWAYS use the helper functions in the /data directory to fetch data.
NEVER fetch data directly in the components.

ALL helper functions in the /data directory should use Drizzle ORM to interact with the database.
