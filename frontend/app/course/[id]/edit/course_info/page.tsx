import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/api";
import EditCourseInfoUI from "./UI";

export default async function EditCourseInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course.data || course.error) {
    notFound();
  }

  return <EditCourseInfoUI course={course.data} />;
}
