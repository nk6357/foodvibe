import { z } from "zod";

const htmlPattern = /<[^>]+>/;

const safeString = (maxLength: number) =>
  z
    .string()
    .max(maxLength)
    .refine((value) => !htmlPattern.test(value), {
      message: "HTML is not allowed",
    });

const rgbColorSchema = z.tuple([
  z.number().int().min(0).max(255),
  z.number().int().min(0).max(255),
  z.number().int().min(0).max(255),
]);

const httpsUrlSchema = z
  .string()
  .url()
  .refine((url) => url.startsWith("https://"), {
    message: "Only HTTPS URLs are allowed",
  });

const socialLinkSchema = z.object({
  type: z.enum(["telegram", "whatsapp", "instagram", "vk", "website", "other"]),
  label: safeString(60),
  url: httpsUrlSchema,
});

const menuItemSchema = z.object({
  id: z.number().int().positive(),
  name: safeString(120),
  description: safeString(500).optional(),
  price: z.number().min(0),
  oldPrice: z.number().min(0).nullable().default(null),
  weight: safeString(40).optional(),
  labels: z.array(safeString(40)).default([]),
  allergens: z.array(safeString(60)).default([]),
  spiceLevel: z.number().int().min(0).max(3).default(0),
  available: z.boolean().default(true),
  hasImage: z.boolean().default(true),
});

const menuCategorySchema = z.object({
  id: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Category id must be lowercase alphanumeric with dashes"),
  name: safeString(80),
  description: safeString(200).optional(),
  items: z.array(menuItemSchema).min(1),
});

const downloadSchema = z.object({
  id: z.string().min(1).max(60),
  title: safeString(120),
  description: safeString(200).optional(),
  file: z.string().min(1),
});

export const menuSchema = z
  .object({
    schemaVersion: z.number().int().positive(),
    restaurant: z.object({
      name: safeString(120),
      shortDescription: safeString(200).optional(),
      description: safeString(1000).optional(),
      currency: z.string().min(3).max(3).default("RUB"),
      locale: z.string().min(2).default("ru-RU"),
      timeZone: z.string().min(1),
      phone: safeString(30).optional(),
      email: z.string().email().optional(),
      address: safeString(200).optional(),
      workingHours: safeString(120).optional(),
      mapUrl: z.union([z.literal(""), httpsUrlSchema]).optional(),
      socialLinks: z.array(socialLinkSchema).default([]),
    }),
    theme: z.object({
      accent: rgbColorSchema,
      background: rgbColorSchema,
      cardStyle: z.enum(["rounded", "sharp"]).default("rounded"),
      imageStyle: z.enum(["cover", "contain"]).default("cover"),
      density: z.enum(["compact", "comfortable", "spacious"]).default("comfortable"),
    }),
    features: z.object({
      search: z.boolean().default(true),
      categoryNavigation: z.boolean().default(true),
      dishModal: z.boolean().default(true),
      contacts: z.boolean().default(true),
      downloadableMenu: z.boolean().default(false),
      showDescriptions: z.boolean().default(true),
      showWeights: z.boolean().default(true),
      showLabels: z.boolean().default(true),
      showAllergens: z.boolean().default(true),
      showSpiceLevel: z.boolean().default(true),
      showUnavailableItems: z.boolean().default(false),
    }),
    legal: z
      .object({
        enabled: z.boolean().default(false),
        version: safeString(20).optional(),
        organizationName: safeString(200).optional(),
        privacyEmail: z.string().email().optional(),
        offerDocument: z.string().optional(),
        privacyDocument: z.string().optional(),
        cookieNotice: z
          .object({
            enabled: z.boolean().default(true),
            text: safeString(500),
            buttonLabel: safeString(60).default("Понятно"),
            privacyLinkLabel: safeString(60).optional(),
          })
          .optional(),
      })
      .default({ enabled: false }),
    seo: z
      .object({
        index: z.boolean().default(true),
        title: z.string().nullable().default(null),
        description: z.string().nullable().default(null),
      })
      .default({ index: true, title: null, description: null }),
    downloads: z.array(downloadSchema).default([]),
    categories: z.array(menuCategorySchema).min(1),
  })
  .superRefine((data, ctx) => {
    const dishIds = new Set<number>();
    const categoryIds = new Set<string>();

    for (const category of data.categories) {
      if (categoryIds.has(category.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate category id: ${category.id}`,
          path: ["categories"],
        });
      }
      categoryIds.add(category.id);

      for (const item of category.items) {
        if (dishIds.has(item.id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate dish id: ${item.id}`,
            path: ["categories"],
          });
        }
        dishIds.add(item.id);

        if (item.oldPrice !== null && item.oldPrice <= item.price) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `oldPrice must be greater than price for dish ${item.id}`,
            path: ["categories"],
          });
        }
      }
    }

    if (data.features.downloadableMenu && data.downloads.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "downloads must not be empty when downloadableMenu is enabled",
        path: ["downloads"],
      });
    }

    if (data.legal.enabled) {
      if (!data.legal.version) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "legal.version is required when legal.enabled is true",
          path: ["legal", "version"],
        });
      }
      if (!data.legal.organizationName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "legal.organizationName is required when legal.enabled is true",
          path: ["legal", "organizationName"],
        });
      }
    }
  });

export type MenuSchemaOutput = z.infer<typeof menuSchema>;
