-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "assignedUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
