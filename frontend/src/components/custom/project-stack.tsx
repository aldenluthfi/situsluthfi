import { useState } from "react";
import {
    motion,
    AnimatePresence,
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

// depth 0 = front card, deeper cards peek out below and behind
const DEPTH_STYLES = [
    { scale: 1, y: 0, rotate: 0, zIndex: 30 },
    { scale: 0.95, y: 22, rotate: -2.5, zIndex: 20 },
    { scale: 0.9, y: 44, rotate: 2.5, zIndex: 10 },
];

const FrontCard: React.FC<{
    repo: RepositoryObject;
    onDismiss: (dir: number) => void;
}> = ({ repo, onDismiss }) => {
    const reduceMotion = useReducedMotion();
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-12, 12]);

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        const flung =
            Math.abs(info.offset.x) > FLING_DISTANCE ||
            Math.abs(info.velocity.x) > FLING_VELOCITY;
        if (flung) {
            onDismiss(info.offset.x < 0 ? -1 : 1);
        }
    };

    return (
        <motion.div
            className={cn("absolute inset-0 cursor-grab active:cursor-grabbing")}
            style={{ x, rotate, zIndex: DEPTH_STYLES[0].zIndex }}
            drag="x"
            dragSnapToOrigin
            dragElastic={0.6}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            variants={{
                exit: (dir: number) => reduceMotion
                    ? { opacity: 0, transition: { duration: 0.2 } }
                    : { x: dir * 600, rotate: dir * 18, opacity: 0, transition: { duration: 0.35 } },
            }}
            initial={reduceMotion ? false : { scale: 0.95, y: 22, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }}
            exit="exit"
        >
            <ProjectCard repo={repo} />
        </motion.div>
    );
};

const ProjectStack: React.FC<{
    repos: RepositoryObject[];
    loading: boolean;
}> = ({ repos, loading }) => {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    if (loading) {
        return (
            <div className="relative mx-auto w-10/12 desktop:w-full">
                {DEPTH_STYLES.slice().reverse().map((style, i) => (
                    <div
                        key={i}
                        className={cn("inset-0", i === DEPTH_STYLES.length - 1 ? "relative" : "absolute")}
                        style={{ transform: `translateY(${style.y}px) scale(${style.scale}) rotate(${style.rotate}deg)`, zIndex: style.zIndex }}
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
    // `step` moves the deck (+1 next, -1 prev); `exitDir` is the fly-off direction.
    const paginate = (step: number, exitDir: number = step) => {
        setDirection(exitDir);
        setIndex((prev) => (prev + step + count) % count);
    };

    // back cards (depths 1..2) peeking behind the front
    const backCards = DEPTH_STYLES.slice(1)
        .map((style, i) => ({ style, repo: repos[(index + i + 1) % count] }))
        .filter((_, i) => i + 1 < count); // don't duplicate the front card when few repos

    return (
        <div className="mx-auto w-10/12 desktop:w-full select-none">
            <div className="relative">
                {/* invisible sizer gives the absolute stack its height per card */}
                <div className="invisible" aria-hidden>
                    <ProjectCard repo={repos[index]} />
                </div>

                {backCards.map(({ style, repo }) => (
                    <div
                        key={repo.id}
                        className="absolute inset-0 pointer-events-none"
                        style={{ transform: `translateY(${style.y}px) scale(${style.scale}) rotate(${style.rotate}deg)`, zIndex: style.zIndex }}
                        aria-hidden
                    >
                        <ProjectCard repo={repo} />
                    </div>
                ))}

                <AnimatePresence initial={false} custom={direction}>
                    <FrontCard
                        key={repos[index].id}
                        repo={repos[index]}
                        onDismiss={(swipeDir) => paginate(1, swipeDir)}
                    />
                </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:bg-transparent"
                    onClick={() => paginate(-1)}
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
                            onClick={() => {
                                setDirection(i > index ? 1 : -1);
                                setIndex(i);
                            }}
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
                    onClick={() => paginate(1)}
                >
                    <IconChevronRight className="size-6" stroke={1.5} />
                    <span className="sr-only">Next project</span>
                </Button>
            </div>
        </div>
    );
};

export default ProjectStack;
