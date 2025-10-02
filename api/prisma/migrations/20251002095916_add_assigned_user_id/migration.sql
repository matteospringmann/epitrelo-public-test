-- AlterTable
ALTER TABLE "public"."Card" ADD COLUMN     "assignedUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Card" ADD CONSTRAINT "Card_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
