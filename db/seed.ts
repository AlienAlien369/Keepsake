import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { companies, admins, users } from "./schema";
import { hashPassword } from "../lib/password";

async function upsertCompany(name: string, slug: string) {
  const existing = await db.query.companies.findFirst({
    where: eq(companies.slug, slug),
  });
  if (existing) return existing;
  const [created] = await db
    .insert(companies)
    .values({ name, slug })
    .returning();
  return created;
}

async function upsertUser(
  employeeId: string,
  data: Omit<typeof users.$inferInsert, "employeeId">,
) {
  const existing = await db.query.users.findFirst({
    where: eq(users.employeeId, employeeId),
  });
  if (existing) return;
  await db.insert(users).values({ employeeId, ...data });
}

async function main() {
  // --- Companies -------------------------------------------------------
  const acx = await upsertCompany("ACX", "acx");
  const bsl = await upsertCompany("BSL", "bsl");

  // --- Admin account -----------------------------------------------------
  const adminEmail = (
    process.env.ADMIN_EMAIL ?? "admin@keepsake.local"
  ).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-this-password";
  const adminName = process.env.ADMIN_NAME ?? "Lakshya";

  const existingAdmin = await db.query.admins.findFirst({
    where: eq(admins.email, adminEmail),
  });
  if (!existingAdmin) {
    const { salt, hash } = hashPassword(adminPassword);
    await db.insert(admins).values({
      email: adminEmail,
      name: adminName,
      passwordSalt: salt,
      passwordHash: hash,
    });
    console.log(
      `Created admin account: ${adminEmail} (password: ${adminPassword})`,
    );
  } else {
    console.log(`Admin account already exists: ${adminEmail}`);
  }

  // --- Sample employees (safe to delete once you add your own) --------
  await upsertUser("ACX-1001", {
    name: "Rahul Sharma",
    team: "Engineering",
    quote: "Always solving impossible problems.",
    photo:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=Rahul&backgroundColor=c9a227",
    companyId: acx.id,
    message: [
      "Rahul, I still remember the first time you walked into a war room at 2am, laptop half-charged, absolutely convinced you'd already found the bug. You were right, of course. You usually were.",
      "Working next to you taught me that patience and speed aren't opposites — you just made careful things look fast.",
      "Thank you for every late debugging session, every dumb joke that saved a bad afternoon, and every time you said 'let me take a look' before I even had to ask.",
    ],
    timeline: [
      {
        title: "First Meeting",
        description:
          "A rushed handshake outside a stand-up that ran way too long.",
      },
      {
        title: "Funny Moment",
        description:
          "The great production-database naming incident of year two.",
      },
      {
        title: "Project Together",
        description:
          "Six months, one impossible deadline, one very good launch.",
      },
      {
        title: "Coffee Breaks",
        description:
          "The unofficial 4pm meeting that solved more than most real ones.",
      },
      {
        title: "Last Working Day",
        description:
          "A quiet goodbye that didn't feel big enough for how much it meant.",
      },
    ],
    memories: [
      {
        src: "https://picsum.photos/seed/rahul1/800/600",
        caption: "Whiteboard chaos, sprint three.",
      },
      {
        src: "https://picsum.photos/seed/rahul2/800/600",
        caption: "The launch-day team photo.",
      },
      {
        src: "https://picsum.photos/seed/rahul3/800/600",
        caption: "Coffee run, mid-crisis.",
      },
      {
        src: "https://picsum.photos/seed/rahul4/800/600",
        caption: "Last desk cleanout.",
      },
    ],
    gratitude: [
      "Thank you for believing in me when the plan barely made sense.",
      "I'll always remember how calm you stayed when everything else wasn't.",
      "Wishing you endless success and even better coffee wherever you land.",
    ],
  });

  await upsertUser("ACX-1002", {
    name: "Priya Verma",
    team: "Product Design",
    quote: "Made every rough idea feel possible.",
    // photo: "https://api.dicebear.com/9.x/thumbs/svg?seed=Priya&backgroundColor=6c5ce7",
    companyId: acx.id,
    message: [
      "Priya, you have a way of asking one quiet question in a meeting that quietly reframes the entire project.",
      "You made space for ideas that weren't fully formed yet, mine included, and somehow made the roughest sketches feel like they mattered.",
      "Thank you for the honesty, the patience, and for caring about the details nobody else would have caught.",
    ],
    timeline: [
      // {
      //   title: "First Meeting",
      //   description:
      //     "A design review where you politely dismantled my first draft.",
      // },
      // {
      //   title: "Funny Moment",
      //   description:
      //     "The sticky-note wall that took over an entire conference room.",
      // },
      // {
      //   title: "Project Together",
      //   description:
      //     "The redesign that finally made the onboarding flow make sense.",
      // },
      // {
      //   title: "Coffee Breaks",
      //   description: "Tuesdays, always Tuesdays, always too much sugar.",
      // },
      // {
      //   title: "Last Working Day",
      //   description: "A card, a hug, and a promise to keep in touch.",
      // },
    ],
    memories: [
      // {
      //   src: "https://picsum.photos/seed/priya1/800/600",
      //   caption: "The sticky-note wall, day one.",
      // },
      // {
      //   src: "https://picsum.photos/seed/priya2/800/600",
      //   caption: "First usability test that actually worked.",
      // },
      // {
      //   src: "https://picsum.photos/seed/priya3/800/600",
      //   caption: "Team lunch after the big review.",
      // },
      // {
      //   src: "https://picsum.photos/seed/priya4/800/600",
      //   caption: "The desk plant that somehow survived.",
      // },
    ],
    gratitude: [
      "Thank you for believing in ideas before they had proof.",
      "I'll always remember your patience with my rough first drafts.",
      "Wishing you endless success and a studio full of good light.",
    ],
  });

  await upsertUser("BSL-2001", {
    name: "Ankit Rao",
    team: "Operations",
    quote: "Kept the whole team standing.",
    photo:
      "https://api.dicebear.com/9.x/thumbs/svg?seed=Ankit&backgroundColor=2fd9c4",
    companyId: bsl.id,
    message: [
      "Ankit, nobody saw half of what you handled, and that was kind of the point — you made the hard, invisible work look like it wasn't even happening.",
      "You checked in on people before anyone asked you to, and somehow always knew when someone was having a rough week.",
      "I hope your next chapter gives some of that care right back to you.",
    ],
    timeline: [
      {
        title: "First Meeting",
        description:
          "You fixed my badge access on day one before I even asked.",
      },
      {
        title: "Funny Moment",
        description:
          "The office move that took twice as long as planned, and somehow got funnier.",
      },
      {
        title: "Project Together",
        description:
          "The reorg that could have gone badly and, because of you, didn't.",
      },
      {
        title: "Coffee Breaks",
        description:
          "The 9am check-in that was really just a chance to breathe.",
      },
      {
        title: "Last Working Day",
        description:
          "A round of applause you clearly didn't expect and fully deserved.",
      },
    ],
    memories: [
      {
        src: "https://picsum.photos/seed/ankit1/800/600",
        caption: "Office move, box number forty-something.",
      },
      {
        src: "https://picsum.photos/seed/ankit2/800/600",
        caption: "The reorg survival party.",
      },
      {
        src: "https://picsum.photos/seed/ankit3/800/600",
        caption: "Morning check-in, mug in hand.",
      },
      {
        src: "https://picsum.photos/seed/ankit4/800/600",
        caption: "The applause nobody warned him about.",
      },
    ],
    gratitude: [
      "Thank you for believing in the team even on the hardest weeks.",
      "I'll always remember how steady you made everything feel.",
      "Wishing you endless success and a much quieter inbox.",
    ],
  });

  console.log(
    "Seed complete. Companies: ACX, BSL. Sample employee IDs: ACX-1001, ACX-1002, BSL-2001.",
  );
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
