CREATE TYPE "UserRole" AS ENUM ('intern', 'admin');
CREATE TYPE "QueryStatus" AS ENUM ('open', 'answered', 'resolved', 'verified', 'closed');
CREATE TYPE "FaqSource" AS ENUM ('existing', 'crowd_sourced');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" "UserRole" NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Query" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "tags" TEXT[],
  "status" "QueryStatus" NOT NULL DEFAULT 'open',
  "latestReplyPreview" TEXT,
  "matchedFaqIds" TEXT[],
  "verifiedReplyId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdBy" TEXT NOT NULL,
  CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Reply" (
  "id" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "authorName" TEXT NOT NULL,
  "authorRole" "UserRole" NOT NULL,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "queryId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FAQ" (
  "id" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "tags" TEXT[],
  "helpfulCount" INTEGER NOT NULL DEFAULT 0,
  "source" "FaqSource" NOT NULL DEFAULT 'crowd_sourced',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

ALTER TABLE "Query" ADD CONSTRAINT "Query_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
