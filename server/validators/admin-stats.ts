import { z } from "zod";

const statRowSchema = z.object({
  contextPlayerId: z.string().trim().min(1),
  playerId: z.string().trim().min(1),
  isGoalkeeper: z.boolean(),
  played: z.boolean(),
  goals: z.number().int().min(0),
  assists: z.number().int().min(0),
  mvp: z.number().int().min(0),
  yellowCards: z.number().int().min(0),
  redCards: z.number().int().min(0),
  recoveries: z.number().int().min(0),
  shots: z.number().int().min(0),
  shotsOnTarget: z.number().int().min(0),
  ownGoals: z.number().int().min(0),
  goalsConceded: z.number().int().min(0),
  saves: z.number().int().min(0),
  cleanSheets: z.number().int().min(0),
});

export const saveAdminStatsInputSchema = z.object({
  matchId: z.string().trim().min(1),
  rows: z.array(statRowSchema).min(1),
});

export type SaveAdminStatsInput = z.infer<typeof saveAdminStatsInputSchema>;
