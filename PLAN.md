# PLAN: Hygiene Hero (Monorepo Architecture)

## 1. Goal
Initialize a Turborepo-based Monorepo and build the "Hygiene Hero" Next.js mini-game without cross-app imports and relying heavily on shared UI components.

## 2. Architecture & Data Flow
- **State**: The `GameEngine` acts as the source of truth for:
  - `activeTool` (string | null): The currently selected tool.
  - `progress` (number): 0 to 100 percentage of dirt erased.
- **Layers**:
  - `Base Image` (Clean Girl) absolute positioned behind.
  - `Canvas` (Dirt Overlay) on top, identical width/height.
- **Events**:
  - `onPointerDown/Move/Up` captured by the Canvas. Coordinates will be mapped to the actual canvas drawing space regardless of scaling.
- **Validation**:
  - `isValidScrub(x, y, tool)` checks if `(x,y)` is within arbitrary zones (Teeth, Ears, Face).

## 3. UI/Shared Components First
Following the Shared First heuristic, we'll design:
1. `ProgressBar` (in `packages/ui`)
2. `IconButton` (in `packages/ui`)
3. `Modal` (in `packages/ui` for Win State)

## 4. Execution Steps
1. `npx create-turbo@latest` in `s:\Dev\Monorepo\Hygiene`.
2. Clear out `apps/web/page.tsx`.
3. Scaffold `packages/ui`.
4. Implement the `CanvasEraser` drawing math.
5. Setup the Vercel-ready export/build configuration.
