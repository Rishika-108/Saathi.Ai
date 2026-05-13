# AGENT.MD

## Saathi.AI — AI-Governed Emotional Peer Support System

---

# 1. Project Overview

## What is Saathi.AI?

Saathi.AI is an AI-assisted peer support platform designed to reduce emotional isolation through controlled, anonymous, and safety-aware human conversations.

Unlike traditional anonymous chat platforms, Saathi.AI does NOT blindly connect users with similar struggles.

Instead, the platform uses:

* NLP-based emotional understanding
* Risk-aware matching
* Emotional trajectory analysis
* Empathy scoring
* Time-bound interactions
* Real-time escalation systems

to determine:

* whether a peer connection should happen,
* who should connect,
* how long the interaction should last,
* and when intervention may be necessary.

---

# 2. Core Philosophy

## Fundamental Principle

People often seek:

* understanding,
* emotional relatability,
* and human validation.

However, unrestricted peer-support systems can unintentionally:

* amplify emotional distress,
* normalize harmful behavior,
* create dependency loops,
* or escalate crisis situations.

Saathi.AI exists to create:

## "Safe emotional companionship."

---

# 3. Non-Negotiable Ethical Rules

## The system MUST NEVER:

### ❌ Match users solely on:

* suicidal ideation
* self-harm tendencies
* severe emotional collapse
* trauma intensity

### ❌ Encourage:

* emotional dependency
* therapist replacement behavior
* unrestricted anonymous bonding

### ❌ Position AI as:

* a licensed therapist
* medical authority
* psychiatric evaluator

### ❌ Store:

* unnecessary personally identifiable information
* public journals
* permanent raw chat histories

---

# 4. Product Objectives

## Primary Goals

### Goal 1 — Reduce Emotional Isolation

Allow users to feel:

* heard,
* understood,
* and emotionally validated.

---

### Goal 2 — Enable Safe Peer Conversations

Provide:

* temporary,
* anonymous,
* moderated interactions.

---

### Goal 3 — Prevent Harmful Emotional Reinforcement

Avoid:

* negativity spirals,
* co-rumination loops,
* crisis amplification.

---

### Goal 4 — Identify Escalation Signals

Detect:

* crisis language,
* self-harm indicators,
* emotional instability,
* manipulative behavior.

---

# 5. System Architecture

The platform consists of 3 major layers:

---

# 5.1 UI Layer (Visual Experience Layer)

## Interfaces

### A. Authentication Window

Features:

* email/password login
* optional OAuth
* anonymous chat identity generation
* consent acknowledgment

---

### B. Journal Writing Interface

Features:

* free writing
* emotional prompts
* optional mood indicators
* optional tags
* reflection history

Purpose:
Primary emotional input source for AI systems.

---

### C. Dashboard

Displays:

* emotional trajectory
* mood trends
* interaction history
* empathy game score
* wellness insights

Important:
Dashboard language must remain supportive and non-clinical.

Example:
GOOD:
"You seemed more hopeful this week."

BAD:
"Depression score reduced by 13%."

---

### D. Peer Matching Interface

Displays:

* safe match recommendations
* session readiness
* compatibility explanation

Avoid labels like:

* depressed user
* trauma partner
* suicidal match

Use:
"Someone who may relate to your current experience."

---

### E. Chat Interface

Features:

* anonymous names
* timer
* message limits
* moderation notices
* optional reflection prompts

---

### F. Empathy-Based Game Interface

Purpose:
Estimate emotional responsiveness and communication maturity.

Should evaluate:

* listening ability
* emotional interpretation
* conflict response
* supportive reasoning

---

### G. Group/Community Interface

Features:

* temporary small groups
* topic-bound interactions
* moderated discussions

Restrictions:

* no unrestricted public communities
* no permanent anonymous identity culture

---

# 6. Backend Layer

---

# 6.1 User Management Service

Responsibilities:

* user authentication
* anonymous ID generation
* consent management
* account state handling

Important:
Anonymous chat IDs must not expose identity.

---

# 6.2 Journal Storage Service

Responsibilities:

* encrypted journal storage
* private-only access
* AI pipeline forwarding

Rules:

* journals are never public
* users maintain ownership

---

# 6.3 Chat Session Management

Responsibilities:

* create temporary rooms
* assign matched users
* manage timers
* terminate sessions

Constraints:

* time-limited sessions
* message-limited sessions
* cooldown periods

---

# 6.4 Real-Time Communication Service

Technology:

* WebSockets / Socket.IO

Responsibilities:

* live messaging
* moderation hooks
* event streaming
* session state synchronization

---

# 6.5 Safety Orchestration Service

CRITICAL SYSTEM

Responsibilities:

* escalation handling
* moderation routing
* session interruption
* risk monitoring
* therapist recommendation logic

This service has highest execution priority.

---

# 6.6 Data Retention Policy

Chat messages:

* temporary retention
* auto-delete after configured duration

Suggested:
Redis or expiring storage.

Sensitive AI outputs:

* minimized retention
* encrypted storage

---

# 7. AI Intelligence Layer

---

# 7.1 NLP Theme Extraction Agent

Input:
Journal entries

Responsibilities:
Extract:

* emotional themes
* situational context
* recurring stressors
* recovery indicators

Example themes:

* loneliness
* burnout
* breakup
* family pressure
* identity confusion

---

