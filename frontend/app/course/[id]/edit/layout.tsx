import { notFound } from "next/navigation";
import * as api from "@/lib/api";
import EditCourseHeader from "./_components/EditCourseHeader";
import EditCourseSidebar from "./_components/EditCourseSidebar";

export default async function EditCourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await api.getCourseById(id);

  if (course.error || !course.data) {
    notFound();
  }

  return (
    <div className="w-full h-full bg-[#F1F3F5]">
      <EditCourseHeader title={course.data?.title} />
      <div className="p-12 flex gap-12 min-h-screen max-w-5xl">
        <EditCourseSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
