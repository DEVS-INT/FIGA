-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "schedule_start" DATETIME NOT NULL,
    "schedule_end" DATETIME NOT NULL,
    "shift_type" TEXT NOT NULL,
    "gender_preference" TEXT,
    "driving_license_required" BOOLEAN NOT NULL DEFAULT false,
    "language_level_requirement" TEXT,
    "job_requirements" TEXT,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "posted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deadline" DATETIME,
    "reviewed_by" TEXT,
    "reviewed_at" DATETIME,
    "is_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "job_urgency" TEXT,
    CONSTRAINT "Job_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
