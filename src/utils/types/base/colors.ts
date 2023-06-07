import { z } from "zod";

export type HexColor = `#${string}`

export const HexColorSchema = z.custom<HexColor>((val) => typeof val == 'string' && val.startsWith('#'))