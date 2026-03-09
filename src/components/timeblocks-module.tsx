"use client";

import { useState, useRef, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";

type TimeBlock = {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
};

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"];

export function TimeBlocksModule() {
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  const dayStart = 0;
  const dayEnd = 24 * 60;
  const totalMinutes = dayEnd - dayStart;

  const SNAP = 30;

  const timelineRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const draggingId = useRef<string | null>(null);
  const resizingId = useRef<string | null>(null);
  const [createPreview, setCreatePreview] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const dragStartY = useRef(0);
  const blockStartRef = useRef<{ start: number; end: number } | null>(null);

  const creating = useRef(false);
  const createStart = useRef<number>(0);
  const createEnd = useRef<number>(0);

  function formatTime(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  function toMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function minutesToTime(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  function snap(minutes: number) {
    return Math.round(minutes / SNAP) * SNAP;
  }

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }

  function pixelsToMinutes(pixels: number) {
    if (!timelineRef.current) return 0;
    const height = timelineRef.current.getBoundingClientRect().height;
    return (pixels / height) * totalMinutes;
  }

  function clientYToMinutes(clientY: number) {
    if (!timelineRef.current) return 0;

    const rect = timelineRef.current.getBoundingClientRect();
    const y = clientY - rect.top;

    const percent = y / rect.height;
    const minutes = dayStart + percent * totalMinutes;

    return snap(clamp(minutes, dayStart, dayEnd));
  }

  function autoScroll(clientY: number) {
    if (!scrollRef.current) return;

    const rect = scrollRef.current.getBoundingClientRect();
    const edge = 60;

    if (clientY < rect.top + edge) {
      scrollRef.current.scrollTop -= 10;
    } else if (clientY > rect.bottom - edge) {
      scrollRef.current.scrollTop += 10;
    }
  }

  function openCreate(timeStart: string, timeEnd: string) {
    setEditingId(null);
    setTitle("");
    setStart(timeStart);
    setEnd(timeEnd);
    setColor(COLORS[0]);
    setOpen(true);
  }

  function openEdit(block: TimeBlock) {
    setEditingId(block.id);
    setTitle(block.title);
    setStart(block.start);
    setEnd(block.end);
    setColor(block.color);
    setOpen(true);
  }

  function saveBlock() {
    if (!title || !start || !end) return;

    if (editingId) {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === editingId ? { ...b, title, start, end, color } : b,
        ),
      );
    } else {
      const newBlock: TimeBlock = {
        id: crypto.randomUUID(),
        title,
        start,
        end,
        color,
      };

      setBlocks((prev) =>
        [...prev, newBlock].sort(
          (a, b) => toMinutes(a.start) - toMinutes(b.start),
        ),
      );
    }

    setOpen(false);
  }

  function deleteBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  function startCreate(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("[data-event]")) return;

    creating.current = true;
    const minutes = clientYToMinutes(e.clientY);

    createStart.current = minutes;
    createEnd.current = minutes + SNAP;

    setCreatePreview({
      start: minutes,
      end: minutes + SNAP,
    });

    window.addEventListener("pointermove", onCreateMove);
    window.addEventListener("pointerup", stopCreate);
  }

  function onCreateMove(e: PointerEvent) {
    autoScroll(e.clientY);

    const minutes = clientYToMinutes(e.clientY);

    createEnd.current = minutes;

    setCreatePreview({
      start: createStart.current,
      end: minutes,
    });
  }

  function stopCreate() {
    if (!creating.current) return;

    creating.current = false;

    const s = Math.min(createStart.current, createEnd.current);
    const e = Math.max(createStart.current, createEnd.current);

    setCreatePreview(null);

    if (e - s >= SNAP) {
      openCreate(minutesToTime(s), minutesToTime(e));
    }

    window.removeEventListener("pointermove", onCreateMove);
    window.removeEventListener("pointerup", stopCreate);
  }

  function startDrag(e: React.PointerEvent, block: TimeBlock) {
    e.stopPropagation();

    draggingId.current = block.id;
    dragStartY.current = e.clientY;

    blockStartRef.current = {
      start: toMinutes(block.start),
      end: toMinutes(block.end),
    };

    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", stopDrag);
  }

  function onDragMove(e: PointerEvent) {
    autoScroll(e.clientY);

    if (!draggingId.current || !blockStartRef.current) return;

    const deltaY = e.clientY - dragStartY.current;
    const minutesDelta = snap(pixelsToMinutes(deltaY));

    const duration = blockStartRef.current.end - blockStartRef.current.start;

    let newStart = blockStartRef.current.start + minutesDelta;

    newStart = clamp(newStart, dayStart, dayEnd - duration);

    const newEnd = newStart + duration;

    setBlocks((prev) =>
      prev.map((b) =>
        b.id === draggingId.current
          ? {
              ...b,
              start: minutesToTime(newStart),
              end: minutesToTime(newEnd),
            }
          : b,
      ),
    );
  }

  function stopDrag() {
    draggingId.current = null;
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("pointerup", stopDrag);
  }

  function startResize(e: React.PointerEvent, block: TimeBlock) {
    e.stopPropagation();

    resizingId.current = block.id;
    dragStartY.current = e.clientY;

    blockStartRef.current = {
      start: toMinutes(block.start),
      end: toMinutes(block.end),
    };

    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", stopResize);
  }

  function onResizeMove(e: PointerEvent) {
    autoScroll(e.clientY);

    if (!resizingId.current || !blockStartRef.current) return;

    const deltaY = e.clientY - dragStartY.current;
    const minutesDelta = snap(pixelsToMinutes(deltaY));

    let newEnd = blockStartRef.current.end + minutesDelta;

    newEnd = clamp(newEnd, blockStartRef.current.start + SNAP, dayEnd);

    setBlocks((prev) =>
      prev.map((b) =>
        b.id === resizingId.current
          ? {
              ...b,
              end: minutesToTime(newEnd),
            }
          : b,
      ),
    );
  }

  function stopResize() {
    resizingId.current = null;
    window.removeEventListener("pointermove", onResizeMove);
    window.removeEventListener("pointerup", stopResize);
  }

  const layout = useMemo(() => {
    const events = blocks
      .map((b) => ({
        ...b,
        startM: toMinutes(b.start),
        endM: toMinutes(b.end),
      }))
      .sort((a, b) => a.startM - b.startM);

    const columns: (typeof events)[] = [];
    const positioned: any[] = [];

    for (const event of events) {
      let col = 0;

      while (true) {
        if (!columns[col]) columns[col] = [];

        const conflict = columns[col].some(
          (e) => event.startM < e.endM && event.endM > e.startM,
        );

        if (!conflict) {
          columns[col].push(event);
          break;
        }

        col++;
      }

      positioned.push({
        ...event,
        col,
      });
    }

    const totalCols = columns.length;

    return positioned.map((event) => {
      let span = 1;

      for (let i = event.col + 1; i < totalCols; i++) {
        const conflict = positioned.some(
          (e) => e.col === i && event.startM < e.endM && event.endM > e.startM,
        );

        if (conflict) break;

        span++;
      }

      return {
        ...event,
        cols: totalCols,
        span,
      };
    });
  }, [blocks]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden p-4">
      <h3 className="text-lg font-semibold">Time Blocks</h3>

      <ScrollArea className="h-full flex-1" ref={scrollRef}>
        <div className="grid h-225 grid-cols-[60px_1fr]">
          <div className="relative border-r">
            {Array.from({ length: 25 }).map((_, i) => {
              const hour = i;

              return (
                <div
                  key={hour}
                  className="absolute right-2"
                  style={{ top: `${(i / 24) * 100}%` }}
                >
                  {hour}:00
                </div>
              );
            })}
          </div>

          <div
            ref={timelineRef}
            className="relative border-l"
            onPointerDown={startCreate}
          >
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-full border-t"
                style={{ top: `${(i / 24) * 100}%` }}
              />
            ))}

            {createPreview &&
              (() => {
                const start = Math.min(createPreview.start, createPreview.end);
                const end = Math.max(createPreview.start, createPreview.end);

                const top = ((start - dayStart) / totalMinutes) * 100;
                const height = ((end - start) / totalMinutes) * 100;

                return (
                  <div
                    className="bg-muted/40 absolute right-2 left-2 rounded-md border border-dashed p-2"
                    style={{
                      top: `${top}%`,
                      height: `${height}%`,
                    }}
                  >
                    <div className="text-muted-foreground text-sm font-medium">
                      {formatTime(start)} — {formatTime(end)}
                    </div>
                  </div>
                );
              })()}

            {layout.map((block) => {
              const top = ((block.startM - dayStart) / totalMinutes) * 100;
              const height = ((block.endM - block.startM) / totalMinutes) * 100;

              const columnWidth = 100 / block.cols;
              const width = columnWidth * block.span;
              const left = columnWidth * block.col;

              return (
                <div
                  key={block.id}
                  data-event
                  onPointerDown={(e) => startDrag(e, block)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    openEdit(block);
                  }}
                  className="absolute cursor-move rounded-md p-2 shadow"
                  style={{
                    top: `${top}%`,
                    height: `${height}%`,
                    left: `${left}%`,
                    width: `${width}%`,
                    backgroundColor: block.color + "33",
                    borderLeft: `4px solid ${block.color}`,
                  }}
                >
                  <div className="font-medium">{block.title}</div>
                  <div className="text-muted-foreground">
                    {block.start} — {block.end}
                  </div>

                  <div
                    onPointerDown={(e) => startResize(e, block)}
                    className="absolute right-0 bottom-0 left-0 h-2 cursor-ns-resize"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Event" : "Create Event"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex gap-2">
              <Input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="flex-1"
              />

              <Input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={`h-6 w-6 rounded-full border ${
                    color === c ? "ring-primary ring-2" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            {editingId && (
              <Button
                variant="destructive"
                onClick={() => {
                  deleteBlock(editingId);
                  setOpen(false);
                }}
              >
                Delete
              </Button>
            )}

            <Button onClick={saveBlock}>
              {editingId ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
