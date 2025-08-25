-- AlterTable
ALTER TABLE "public"."Portfolio" ALTER COLUMN "phone_no" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "phone" TEXT;
