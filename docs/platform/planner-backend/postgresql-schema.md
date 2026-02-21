# Receptor Planner: PostgreSQL Schema Design

This document outlines the proposed PostgreSQL database schema to support the Receptor Planner ecosystem. This schema is designed to ingest the solver output configurations, orchestrate historic allocations, and maintain the core terminology abstraction over time.

## Core Schema

```sql
-- 1. Workers (Doctors, Trainees)
CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL, -- e.g., 'PGY1', 'PGY2'
    targeted_pathway VARCHAR(100) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Rotations (Units, Departments)
CREATE TABLE rotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    parent_specialty VARCHAR(100) NOT NULL,
    subspecialty VARCHAR(100) NULL,
    is_service_term BOOLEAN DEFAULT FALSE,
    experience_categories TEXT[] DEFAULT '{}', -- e.g., '{"A", "B"}'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Job Lines (Generated Schedules)
CREATE TABLE job_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    affinity_score NUMERIC(5,2) DEFAULT 0.0,
    diversity_score NUMERIC(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Job Line Allocations (Term by Term mapping)
CREATE TABLE job_line_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_line_id UUID REFERENCES job_lines(id) ON DELETE CASCADE,
    rotation_id UUID REFERENCES rotations(id) ON DELETE RESTRICT,
    term_index INTEGER NOT NULL, -- e.g., 0, 1, 2, 3, 4
    term_length_weeks INTEGER NOT NULL,
    UNIQUE(job_line_id, term_index)
);
```

## Abstract Affinity Mapping

This schema handles the storage of discrete abstraction layers such as the generalized Medical Specialty Interest Survey (MSIS). 

```sql
CREATE TABLE affinity_matrix (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rotation_id_a UUID REFERENCES rotations(id) ON DELETE CASCADE,
    rotation_id_b UUID REFERENCES rotations(id) ON DELETE CASCADE,
    linear_weight INTEGER NOT NULL, -- Scaled between -100 to 100 based on Pearson R
    source_survey VARCHAR(255) NOT NULL,
    UNIQUE (rotation_id_a, rotation_id_b)
);
```
