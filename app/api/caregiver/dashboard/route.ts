import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/prisma/client";

function mapAppStatus(status: string) {
  switch (status) {
    case "APPROVED":
      return "accepted";
    case "REJECTED":
      return "rejected";
    default:
      return "pending";
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const [user, portfolio, applications] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullname: true,
          email: true,
          phone: true,
          created_at: true,
        },
      }),
      prisma.portfolio.findFirst({ where: { user_id: userId } }),
      prisma.application.findMany({
        where: { employee_id: userId },
        orderBy: { applied_at: "desc" },
        include: {
          job: {
            include: { employer: { select: { fullname: true } } },
          },
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const mappedUser = {
      id: user.id,
      name: user.fullname,
      email: user.email,
      phone: user.phone || "",
      location: portfolio?.state_where_experience_gained || "",
      profileImage: portfolio?.profile_image || "",
      joinDate: user.created_at.toISOString().split("T")[0],
      rating: 0,
      completedJobs: 0,
      skills: (portfolio?.comfortability ? portfolio.comfortability.split(",").map(s => s.trim()).filter(Boolean) : []),
      certifications: (portfolio?.certifications ? portfolio.certifications.split(",").map(s => s.trim()).filter(Boolean) : []),
      isVerified: portfolio?.is_verified ?? false,
    };

    const mappedApplications = applications.map((a) => {
      const status = mapAppStatus(a.status);
      const job = a.job;
      const schedule = job.schedule_start && job.schedule_end
        ? `${job.schedule_start.toISOString().split("T")[0]} → ${job.schedule_end.toISOString().split("T")[0]}`
        : job.shift_type;
      return {
        id: a.id,
        jobTitle: job.title,
        company: job.employer.fullname,
        location: job.location,
        jobType: job.shift_type || "Healthcare",
        workType: job.shift_type || "Shift",
        salary: "N/A",
        appliedDate: a.applied_at.toISOString().split("T")[0],
        status,
        message:
          status === "accepted"
            ? "Congratulations! Your application was approved. Our staff will contact you with next steps."
            : status === "rejected"
            ? "Thank you for your application. Unfortunately it was not selected."
            : "Your application is under review. We will notify you once a decision has been made.",
        jobDescription: job.description,
        requirements: job.job_requirements ? job.job_requirements.split(",").map(s => s.trim()).filter(Boolean) : [],
        benefits: [],
        companyRating: null,
        workDetails:
          status === "accepted"
            ? {
                startDate: job.schedule_start ? job.schedule_start.toISOString().split("T")[0] : "TBD",
                schedule,
                salary: "N/A",
                contact: "Staff will reach out",
              }
            : null,
      };
    });

    const completedJobs = mappedApplications.filter(
      (a) => a.status === "accepted"
    ).length;

    mappedUser.completedJobs = completedJobs;

    return NextResponse.json({ user: mappedUser, applications: mappedApplications });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