# 7.2 Sentiment & Emotional Trajectory Agent

Responsibilities:
Track:

* emotional stability over time
* optimism/pessimism trends
* volatility changes
* recovery signals

Goal:
Understand emotional movement, not static emotional state.

---

# 7.3 Risk Assessment Agent

Responsibilities:
Detect:

* self-harm indicators
* suicidal language
* hopelessness escalation
* dangerous emotional spirals

Outputs:

* SAFE
* LOW CONCERN
* MODERATE RISK
* HIGH RISK
* CRISIS

Important:
Risk scores are NOT diagnoses.

---

# 7.4 Matching Agent

CORE INTELLIGENCE SYSTEM

Responsibilities:
Determine:

* whether matching is safe
* who should connect
* compatibility strength
* session duration

---

## Matching Principles

### Match Based On:

* shared context
* emotional compatibility
* recovery gradients
* communication maturity

---

### Avoid Matching Based On:

* same crisis intensity
* suicidal similarity
* identical emotional collapse

---

## Recovery Gradient Matching

Preferred structure:

| User A                 | User B                |
| ---------------------- | --------------------- |
| currently struggling   | previously stabilized |
| emotionally vulnerable | emotionally grounded  |
| seeking validation     | capable of empathy    |

Goal:
Prevent emotional amplification loops.

---

# 7.5 Real-Time Chat Monitoring Agent

Responsibilities:
Monitor conversations for:

* crisis escalation
* manipulation
* dependency language
* coercion
* abuse
* emotional deterioration

Possible Actions:

* inject supportive prompts
* recommend pauses
* alert moderators
* terminate session
* trigger escalation

---

# 7.6 Empathy Scoring Agent

Purpose:
Estimate supportive interaction capability.

Signals:

* emotional validation
* listening quality
* aggressive tendencies
* empathy consistency

This influences:

* match quality
* session permissions
* group eligibility

---

# 8. Safety Protocols

---

# 8.1 Escalation Paths

If risk exceeds threshold:

## Stage 1

Soft intervention:

* calming prompts
* grounding suggestions

---

## Stage 2

Conscious alert:
"This platform cannot replace professional support."

---

## Stage 3

Therapist Recommendation

Provide:

* crisis helplines
* professional resources
* regional support options

---

## Stage 4

Human Moderation

Escalate conversation to moderation queue.

---

# 8.2 Session Constraints

To prevent dependency:

* time limits
* message caps
* cooldown intervals
* rotating interactions

---

# 8.3 Dependency Prevention

The system should detect:

* excessive attachment language
* repeated exclusive pairing requests
* emotional over-reliance

Potential action:

* enforced cooldown
* group-based interactions
* moderated communication

---

# 9. AI Guardrails

---

# The AI MUST NEVER:

### ❌ Diagnose disorders

### ❌ Promise emotional recovery

### ❌ Encourage self-isolation

### ❌ Replace licensed professionals

### ❌ Reinforce harmful ideologies

### ❌ Romanticize suffering

### ❌ Facilitate trauma bonding

---

# The AI SHOULD:

### ✅ Encourage healthy reflection

### ✅ Promote emotional grounding

### ✅ Maintain neutral supportive tone

### ✅ Recommend professional help when needed

### ✅ Prioritize user safety over engagement

---

# 10. Suggested Technical Stack

| Layer         | Technology          |
| ------------- | ------------------- |
| Frontend      | Next.js + React     |
| Backend       | Node.js + NestJS    |
| AI Services   | Python + FastAPI    |
| Database      | PostgreSQL          |
| Realtime Chat | Socket.IO           |
| Queue         | Redis + BullMQ      |
| Vector Search | pgvector            |
| Auth          | Supabase/Auth0      |
| Deployment    | Docker + Kubernetes |

---

# 11. Database Concepts

## Suggested Tables

### users

* id
* anonymous_id
* auth_provider
* consent_flags

---

### journals

* id
* user_id
* content
* created_at

---

### ai_analysis

* journal_id
* sentiment
* themes
* risk_level
* trajectory_score

---

### matches

* user_a
* user_b
* compatibility_score
* session_state

---

### chat_sessions

* room_id
* started_at
* ended_at
* escalation_flag

---

### empathy_scores

* user_id
* empathy_index
* communication_rating

---

# 12. Product Boundaries

Saathi.AI is:

* a peer support platform
* an emotional reflection ecosystem
* a safety-aware social AI system

Saathi.AI is NOT:

* therapy
* psychiatry
* emergency intervention
* medical treatment

---

# 13. Success Metrics

Meaningful metrics:

### Emotional Safety Metrics

* escalation prevention rate
* harmful session reduction
* crisis interruption effectiveness

---

### Human Impact Metrics

* repeat healthy engagement
* loneliness reduction feedback
* perceived emotional support

---

### System Quality Metrics

* matching accuracy
* false positive risk alerts
* moderation efficiency

---

# 14. Long-Term Vision

Saathi.AI aims to become:

## "Emotionally safe infrastructure for human connection."

The long-term vision is not maximizing engagement.

It is:

* reducing emotional isolation,
* increasing supportive peer interaction,
* and creating responsible AI-mediated emotional spaces.

---

# 15. Final Principle

The system should always remember:

"Connection is valuable only when it remains emotionally safe."

Safety > Engagement
Human wellbeing > Retention
Ethics > Virality
