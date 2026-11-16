import { z } from 'zod';

export const prototypeBlockCategoryEnum = z.enum([
  'Power',
  'Compute',
  'Sensing',
  'Connectivity',
  'Actuation',
]);
export type PrototypeBlockCategory = z.infer<typeof prototypeBlockCategoryEnum>;

export const prototypeBusProtocolEnum = z.enum([
  'I2C',
  'SPI',
  'UART',
  'GPIO',
  'ADC',
  'PWM',
  'Power',
]);
export type PrototypeBusProtocol = z.infer<typeof prototypeBusProtocolEnum>;

export const prototypeArchitecturePlanSchema = z.object({
  id: z.string(),
  ideaTitle: z.string().min(3),
  slug: z.string(),
  domain: z.string(),
  targetFormFactor: z.string(),
  summary: z.string(),
  systemBlocks: z.array(
    z.object({
      name: z.string(),
      category: prototypeBlockCategoryEnum,
      icChoice: z.string(),
      function: z.string(),
    })
  ),
  pinoutMapping: z.array(
    z.object({
      pin: z.string(),
      label: z.string(),
      protocol: prototypeBusProtocolEnum,
      connectedTo: z.string(),
    })
  ),
  bom: z.array(
    z.object({
      component: z.string(),
      partNumber: z.string(),
      footprint: z.string(),
      estCostUsd: z.number(),
      estCostInr: z.number(),
      distributor: z.string(),
    })
  ),
  requiredSkills: z.array(
    z.object({
      role: z.string(),
      skills: z.array(z.string()),
      estimatedHours: z.number(),
    })
  ),
  milestones: z.array(
    z.object({
      phase: z.string(),
      durationWeeks: numberOrString(),
      deliverables: z.array(z.string()),
    })
  ),
  estimatedTotalProtoCost: z.object({
    usd: z.number(),
    inr: z.number(),
  }),
});

function numberOrString() {
  return z.number().or(z.string());
}

export type PrototypeArchitecturePlan = z.infer<typeof prototypeArchitecturePlanSchema>;
