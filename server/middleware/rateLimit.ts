import type { Request, Response, NextFunction } from "express";

export function createRateLimiter(limit: number, windowMs: number) {
  const attempts = new Map<string, { count: number; resetAt: number }>();
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const current = attempts.get(key);
    if (!current || current.resetAt <= now) attempts.set(key, { count: 1, resetAt: now + windowMs });
    else current.count += 1;
    const active = attempts.get(key)!;
    res.setHeader("RateLimit-Limit", limit);
    res.setHeader("RateLimit-Remaining", Math.max(0, limit - active.count));
    if (active.count > limit) { res.status(429).json({ success: false, message: "Too many requests. Please try again later." }); return; }
    next();
  };
}
