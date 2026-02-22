# Job Line Compliance Tool

## Overview
The Job Line Compliance tool is a Python-based constraint solving engine designed to facilitate the complex assignment of medical rotations to job lines for junior doctors. It uses the `ortools.sat.python.cp_model` to optimise the distribution of positions across job lines given a set of compliance rules and availability constraints.

This tool evaluates positions, limits on rural placements, specialty assignments, and ensures continuous employment over a 52-week period (including mandatory leave).

## Core Responsibilities
- **Data Ingestion**: Fetches job line models, available positions, and current allocation runs from Supabase.
- **Constraint Representation**: Maps clinical requirements (e.g. max 1 rural rotation, exact 5 weeks annual leave) into boolean and interval variables.
- **Optimisation**: Solves the assignment matrix using OR-Tools, maximizing diversity of team category assignments while satisfying all hard rules.
- **Data Export**: Syncs successful assignments back to the Supabase database.

## Entry Point
- `backend/job-line-compliance/main.py`: Main execution script. Connects to database, sets problem parameters, invokes the solver, and triggers the update pipeline.
