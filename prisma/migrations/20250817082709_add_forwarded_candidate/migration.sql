-- CreateTable
CREATE TABLE "public"."ForwardedCandidate" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "employer_id" TEXT NOT NULL,
    "application_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForwardedCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForwardedCandidate_job_id_application_id_key" ON "public"."ForwardedCandidate"("job_id", "application_id");

-- AddForeignKey
ALTER TABLE "public"."ForwardedCandidate" ADD CONSTRAINT "ForwardedCandidate_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForwardedCandidate" ADD CONSTRAINT "ForwardedCandidate_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForwardedCandidate" ADD CONSTRAINT "ForwardedCandidate_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
