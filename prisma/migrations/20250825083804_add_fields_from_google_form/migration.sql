-- AlterTable
ALTER TABLE "public"."Portfolio" ADD COLUMN     "authorized_to_work" TEXT,
ADD COLUMN     "currently_employed" TEXT,
ADD COLUMN     "driving_details" TEXT,
ADD COLUMN     "job_type_preference" TEXT,
ADD COLUMN     "reason_left_previous_job" TEXT;
