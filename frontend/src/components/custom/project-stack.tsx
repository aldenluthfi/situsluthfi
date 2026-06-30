import { useRef, useState } from "react";
import {
    motion,
    useReducedMotion,
    useMotionValue,
    useTransform,
    type PanInfo,
} from "motion/react";

import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

import ProjectCard, { ProjectCardSkeleton } from "./project-card";
import type { RepositoryObject } from "@/lib/types";

const FLING_DISTANCE = 120;
const FLING_VELOCITY = 500;

// depth 0 = front card, deeper cards peek out below it (vertical stack).
// positions beyond the last entry reuse the last (back) slot.
const DEPTH_STYLES = [
    { scale: 1, x: 0, y: 0, rotate: 0 },
    { scale: 0.96, x: 0, y: 30, rotate: 0 },
    { scale: 0.92, x: 0, y: 60, rotate: 0 },
];
const BACK = DEPTH_STYLES[DEPTH_STYLES.length - 1];

const depthFor = (pos: number) =>
    DEPTH_STYLES[Math.min(pos, DEPTH_STYLES.length - 1)];

const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

type Exiting = {
    repo: RepositoryObject;
    dir: number;
    fromX: number;
    phase: "out" | "back";
};

type Entering = {
    repo: RepositoryObject;
    dir: number;
    phase: "rise" | "settle";
};

const StackCard: React.FC<{
    repo: RepositoryObject;
    pos: number;
    isFront: boolean;
    onDismiss: (dir: number, fromX: number) => void;
}> = ({ repo, pos, isFront, onDismiss }) => {
    const reduceMotion = useReducedMotion();
    const x = useMotionValue(0);
    const dragRotate = useTransform(x, [-200, 200], [-12, 12]);
    const depth = depthFor(pos);

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        const flung =
            Math.abs(info.offset.x) > FLING_DISTANCE ||
            Math.abs(info.velocity.x) > FLING_VELOCITY;
        if (flung) onDismiss(Math.sign(info.offset.x) || 1, info.offset.x);
    };

    return (
        <motion.div
            className="absolute inset-0"
            style={{ zIndex: DEPTH_STYLES.length - pos }}
            animate={{ scale: depth.scale, x: depth.x, y: depth.y, rotate: depth.rotate }}
            transition={
                reduceMotion
                    ? { duration: 0.2 }
                    : { type: "spring", stiffness: 300, damping: 30 }
            }
        >
            <motion.div
                className={cn(
                    "h-full",
                    isFront && "cursor-grab active:cursor-grabbing",
                )}
                style={{ x, rotate: isFront ? dragRotate : 0 }}
                drag={isFront ? "x" : false}
                dragSnapToOrigin
                dragElastic={0.6}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={isFront ? handleDragEnd : undefined}
            >
                <ProjectCard repo={repo} />
            </motion.div>
        </motion.div>
    );
};

