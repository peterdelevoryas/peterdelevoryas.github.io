+++
title = "Peter Delevoryas"
template = "index.html"
+++

*Infrastructure & Systems Software Engineer — Menlo Park, CA*

Systems software engineer with 8+ years building Linux, virtualization, networking, and AI infrastructure, most recently the VM platform behind Muse, Meta's personal AI agent. Focused on the boundary between host software, virtual machines, accelerators, and device interfaces, and on taking systems from architecture through production operations.

## Experience

**Meta Platforms** - Software Engineer (June 2021-Present)
- Led live updates for Muse, Meta's personal AI agent (launched Sept 2026): designed and shipped continuous deployment with an hourly cadence to millions of always-on per-user VMs. Activity-aware scheduling avoids interrupting 70% of active users (99% of all users).
- Owned and hardened Muse's vhost-user network device in Rust: raised inference success from 94% to 99.95%; designed and implemented dynamic crash restart with no VM restart or agent downtime, developed upstream-first in Cloud Hypervisor (lossless in-order reconnect from virtqueue state in guest memory, no backend inflight tracking); redesigned MAC learning.
- Built a minimal embedded RISC-V Linux distribution from scratch to support the MTIA firmware port from Zephyr to Linux.
- Replaced slow, unreliable MTIA CI with a remote execution service across firmware, driver, and software development; fixed firmware bugs in reset to improve reliability, then scaled to millions of tests/day for hundreds of engineers at p90 queue latency under 10 minutes; later extended to distributed training, inference, HCCL collectives, and mtiavm simulation.
- Created mtiavm, KVM/QEMU-based developer tooling with passthrough for simulated and silicon PCIe devices, clustered environments for distributed-training validation, and vfio-user integration.
- Root-caused crashes in MTIA's first production launch burn-in runs to a memory access pattern that triggered a network-on-chip (NOC) deadlock in silicon; cut repro time from ~24 hours to under 10 seconds.
- Improved QEMU-based OpenBMC bring-up by fixing Aspeed I2C controller behavior and modeling sensors and EEPROMs; built inter-process I2C networking between BMC and NIC emulators.
- Landed upstream Linux kernel and QEMU contributions, including NC-SI support in the kernel driver; debugged rack bring-up failures across software, firmware, and lab hardware.

**Arista Networks** - Software Engineer (May 2018-June 2021)
- Developed software-defined networking features for Broadcom StrataDNX ASICs in EOS using C++ and Python, including policy-based routing, BGP Flowspec optimization, and CPU traffic policies.
- Designed in-place update mechanisms that cut TCAM requirements during hitless configuration changes; profiled with GDB, perf, and flamegraphs to remove programming bottlenecks.

**Mentor Graphics** - Software Engineering Intern (May-Aug 2017)
- Fixed C++ PCB and EDA importer issues, implemented concave-polygon intersection support, and resolved multithreading and stack-corruption bugs.

**Seagate Technology** - Software Engineering Intern (May-Aug 2016)
- Built Python and Matplotlib tooling to visualize HDD read/write latency versus disk utilization.

## Selected Projects

**Ono** - Rust/LLVM language compiler
- Designed and built Ono, a C-like systems language (type inference, tuples, sum types, pattern matching, compile-time constants, C interop) and its compiler in Rust: parser, custom IR, LLVM codegen, GCC-linked objects, regression tests.

**Green Ring** - Xbox-party-chat-style voice hangout for the web ([greenring.ai](https://greenring.ai))
- Invite-only party rooms with real-time voice (LiveKit/WebRTC), presence, and text chat: Rust backend (axum, sqlx/Postgres, Redis, WebSockets), React/TypeScript frontend, single-host Docker deploy, Playwright end-to-end tests.

## Education

**University of Colorado Boulder** - B.S. in Computer Science, GPA 3.887 (May 2018)

## Technical Skills

**Languages:** Rust, C++, Python. **Systems:** Linux, KVM/QEMU, Cloud Hypervisor, virtio, vhost-user, vfio-user, PCIe, OpenBMC, networking, RDMA, containers. **Engineering:** distributed systems, observability, performance debugging, incident response.
