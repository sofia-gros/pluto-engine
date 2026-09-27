# Architecture

PlutoEngine adopts **Data-Oriented Design** to address the performance pitfalls commonly found in traditional Object-Oriented Design (OOD).

## Structure of Arrays (SoA)

Entity data (position, velocity, color, etc.) is not stored as individual objects. Instead, it is stored in contiguous **TypedArrays** such as `Float32Array` or `Uint32Array`.

## Zero-Allocation Principle

Inside the main loop (`update` and `render`), any dynamic memory allocation—including `new`, object literals `{}`, and array `.push()`—is strictly prohibited. This completely prevents GC intervention and eliminates frame rate drops.