const ProjectStack: React.FC<{
    repos: RepositoryObject[];
    loading: boolean;
}> = ({ repos, loading }) => {
    const reduceMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const [exiting, setExiting] = useState<Exiting | null>(null);
    const [entering, setEntering] = useState<Entering | null>(null);
    // arrow presses alternate the swing direction; swipes follow the actual drag.
    const arrowDir = useRef(1);
    const nextArrowDir = () => {
        const dir = arrowDir.current;
        arrowDir.current = -dir;
        return dir;
    };
    // remember which side each card left from, so moving back returns it on the same side.
    const exitDir = useRef<Map<number, number>>(new Map());

    if (loading) {
        return (
            <div className="relative mx-auto w-10/12 desktop:w-full">
                {DEPTH_STYLES.slice().reverse().map((style, i) => (
                    <div
                        key={i}
                        className={cn("inset-0", i === DEPTH_STYLES.length - 1 ? "relative" : "absolute")}
                        style={{ transform: `translateX(${style.x}px) translateY(${style.y}px) scale(${style.scale}) rotate(${style.rotate}deg)`, zIndex: i }}
                        aria-hidden={i !== DEPTH_STYLES.length - 1}
                    >
                        <ProjectCardSkeleton />
                    </div>
                ))}
            </div>
        );
    }

    if (repos.length === 0) return null;

    const count = repos.length;

    const busy = exiting !== null || entering !== null;

    const dismiss = (dir: number, fromX: number) => {
        if (count < 2) return;
        if (!reduceMotion && busy) return; // one card in flight at a time
        exitDir.current.set(repos[index].id, dir);
        setIndex((prev) => (prev + 1) % count);
        if (!reduceMotion) {
            setExiting({ repo: repos[index], dir, fromX, phase: "out" });
        }
    };

    const retreat = () => {
        if (count < 2) return;
        if (!reduceMotion && busy) return;
        const prevIndex = (index - 1 + count) % count;
        const back = repos[prevIndex];
        // come back on the same side the card left from (falls back to alternating).
        const dir = exitDir.current.get(back.id) ?? nextArrowDir();
        setIndex(prevIndex);
        if (!reduceMotion) {
            // mirror of dismiss: the back card rises out and settles onto the front.
            setEntering({ repo: back, dir, phase: "rise" });
        }
    };

    const containerWidth = containerRef.current?.offsetWidth ?? 320;
    // how far a card swings aside before it changes layers — far enough to fully clear
    // the stack (no clip); the animation is quick to compensate for the longer travel.
    const swingX = containerWidth * 1.1;

    return (
        <div className="mx-auto w-10/12 desktop:w-full select-none">
            <div className="relative" ref={containerRef}>
                {/* invisible sizer gives the absolute stack its height */}
                <div className="invisible" aria-hidden>
                    <ProjectCard repo={repos[index]} />
                </div>

                {repos.map((repo, i) => {
                    if (exiting && repo.id === exiting.repo.id) return null;
                    if (entering && repo.id === entering.repo.id) return null;
                    const pos = (i - index + count) % count;
                    return (
                        <StackCard
                            key={repo.id}
                            repo={repo}
                            pos={pos}
                            isFront={pos === 0}
                            onDismiss={dismiss}
                        />
                    );
                })}

                {/*
                  Dismissed card animates in two phases so it reads like a real hand:
                  "out"  — on top of the pile, lifts up and swings aside.
                  "back" — drops behind the front card and tucks down to the back slot.
                  The zIndex flips between phases so it sits above while swinging out,
                  then under while it returns.
                */}
                {exiting && (
                    <motion.div
                        key={`exiting-${exiting.repo.id}`}
                        className="absolute inset-0 pointer-events-none"
                        style={{ zIndex: exiting.phase === "out" ? 50 : 0 }}
                        initial={{
                            x: exiting.fromX,
                            y: 0,
                            scale: 1,
                            rotate: clamp((exiting.fromX / 200) * 12, -12, 12),
                        }}
                        animate={
                            exiting.phase === "out"
                                ? {
                                    x: exiting.dir * swingX,
                                    y: -12,
                                    scale: 1,
                                    rotate: exiting.dir * 8,
                                }
                                : {
                                    x: BACK.x,
                                    y: BACK.y,
                                    scale: BACK.scale,
                                    rotate: BACK.rotate,
                                }
                        }
                        transition={
                            exiting.phase === "out"
                                ? { duration: 0.22, ease: "easeOut" }
                                : { duration: 0.26, ease: "easeIn" }
                        }
                        onAnimationComplete={() =>
                            setExiting((e) =>
                                e && e.phase === "out" ? { ...e, phase: "back" } : null,
                            )
                        }
                    >
                        <ProjectCard repo={exiting.repo} />
                    </motion.div>
                )}

                {/*
                  Going back (left arrow): the mirror of a dismiss.
                  "rise"   — behind the pile, the back card lifts up and swings aside.
                  "settle" — on top, it swings in and lands on the front.
                */}
                {entering && (
                    <motion.div
                        key={`entering-${entering.repo.id}`}
                        className="absolute inset-0 pointer-events-none"
                        style={{ zIndex: entering.phase === "rise" ? 0 : 50 }}
                        initial={{
                            x: BACK.x,
                            y: BACK.y,
                            scale: BACK.scale,
                            rotate: BACK.rotate,
                        }}
                        animate={
                            entering.phase === "rise"
                                ? {
                                    x: entering.dir * swingX,
                                    y: -12,
                                    scale: 1,
                                    rotate: entering.dir * 8,
                                }
                                : {
                                    x: 0,
                                    y: 0,
                                    scale: 1,
                                    rotate: 0,
                                }
                        }
                        transition={
                            entering.phase === "rise"
                                ? { duration: 0.26, ease: "easeOut" }
                                : { duration: 0.22, ease: "easeOut" }
                        }
                        onAnimationComplete={() =>
                            setEntering((e) =>
                                e && e.phase === "rise" ? { ...e, phase: "settle" } : null,
                            )
                        }
                    >
                        <ProjectCard repo={entering.repo} />
                    </motion.div>
                )}
            </div>

            <div className="flex items-center justify-center gap-2 mt-12 mx-auto w-fit rounded-lg border bg-card px-2 py-1 shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:bg-transparent"
                    onClick={() => { if (count >= 2 && !busy) retreat(); }}
                >
                    <IconChevronLeft className="size-6" stroke={1.5} />
                    <span className="sr-only">Previous project</span>
                </Button>

                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-50">
                    {repos.map((repo, i) => (
                        <button
                            key={repo.id}
                            type="button"
                            aria-label={`Go to project ${i + 1}`}
                            aria-current={i === index}
                            onClick={() => { if (!busy) setIndex(i); }}
                            className={cn(
                                "size-2 rounded-full transition-colors",
                                i === index ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/60",
                            )}
                        />
                    ))}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:bg-transparent"
                    onClick={() => { if (count >= 2 && !busy) dismiss(nextArrowDir(), 0); }}
                >
                    <IconChevronRight className="size-6" stroke={1.5} />
                    <span className="sr-only">Next project</span>
                </Button>
            </div>
        </div>
    );
};

export default ProjectStack;
